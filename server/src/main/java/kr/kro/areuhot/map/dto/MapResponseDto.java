package kr.kro.areuhot.map.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class MapResponseDto {
    private Integer mapId;
    private Integer warehouseId;
    private String filePath;
}