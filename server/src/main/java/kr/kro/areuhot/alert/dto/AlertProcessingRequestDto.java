package kr.kro.areuhot.alert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertProcessingRequestDto {
    private Integer userId;
    private String handlerName;
    private String itemType;
    private String comment;
    private LocalDateTime updatedAt;
}
