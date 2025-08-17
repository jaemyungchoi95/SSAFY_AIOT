package kr.kro.areuhot.event;

import java.time.LocalDateTime;

import kr.kro.areuhot.alert.model.Alert;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreatedAlertEvent {
    private Integer alertId;
    private Integer spotId;
    private Integer rackId;
    private Double temperature;
    private Boolean danger;
    private LocalDateTime createdAt;

    public static CreatedAlertEvent of(Alert dto) {
        return CreatedAlertEvent.builder()
                .alertId(dto.getId())
                .spotId(dto.getSpotId())
                .rackId(dto.getRackId())
                .temperature(dto.getTemperature())
                .danger(dto.getDanger())
                .createdAt(dto.getCreatedAt())
                .build();
    }
}
