package kr.kro.areuhot.rackspot.service;

import kr.kro.areuhot.map.mapper.MapMapper;
import kr.kro.areuhot.rack.dto.RackResponseDto;
import kr.kro.areuhot.rack.mapper.RackMapper;
import kr.kro.areuhot.rackspot.dto.RackWithSpotsResponseDto;
import kr.kro.areuhot.spot.mapper.SpotMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RackSpotQueryService {
    private final RackMapper rackMapper;
    private final SpotMapper spotMapper;
    private final MapMapper mapMapper;

    public List<RackWithSpotsResponseDto> findRacksWithSpotsByWarehouseId(Integer warehouseId) {
        int mapId = mapMapper.findActiveMapIdByWarehouseId(warehouseId);
        List<RackResponseDto> racks = rackMapper.findByMapId(mapId);

        return racks.stream()
                .map(rack -> RackWithSpotsResponseDto.builder()
                        .rackId(rack.getRackId())
                        .warehouseId(rack.getWarehouseId())
                        .mapId(rack.getMapId())
                        .x1(rack.getX1())
                        .y1(rack.getY1())
                        .x2(rack.getX2())
                        .y2(rack.getY2())
                        .x3(rack.getX3())
                        .y3(rack.getY3())
                        .x4(rack.getX4())
                        .y4(rack.getY4())
                        .centerX(rack.getCenterX())
                        .centerY(rack.getCenterY())
                        .spotList(spotMapper.findByRackId(rack.getRackId()))
                        .build())
                .collect(Collectors.toList());
    }
}
