package kr.kro.areuhot.spot.mapper;

import kr.kro.areuhot.spot.dto.SpotResponseDto;
import kr.kro.areuhot.spot.model.Spot;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SpotMapper {
    void insertSpot(Spot spot);
    List<SpotResponseDto> findByRackId(Integer rackId);
}
