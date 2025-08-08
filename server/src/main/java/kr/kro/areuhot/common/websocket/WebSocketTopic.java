package kr.kro.areuhot.common.websocket;

import lombok.Getter;

@Getter
public enum WebSocketTopic {
    ALERT("alert"),
    POSITION("position"),
    MAP_READY("map");

    private final String topicName;

    WebSocketTopic(String topicName) {
        this.topicName = topicName;
    }
}
