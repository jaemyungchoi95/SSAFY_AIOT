package kr.kro.areuhot.alert.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import kr.kro.areuhot.alert.dto.RobotAlertMessage;
import kr.kro.areuhot.alert.util.PemSocketFactory;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
public class MqttClientService {

    @Value("${mqtt.endpoint}")
    private String mqttEndpoint;

    @Value("${mqtt.port}")
    private int mqttPort;

    @Value("${mqtt.topic}")
    private String mqttTopic;

    @Value("${mqtt.client.id}")
    private String clientId;

    @Autowired
    private S3CertificateDownloadService certificateDownloadService;

    @Autowired
    private AlertService alertService;

    private MqttClient mqttClient;
    private ObjectMapper objectMapper;
    private final AtomicBoolean isInitialized = new AtomicBoolean(false);
    private final AtomicBoolean isConnecting = new AtomicBoolean(false);
    private final AtomicInteger reconnectAttempts = new AtomicInteger(0);
    private static final int MAX_RECONNECT_ATTEMPTS = 5;
    private static final long RECONNECT_DELAY_MS = 5000; // 5초

    @PostConstruct
    @Async("mqttTaskExecutor")
    public void init() {
        try {
            log.info("MQTT 클라이언트 초기화 시작...");
            
            // 인증서 다운로드
            certificateDownloadService.downloadCertificates();
            
            // ObjectMapper 초기화
            objectMapper = new ObjectMapper();
            
            // MQTT 클라이언트 생성 및 연결
            connectToMqttBroker();
            
            isInitialized.set(true);
            log.info("MQTT 클라이언트 초기화 완료");
        } catch (Exception e) {
            log.error("MQTT 클라이언트 초기화 실패", e);
            // 초기화 실패해도 애플리케이션은 계속 실행
            scheduleReconnect();
        }
    }

    private void connectToMqttBroker() throws MqttException {
        if (isConnecting.get()) {
            log.warn("이미 연결 시도 중입니다.");
            return;
        }
        
        isConnecting.set(true);
        
        try {
            String serverUri = "ssl://" + mqttEndpoint + ":" + mqttPort;
            log.info("MQTT 브로커 연결 시도: {}", serverUri);
            
            // MQTT 클라이언트 생성
            mqttClient = new MqttClient(serverUri, clientId + "-" + System.currentTimeMillis());
            
            // 연결 옵션 설정
            MqttConnectOptions connectOptions = new MqttConnectOptions();
            
            // TLS 인증서 설정
            String caCertPath = certificateDownloadService.getCertificatePath("AmazonRootCA1.pem");
            String clientCertPath = certificateDownloadService.getCertificatePath("certificate.pem.crt");
            String privateKeyPath = certificateDownloadService.getCertificatePath("private.pem.key");
            
            PemSocketFactory.configureMqttConnectOptions(connectOptions, caCertPath, clientCertPath, privateKeyPath);
            
            // AWS IoT Core 최적화 설정
            connectOptions.setConnectionTimeout(30);
            connectOptions.setKeepAliveInterval(60);
            connectOptions.setAutomaticReconnect(true);
            connectOptions.setCleanSession(true);
            connectOptions.setMaxInflight(1000);
            
            // 콜백 설정
            mqttClient.setCallback(new MqttCallback() {
                @Override
                public void connectionLost(Throwable cause) {
                    log.error("MQTT 연결이 끊어졌습니다", cause);
                    isConnecting.set(false);
                    scheduleReconnect();
                }

                @Override
                public void messageArrived(String topic, MqttMessage message) {
                    try {
                        String payload = new String(message.getPayload());
                        log.info("MQTT 메시지 수신 - 토픽: {}, 페이로드: {}", topic, payload);
                        
                        // JSON 파싱
                        RobotAlertMessage robotAlert = objectMapper.readValue(payload, RobotAlertMessage.class);
                        
                        // 로그 출력
                        log.info("=== 로봇 알림 메시지 ===");
                        log.info("Spot UUID: {}", robotAlert.getSpotUuid());
                        log.info("Robot ID: {}", robotAlert.getRobotId());
                        log.info("Temperature: {}°C", robotAlert.getTemperature());
                        log.info("Thermal Image URL: {}", robotAlert.getImageThermalUrl());
                        log.info("Normal Image URL: {}", robotAlert.getImageNormalUrl());
                        log.info("Created At: {}", robotAlert.getCreatedAt());
                        log.info("========================");
                        
                        // Alert 테이블에 저장
                        alertService.saveAlertFromMqtt(robotAlert);
                        
                    } catch (Exception e) {
                        log.error("MQTT 메시지 처리 실패", e);
                    }
                }

                @Override
                public void deliveryComplete(IMqttDeliveryToken token) {
                    log.debug("MQTT 메시지 전송 완료");
                }
            });
            
            // 연결
            mqttClient.connect(connectOptions);
            log.info("MQTT 브로커 연결 성공");
            
            // 토픽 구독
            mqttClient.subscribe(mqttTopic, 1);
            log.info("MQTT 토픽 구독 완료: {}", mqttTopic);
            
            // 재연결 시도 카운터 리셋
            reconnectAttempts.set(0);
            
        } finally {
            isConnecting.set(false);
        }
    }
    
    private void scheduleReconnect() {
        int attempts = reconnectAttempts.incrementAndGet();
        
        if (attempts <= MAX_RECONNECT_ATTEMPTS) {
            log.info("MQTT 재연결 시도 {} / {}", attempts, MAX_RECONNECT_ATTEMPTS);
            
            new Thread(() -> {
                try {
                    Thread.sleep(RECONNECT_DELAY_MS * attempts); // 지수 백오프
                    if (!isConnected()) {
                        connectToMqttBroker();
                    }
                } catch (Exception e) {
                    log.error("MQTT 재연결 시도 실패", e);
                    if (attempts < MAX_RECONNECT_ATTEMPTS) {
                        scheduleReconnect();
                    }
                }
            }).start();
        } else {
            log.error("MQTT 최대 재연결 시도 횟수 초과. 수동 재연결이 필요합니다.");
        }
    }

    @PreDestroy
    public void cleanup() {
        try {
            if (mqttClient != null && mqttClient.isConnected()) {
                mqttClient.disconnect();
                mqttClient.close();
                log.info("MQTT 클라이언트 연결 종료");
            }
        } catch (MqttException e) {
            log.error("MQTT 클라이언트 종료 중 오류 발생", e);
        }
    }

    public boolean isConnected() {
        return mqttClient != null && mqttClient.isConnected();
    }
    
    public boolean isInitialized() {
        return isInitialized.get();
    }
    
    public void reconnect() {
        log.info("수동 MQTT 재연결 시도");
        reconnectAttempts.set(0);
        scheduleReconnect();
    }
} 