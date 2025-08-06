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
    private Integer alertId;
    private Integer warehouseId;
    private Integer rackId;
    private Integer spotId;
    private Double temperature;
    private String imageThermalUrl;
    private String imageNormalUrl;
    private AlertStatus status;
    private Boolean danger;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer processingId;
    private String handlerName;
    private String comment;
    private String userName;
    private String warehouseName;
    private String itemType;
    private LocalDateTime handledAt;
}
