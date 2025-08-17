package kr.kro.areuhot.event;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreatedMapEvent {
    private Integer warehouseId;
    private LocalDateTime createdAt;
}
