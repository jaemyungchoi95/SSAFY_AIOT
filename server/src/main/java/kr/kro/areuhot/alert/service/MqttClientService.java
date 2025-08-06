package kr.kro.areuhot.alert.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import kr.kro.areuhot.alert.dto.RobotAlertMessage;
import kr.kro.areuhot.alert.util.PemSocketFactory;
import kr.kro.areuhot.robot.service.RobotService;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.*;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
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

    @Value("${mqtt.topic.location}")
    private String mqttLocationTopic;

    @Value("${mqtt.client.id}")
    private String clientId;

    @Value("${mqtt.connection.timeout}")
    private int connectionTimeout;

    @Value("${mqtt.keepalive.interval}")
    private int keepAliveInterval;

    @Value("${mqtt.max.inflight}")
    private int maxInflight;

    @Value("${mqtt.reconnect.max.attempts}")
    private int maxReconnectAttempts;

    @Value("${mqtt.reconnect.delay.ms}")
    private long reconnectDelayMs;

    @Value("${mqtt.certificate.ca}")
    private String caCertificateName;

    @Value("${mqtt.certificate.client}")
    private String clientCertificateName;

    @Value("${mqtt.certificate.private}")
    private String privateKeyName;

    @Value("${mqtt.qos}")
    private int qos;

    @Autowired
    private S3CertificateDownloadService certificateDownloadService;

    @Autowired
    private AlertService alertService;

    @Autowired
    private RobotService robotService;

    private MqttClient mqttClient;
    private ObjectMapper objectMapper;
    private final AtomicBoolean isInitialized = new AtomicBoolean(false);
    private final AtomicBoolean isConnecting = new AtomicBoolean(false);
    private final AtomicInteger reconnectAttempts = new AtomicInteger(0);

    @PostConstruct
    @Async("mqttTaskExecutor")
    public void init() {
        try {
            log.info("MQTT 클라이언트 초기화 시작...");
            
            // 인증서 다운로드
            certificateDownloadService.downloadCertificates();
            
            // ObjectMapper 초기화 (JSR310 모듈 등록)
            objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            
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
            
            // MQTT 클라이언트 생성 (메모리 기반 저장소 사용으로 .lck 파일 생성 방지)
            MemoryPersistence persistence = new MemoryPersistence();
            mqttClient = new MqttClient(serverUri, clientId + "-" + System.currentTimeMillis(), persistence);
            
            // 연결 옵션 설정
            MqttConnectOptions connectOptions = new MqttConnectOptions();
            
            // TLS 인증서 설정
            String caCertPath = certificateDownloadService.getCertificatePath(caCertificateName);
            String clientCertPath = certificateDownloadService.getCertificatePath(clientCertificateName);
            String privateKeyPath = certificateDownloadService.getCertificatePath(privateKeyName);
            
            PemSocketFactory.configureMqttConnectOptions(connectOptions, caCertPath, clientCertPath, privateKeyPath);
            
            // AWS IoT Core 최적화 설정
            connectOptions.setConnectionTimeout(connectionTimeout);
            connectOptions.setKeepAliveInterval(keepAliveInterval);
            connectOptions.setAutomaticReconnect(true);
            connectOptions.setCleanSession(true);
            connectOptions.setMaxInflight(maxInflight);
            
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
                        
                        if (topic.equals(mqttTopic)) {
                            // 알림 메시지 처리
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

                        } else if (topic.equals(mqttLocationTopic)) {
                            // 위치 메시지 처리
                            kr.kro.areuhot.robot.dto.RobotLocationMessageDto robotLocation =
                                objectMapper.readValue(payload, kr.kro.areuhot.robot.dto.RobotLocationMessageDto.class);

                            // 로그 출력
                            log.info("=== 로봇 로그 메시지 ===");
                            log.info("Robot ID: {}", robotLocation.getRobotId());
                            log.info("X: {}, Y: {}", robotLocation.getX(), robotLocation.getY());
                            log.info("Direction: {}", robotLocation.getDirection());
                            log.info("Created At: {}", robotLocation.getCreatedAt());
                            log.info("========================");

                            // Robot 로그 테이블에 저장
                            robotService.saveRobotLogFromMqtt(robotLocation);
                        }

                    } catch (Exception e) {
                        log.error("MQTT 메시지 처리 실패", e);
                        log.error("페이로드 내용: {}", new String(message.getPayload()));
                        log.error("오류 상세: {}", e.getMessage());
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
            mqttClient.subscribe(mqttTopic, qos);
            mqttClient.subscribe(mqttLocationTopic, qos);
            log.info("MQTT 토픽 구독 완료: {} {}", mqttTopic, mqttLocationTopic);
            
            // 재연결 시도 카운터 리셋
            reconnectAttempts.set(0);
            
        } finally {
            isConnecting.set(false);
        }
    }
    
    private void scheduleReconnect() {
        int attempts = reconnectAttempts.incrementAndGet();
        
        if (attempts <= maxReconnectAttempts) {
            log.info("MQTT 재연결 시도 {} / {}", attempts, maxReconnectAttempts);
            
            new Thread(() -> {
                try {
                    Thread.sleep(reconnectDelayMs * attempts); // 지수 백오프
                    if (!isConnected()) {
                        connectToMqttBroker();
                    }
                } catch (Exception e) {
                    log.error("MQTT 재연결 시도 실패", e);
                    if (attempts < maxReconnectAttempts) {
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