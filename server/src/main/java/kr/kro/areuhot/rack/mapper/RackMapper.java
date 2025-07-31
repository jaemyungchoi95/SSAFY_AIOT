package kr.kro.areuhot.rack.mapper;

import kr.kro.areuhot.rack.model.Rack;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RackMapper {
    void insertRack(Rack rack);
}