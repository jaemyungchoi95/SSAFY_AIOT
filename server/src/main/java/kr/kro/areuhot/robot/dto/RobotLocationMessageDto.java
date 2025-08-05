package kr.kro.areuhot.robot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RobotLocationMessageDto {
    
    @JsonProperty("robot_id")
    private Integer robotId;
    
    private Double x;
    
    private Double y;
    
    private Float direction;
    
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
} 