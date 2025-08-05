package kr.kro.areuhot.alert.dto;

import kr.kro.areuhot.alert.model.AlertStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

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
    private String imageThermalUrl;
    private String imageNormalUrl;
    private AlertStatus status;
    private boolean danger;
    private Date createdAt;
    private Date updatedAt;
    private int processingId;
    private String handlerName;
    private String comment;
    private String userName;
    private String warehouseName;
    private String itemType;
    private Date handledAt;
}