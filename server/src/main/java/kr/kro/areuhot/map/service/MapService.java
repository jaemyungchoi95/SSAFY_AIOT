package kr.kro.areuhot.map.service;

import kr.kro.areuhot.common.exception.CustomException;
import kr.kro.areuhot.common.exception.ErrorCode;
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

        if(dto == null) throw new CustomException(ErrorCode.MAP_NOT_READY);

        String key = dto.getFilePath();
        if(key == null || key.isBlank()) throw new CustomException(ErrorCode.PATH_MISSING);

        String presignedUrl = s3Util.generatePresignedUrl(key);
        dto.setFilePath(presignedUrl);

        return dto;
    }
}
