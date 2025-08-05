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
    private int id;
    private int robotId;
    private int rackId;
    private int warehouseId;
    private int spotId;
    private double temperature;
    private String imageThermalUrl;
    private String imageNormalUrl;
    private AlertStatus status; // UNCHECKED, DONE
    private boolean danger;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}