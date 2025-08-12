package kr.kro.areuhot.common.websocket;

import lombok.Getter;

@Getter
public enum WebSocketTopic {
    ALERT("alert", false),
    POSITION("position", true),
    MAP_READY("map", false);

    private final String topicName;
    private final boolean warehouseScoped;

    WebSocketTopic(String topicName, boolean warehouseScoped) {
        this.topicName = topicName;
        this.warehouseScoped = warehouseScoped;
    }
}
