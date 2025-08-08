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
    private Integer alertId;
    private Integer warehouseId;
    private Integer rackId;
    private Integer spotId;
    private Double temperature;
    private AlertStatus status;
    private Boolean danger;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer processingId;
    private String comment;
    private String userName;
    private String warehouseName;
}