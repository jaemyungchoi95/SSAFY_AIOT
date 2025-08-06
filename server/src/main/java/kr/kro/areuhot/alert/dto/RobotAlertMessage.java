package kr.kro.areuhot.alert.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RobotAlertMessage {
    
    @JsonProperty("spot_uuid")
    private String spotUuid;
    
    @JsonProperty("robot_id")
    private Integer robotId;
    
    private Double temperature;
    
    @JsonProperty("image_thermal_url")
    private String imageThermalUrl;
    
    @JsonProperty("image_normal_url")
    private String imageNormalUrl;
    
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
} 