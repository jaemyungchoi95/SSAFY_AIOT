package kr.kro.areuhot.map.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class MapResponseDto {
    private int id;
    private int warehouseId;
    private String filePath;
}