package kr.kro.areuhot.common.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketPublisher {
    private final SimpMessagingTemplate messagingTemplate;
    private static final String TOPIC_FORMAT = "/topic/warehouses/%d/%s";

    public void send(int warehouseId, WebSocketTopic topic, Object payload) {
        String combinedTopic = String.format(TOPIC_FORMAT, warehouseId, topic.getTopicName());

        try {
            messagingTemplate.convertAndSend(combinedTopic, payload);
            log.info("웹소켓 메시지 발행 성공: topic={}", combinedTopic);
        } catch (Exception e) {
            log.error("웹소켓 메시지 발행 실패: topic={}", combinedTopic, e);
        }
    }
}
