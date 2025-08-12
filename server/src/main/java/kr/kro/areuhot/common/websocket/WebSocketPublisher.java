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
    private static final String TOPIC_PREFIX = "/topic/warehouses";

    public void send(Integer warehouseId, WebSocketTopic topic, Object payload) {
        String combinedTopic = buildTopic(warehouseId, topic);

        try {
            messagingTemplate.convertAndSend(combinedTopic, payload);
            log.info("웹소켓 메시지 발행 성공: topic={}", combinedTopic);
        } catch (Exception e) {
            log.error("웹소켓 메시지 발행 실패: topic={}", combinedTopic, e);
        }
    }

    public void send(WebSocketTopic topic, Object payload) {
        send(null, topic, payload);
    }

    private String buildTopic(Integer warehouseId, WebSocketTopic topic) {
        if(topic == null) throw new IllegalArgumentException("topic이 비어있습니다.");

        if(topic.isWarehouseScoped() && warehouseId != null) {
            return String.format("%s/%d/%s", TOPIC_PREFIX, warehouseId, topic.getTopicName());
        } else {
            return String.format("%s/%s", TOPIC_PREFIX, topic.getTopicName());
        }
    }
}
