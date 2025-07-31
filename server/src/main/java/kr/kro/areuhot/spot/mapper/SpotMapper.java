package kr.kro.areuhot.spot.mapper;

import kr.kro.areuhot.spot.model.Spot;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SpotMapper {
    void insertSpot(Spot spot);
}
