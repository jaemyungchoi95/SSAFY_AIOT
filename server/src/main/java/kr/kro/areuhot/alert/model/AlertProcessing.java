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
public class AlertProcessing {
    private Integer id;
    private Integer alertId;
    private Integer userId;
    private LocalDateTime handledAt;
    private String handlerName;
    private String itemType;
    private Integer rackId;
    private String comment;
}
