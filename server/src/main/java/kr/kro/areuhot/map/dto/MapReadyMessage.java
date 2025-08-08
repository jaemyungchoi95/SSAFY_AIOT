package kr.kro.areuhot.map.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class MapReadyMessage {
    private Integer warehouseId;
    private LocalDateTime createdAt;
}
