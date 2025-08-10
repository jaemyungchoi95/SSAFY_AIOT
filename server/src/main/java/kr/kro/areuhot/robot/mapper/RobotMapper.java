package kr.kro.areuhot.robot.mapper;

import kr.kro.areuhot.robot.dto.RobotResponseDto;
import kr.kro.areuhot.robot.model.RobotLog;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RobotMapper {
    int findWarehouseIdByRobotId(Integer robotId);
    int insertRobotLog(RobotLog robotLog);
    List<RobotResponseDto> findRobotListByWarehouseId(Integer warehouseId);
}
