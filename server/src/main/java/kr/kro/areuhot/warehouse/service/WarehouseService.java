package kr.kro.areuhot.warehouse.service;

import kr.kro.areuhot.warehouse.dto.WarehouseResponseDto;
import kr.kro.areuhot.warehouse.mapper.WarehouseMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WarehouseService {
    private final WarehouseMapper warehouseMapper;

    public List<WarehouseResponseDto> findAllWarehouse() {
        return warehouseMapper.findAllWarehouse();
    }
}
