package kr.kro.areuhot.robot.service;

import kr.kro.areuhot.common.exception.CustomException;
import kr.kro.areuhot.common.exception.ErrorCode;
import kr.kro.areuhot.common.websocket.WebSocketPublisher;
import kr.kro.areuhot.common.websocket.WebSocketTopic;
import kr.kro.areuhot.robot.dto.RobotLocationMessageDto;
import kr.kro.areuhot.robot.dto.RobotPositionMessageDto;
import kr.kro.areuhot.robot.dto.RobotResponseDto;
import kr.kro.areuhot.robot.mapper.RobotMapper;
import kr.kro.areuhot.robot.model.RobotLog;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RobotService {
    private final RobotMapper robotMapper;
    private final WebSocketPublisher publisher;

    public Integer findWarehouseIdByRobotId(Integer robotId) {
        return robotMapper.findWarehouseIdByRobotId(robotId);
    }

    @Transactional
    public void saveRobotLogFromMqtt(RobotLocationMessageDto message) {
        try {
            log.info("MQTT 로봇 로그 메시지 저장 시작: robot_id={}, x={}, y={}", 
                    message.getRobotId(), message.getX(), message.getY());

            LocalDateTime now = LocalDateTime.now();
            RobotLog robotLog = new RobotLog();
            robotLog.setRobotId(message.getRobotId());
            robotLog.setX(message.getX());
            robotLog.setY(message.getY());
            robotLog.setDirection(message.getDirection());
            robotLog.setCreatedAt(message.getCreatedAt() != null ? message.getCreatedAt() : now);

            int result = robotMapper.insertRobotLog(robotLog);
            
            if (result > 0) {
                log.info("로봇 로그 저장 성공: robot_id={}, id={}", 
                        message.getRobotId(), robotLog.getId());
                publishRobotLocation(robotLog);
            } else {
                log.error("로봇 로그 저장 실패: robot_id={}", message.getRobotId());
            }

        } catch (Exception e) {
            log.error("MQTT 로봇 로그 메시지 저장 중 오류 발생", e);
        }
    }

    public void publishRobotLocation(RobotLog dto) {
        Integer warehouseId = findWarehouseIdByRobotId(dto.getRobotId());
        if(warehouseId == null) {
            log.warn("로봇 warehouseId 조회 실패: robot_id={}", dto.getRobotId());
            return;
        }
        RobotPositionMessageDto message = RobotPositionMessageDto.builder()
                .robotId(dto.getRobotId())
                .x(dto.getX())
                .y(dto.getY())
                .direction(dto.getDirection())
                .build();

        publisher.send(warehouseId, WebSocketTopic.POSITION, message);
    }

    public List<RobotResponseDto> findRobotListByWarehouseId(Integer warehouseId) {
        List<RobotResponseDto> robots = robotMapper.findRobotListByWarehouseId(warehouseId);
        if(robots.isEmpty()) {
            throw new CustomException(ErrorCode.ROBOT_NOT_FOUND);
        }
        return robots;
    }
}
