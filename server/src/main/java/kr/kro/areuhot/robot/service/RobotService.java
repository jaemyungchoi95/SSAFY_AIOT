package kr.kro.areuhot.robot.service;

import kr.kro.areuhot.robot.mapper.RobotMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RobotService {
    private final RobotMapper robotMapper;

    public int findWarehouseIdByRobotId(int robotId) {
        return robotMapper.findWarehouseIdByRobotId(robotId);
    }
}
