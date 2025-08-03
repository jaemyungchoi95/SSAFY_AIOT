package kr.kro.areuhot.rackspot.dto;

import kr.kro.areuhot.spot.dto.SpotResponseDto;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class RackWithSpotsResponseDto {
    private int rackId;
    private int warehouseId;
    private int mapId;
    private double x1, y1, x2, y2, x3, y3, x4, y4;
    private double centerX, centerY;
    private List<SpotResponseDto> spotList;
}
