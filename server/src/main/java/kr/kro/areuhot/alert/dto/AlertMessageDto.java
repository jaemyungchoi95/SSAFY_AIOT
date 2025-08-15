package kr.kro.areuhot.alert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class AlertMessageDto {
    private Integer alertId;
    private Integer spotId;
    private Integer rackId;
    private Double temperature;
    private Boolean danger;
    private LocalDateTime createdAt;
}
