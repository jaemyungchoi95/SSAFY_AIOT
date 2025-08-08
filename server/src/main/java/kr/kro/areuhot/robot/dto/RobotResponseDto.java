package kr.kro.areuhot.robot.dto;

import kr.kro.areuhot.robot.model.RobotStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class RobotResponseDto {
    private Integer robotId;
    private String name;
    private RobotStatus status;
    private LocalDateTime createdAt;
}
