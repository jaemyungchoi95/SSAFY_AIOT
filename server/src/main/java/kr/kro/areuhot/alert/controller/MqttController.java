package kr.kro.areuhot.alert.controller;

import kr.kro.areuhot.alert.service.MqttClientService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/mqtt")
public class MqttController {

    @Autowired
    private MqttClientService mqttClientService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getMqttStatus() {
        Map<String, Object> response = new HashMap<>();
        boolean isConnected = mqttClientService.isConnected();
        boolean isInitialized = mqttClientService.isInitialized();

        response.put("connected", isConnected);
        response.put("initialized", isInitialized);
        response.put("status", isConnected ? "CONNECTED" : (isInitialized ? "DISCONNECTED" : "INITIALIZING"));
        response.put("timestamp", System.currentTimeMillis());

        log.info("MQTT 상태 확인: {}", response);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reconnect")
    public ResponseEntity<Map<String, Object>> reconnectMqtt() {
        Map<String, Object> response = new HashMap<>();
        try {
            mqttClientService.reconnect();
            response.put("success", true);
            response.put("message", "MQTT 재연결 시도가 시작되었습니다.");
            response.put("timestamp", System.currentTimeMillis());
            log.info("MQTT 수동 재연결 요청 처리됨");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("MQTT 재연결 요청 처리 실패", e);
            response.put("success", false);
            response.put("message", "MQTT 재연결 시도 중 오류가 발생했습니다: " + e.getMessage());
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.internalServerError().body(response);
        }
    }
} 