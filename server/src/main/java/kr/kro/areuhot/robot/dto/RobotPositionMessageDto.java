package kr.kro.areuhot.robot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class RobotPositionMessageDto {
    private Integer robotId;
    private Double x;
    private Double y;
    private Float direction;
}
