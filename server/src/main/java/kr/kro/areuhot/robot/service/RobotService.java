package kr.kro.areuhot.robot.service;

import kr.kro.areuhot.robot.dto.RobotLocationMessageDto;
import kr.kro.areuhot.robot.mapper.RobotMapper;
import kr.kro.areuhot.robot.model.RobotLog;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class RobotService {
    private final RobotMapper robotMapper;

    public int findWarehouseIdByRobotId(Integer robotId) {
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
            } else {
                log.error("로봇 로그 저장 실패: robot_id={}", message.getRobotId());
            }

        } catch (Exception e) {
            log.error("MQTT 로봇 로그 메시지 저장 중 오류 발생", e);
        }
    }


}
