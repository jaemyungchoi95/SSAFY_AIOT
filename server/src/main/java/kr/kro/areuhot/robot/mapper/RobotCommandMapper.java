package kr.kro.areuhot.robot.mapper;

import kr.kro.areuhot.robot.model.RobotCommand;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface RobotCommandMapper {
    int insertRobotCommand(RobotCommand command);
}
