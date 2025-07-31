package kr.kro.areuhot.map.mapper;

import kr.kro.areuhot.map.model.WarehouseMap;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MapMapper {
    void insertMap(WarehouseMap map);
    void deactiveByWarehouseId(int warehouseId);
}