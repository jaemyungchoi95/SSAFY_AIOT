package kr.kro.areuhot.warehouse.mapper;

import kr.kro.areuhot.warehouse.dto.WarehouseResponseDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface WarehouseMapper {
    List<WarehouseResponseDto> findAllWarehouse();
}
