package kr.kro.areuhot.robot.service;

import kr.kro.areuhot.alert.dto.AlertMessageDto;
import kr.kro.areuhot.robot.dto.RobotPositionMessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RobotSocketService {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendRobotPosition(Integer warehouseId, RobotPositionMessageDto position) {
        messagingTemplate.convertAndSend(
                "/topic/warehouses/" + warehouseId + "/position",
                position
        );
    }

    public void sendAlert(Integer warehouseId, AlertMessageDto alert) {
        messagingTemplate.convertAndSend(
                "/topic/warehouses" + warehouseId + "/alert",
                alert
        );
    }

}
