package kr.kro.areuhot.map.mapper;

import kr.kro.areuhot.map.dto.MapResponseDto;
import kr.kro.areuhot.map.model.WarehouseMap;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MapMapper {
    void insertMap(WarehouseMap map);
    void deactivateByWarehouseId(@Param("warehouseId") Integer warehouseId);
    int findActiveMapIdByWarehouseId(@Param("warehouseId") Integer warehouseId);
    MapResponseDto findActiveMapByWarehouseId(@Param("warehouseId") Integer warehouseId);
}