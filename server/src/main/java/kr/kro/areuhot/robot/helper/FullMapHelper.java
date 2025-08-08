package kr.kro.areuhot.robot.helper;

import kr.kro.areuhot.common.util.UuidUtil;
import kr.kro.areuhot.map.model.WarehouseMap;
import kr.kro.areuhot.rack.model.Rack;
import kr.kro.areuhot.robot.dto.FullMapUploadRequestDto;
import kr.kro.areuhot.robot.dto.RackUploadDto;
import kr.kro.areuhot.robot.dto.SpotUploadDto;
import kr.kro.areuhot.spot.model.Spot;
import lombok.experimental.UtilityClass;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static kr.kro.areuhot.map.util.MapVersionGenerator.generate;

@UtilityClass
public class FullMapHelper {
    public WarehouseMap toMap(Integer warehouseId, FullMapUploadRequestDto dto) {
        WarehouseMap map = new WarehouseMap();
        map.setWarehouseId(warehouseId);
        map.setFilePath(dto.getUrl());
        map.setVersion(generate(warehouseId, dto.getCreatedAt()));
        map.setActive(true);
        map.setType("raw");
        map.setCreatedAt(dto.getCreatedAt());
        return map;
    }

    public List<Rack> toRackList(List<RackUploadDto> rackDtos, Integer warehouseId, int mapId) {
        List<Rack> result = new ArrayList<>();
        for(RackUploadDto dto: rackDtos) {
            Rack rack = new Rack();
            rack.setWarehouseId(warehouseId);
            rack.setMapId(mapId);
            rack.setX1(dto.getX1());
            rack.setY1(dto.getY1());
            rack.setX2(dto.getX2());
            rack.setY2(dto.getY2());
            rack.setX3(dto.getX3());
            rack.setY3(dto.getY3());
            rack.setX4(dto.getX4());
            rack.setY4(dto.getY4());
            rack.setCenterX(dto.getCenterX());
            rack.setCenterY(dto.getCenterY());
            result.add(rack);
        }
        return result;
    }

    public List<Spot> toSpotList(List<RackUploadDto> rackDtos, List<Integer> rackIds) {
        List<Spot> result = new ArrayList<>();
        for(int i = 0; i < rackDtos.size(); i++) {
            RackUploadDto rackDto = rackDtos.get(i);
            int rackId = rackIds.get(i);
            for(SpotUploadDto spotDto: rackDto.getSpotList()) {
                Spot spot = new Spot();
                spot.setRackId(rackId);
                spot.setX(spotDto.getX());
                spot.setY(spotDto.getY());
                spot.setDirection(spotDto.getDirection());
                UUID uuid = spotDto.getUuid();
                if(uuid != null) {
                    spot.setUuid(UuidUtil.toBytes(uuid));
                } else {
                    throw new IllegalArgumentException("Spot UUID가 존재하지 않습니다.");
                }

                result.add(spot);
            }
        }
        return result;
    }
}
