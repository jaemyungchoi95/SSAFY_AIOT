package kr.kro.areuhot.map.service;

import kr.kro.areuhot.map.mapper.MapMapper;
import kr.kro.areuhot.map.model.WarehouseMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;

import static kr.kro.areuhot.map.util.MapVersionGenerator.generate;

@Service
@RequiredArgsConstructor
public class MapService {
    private final MapMapper mapMapper;

    public WarehouseMap saveMap(int warehouseId, String url, Date createdAt) {
        mapMapper.deactiveByWarehouseId(warehouseId);

        WarehouseMap map = new WarehouseMap();
        map.setWarehouseId(warehouseId);
        map.setFilePath(url);
        map.setVersion(generate(warehouseId, createdAt));
        map.setActive(true);
        map.setType("raw");
        map.setCreatedAt(createdAt);

        mapMapper.insertMap(map);
        return map;
    }
}
