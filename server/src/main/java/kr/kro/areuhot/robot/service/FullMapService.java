package kr.kro.areuhot.robot.service;

import kr.kro.areuhot.map.model.WarehouseMap;
import kr.kro.areuhot.map.service.MapService;
import kr.kro.areuhot.rack.model.Rack;
import kr.kro.areuhot.rack.service.RackService;
import kr.kro.areuhot.robot.dto.FullMapUploadRequestDto;
import kr.kro.areuhot.robot.helper.FullMapHelper;
import kr.kro.areuhot.spot.model.Spot;
import kr.kro.areuhot.spot.service.SpotService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FullMapService {
    private final MapService mapService;
    private final RackService rackService;
    private final SpotService spotService;

    public void saveFullMap(Integer warehouseId, FullMapUploadRequestDto dto) {
        WarehouseMap savedMap = mapService.saveMap(warehouseId, dto.getUrl(), dto.getCreatedAt());

        List<Rack> racks = FullMapHelper.toRackList(dto.getRackList(), warehouseId, savedMap.getId());
        List<Integer> rackIds = rackService.saveRacks(racks);

        List<Spot> spots = FullMapHelper.toSpotList(dto.getRackList(), rackIds);
        spotService.saveSpots(spots);
    }
}
