package kr.kro.areuhot.alert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AlertMessageDto {
    private Integer alertID;
    private Integer spotId;
    private Integer rackId;
    private Double temperature;
    private Boolean danger;
}
