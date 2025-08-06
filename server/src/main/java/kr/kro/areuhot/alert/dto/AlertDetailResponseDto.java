package kr.kro.areuhot.alert.dto;

import kr.kro.areuhot.alert.model.AlertStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AlertDetailResponseDto {
    private int alertId;
    private int warehouseId;
    private int rackId;
    private int spotId;
    private double temperature;
    private String imageThermalUrl;
    private String imageNormalUrl;
    private AlertStatus status;
    private boolean danger;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int processingId;
    private String handlerName;
    private String comment;
    private String userName;
    private String warehouseName;
    private String itemType;
    private LocalDateTime handledAt;
}
