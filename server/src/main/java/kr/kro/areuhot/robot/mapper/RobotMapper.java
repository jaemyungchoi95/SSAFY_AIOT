package kr.kro.areuhot.robot.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RobotMapper {
    int findWarehouseIdByRobotId(Integer robotId);
}
