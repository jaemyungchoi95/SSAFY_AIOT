package kr.kro.areuhot.rack.dto;

import kr.kro.areuhot.spot.dto.SpotResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RackResponseDto {
    private Integer rackId;
    private Integer warehouseId;
    private Integer mapId;
    private Double x1, y1, x2, y2, x3, y3, x4, y4;
    private Double centerX, centerY;
    private List<SpotResponseDto> spotList;
}
