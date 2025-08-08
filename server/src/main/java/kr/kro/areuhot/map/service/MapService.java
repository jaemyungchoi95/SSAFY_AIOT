package kr.kro.areuhot.map.service;

import kr.kro.areuhot.common.util.S3Util;
import kr.kro.areuhot.map.dto.MapResponseDto;
import kr.kro.areuhot.map.mapper.MapMapper;
import kr.kro.areuhot.map.model.WarehouseMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import static kr.kro.areuhot.map.util.MapVersionGenerator.generate;

@Service
@RequiredArgsConstructor
public class MapService {
    private final MapMapper mapMapper;
    private final S3Util s3Util;

    public WarehouseMap saveMap(Integer warehouseId, String url, LocalDateTime createdAt) {
        mapMapper.deactivateByWarehouseId(warehouseId);

        WarehouseMap map = new WarehouseMap();
        map.setWarehouseId(warehouseId);
        map.setFilePath(s3Util.extractKeyFromUrl(url));
        map.setVersion(generate(warehouseId, createdAt));
        map.setActive(true);
        map.setType("raw");
        map.setCreatedAt(createdAt);

        mapMapper.insertMap(map);

        return map;
    }

    public MapResponseDto getActiveMapByWarehouseId(Integer warehouseId) {
        MapResponseDto dto = mapMapper.findActiveMapByWarehouseId(warehouseId);

        if(dto != null && dto.getFilePath() != null) {
            String presignedUrl = s3Util.generatePresignedUrl(dto.getFilePath());
            dto.setFilePath(presignedUrl);
        }

        return dto;
    }
}
