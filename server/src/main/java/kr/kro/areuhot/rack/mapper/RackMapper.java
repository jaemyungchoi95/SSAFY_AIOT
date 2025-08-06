package kr.kro.areuhot.rack.mapper;

import kr.kro.areuhot.rack.dto.RackResponseDto;
import kr.kro.areuhot.rack.model.Rack;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RackMapper {
    void insertRack(Rack rack);
    List<RackResponseDto> findByMapId(Integer mapId);
}