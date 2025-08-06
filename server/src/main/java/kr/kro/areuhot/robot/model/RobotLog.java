package kr.kro.areuhot.robot.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RobotLog {
    private Long id;
    private Integer robotId;
    private Double x;
    private Double y;
    private Float direction;
    private LocalDateTime createdAt;
} 