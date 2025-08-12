package kr.kro.areuhot.robot.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Robot {
    private Integer id;
    private Integer warehouseId;
    private String name;
    private RobotStatus status;
    private LocalDateTime createdAt;
}
