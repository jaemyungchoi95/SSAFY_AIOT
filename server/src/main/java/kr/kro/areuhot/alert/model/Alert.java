package kr.kro.areuhot.alert.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private AlertStatus status; // UNCHECKED, DONE
    private Boolean danger;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}