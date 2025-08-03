package kr.kro.areuhot.map.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class MapResponseDto {
    private int mapId;
    private int warehouseId;
    private String filePath;
}