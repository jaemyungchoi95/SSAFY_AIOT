package kr.kro.areuhot.common.websocket;

import lombok.Getter;

@Getter
public enum WebSocketTopic {
    ALERT("alert"),
    POSITION("position");

    private final String topicName;

    WebSocketTopic(String topicName) {
        this.topicName = topicName;
    }
}
