package kr.kro.areuhot.alert.dto;

import kr.kro.areuhot.alert.model.AlertStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AlertResponseDto {
    private int alertId;
    private int warehouseId;
    private int rackId;
    private int spotId;
    private double temperature;
//    private String imageThermalUrl;
//    private String imageNormalUrl;
    private AlertStatus status;
    private boolean danger;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int processingId;
//    private String handlerName;
    private String comment;
    private String userName;
    private String warehouseName;
//    private String itemType;
//    private Date handledAt;
}