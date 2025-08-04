package kr.kro.areuhot.alert.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alert {
    
    private Integer id;
    private Integer robotId;
    private Integer rackId;
    private Integer warehouseId;
    private Integer spotId;
    private Double temperature;
    private String imageThermalUrl;
    private String imageNormalUrl;
    private String status; // UNCHECKED, DONE
    private Boolean isDanger;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 