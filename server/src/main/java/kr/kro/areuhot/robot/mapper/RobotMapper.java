package kr.kro.areuhot.robot.mapper;

import kr.kro.areuhot.robot.model.RobotLog;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RobotMapper {
    int findWarehouseIdByRobotId(Integer robotId);
    int insertRobotLog(RobotLog robotLog);
}
