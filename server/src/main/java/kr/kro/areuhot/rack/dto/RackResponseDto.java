package kr.kro.areuhot.rack.dto;

import kr.kro.areuhot.spot.dto.SpotResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class RackResponseDto {
    private int rackId;
    private int warehouseId;
    private int mapId;
    private int x1, y1, x2, y2, x3, y3, x4, y4;
    private double centerX, centerY;
    private List<SpotResponseDto> spotList;
}
