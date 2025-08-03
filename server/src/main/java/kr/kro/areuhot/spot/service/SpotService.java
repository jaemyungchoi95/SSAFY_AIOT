package kr.kro.areuhot.spot.service;

import kr.kro.areuhot.spot.mapper.SpotMapper;
import kr.kro.areuhot.spot.model.Spot;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class SpotService {
    private final SpotMapper spotMapper;

    public void saveSpot(Spot spot) {
        spotMapper.insertSpot(spot);
    }

    public void saveSpots(List<Spot> spots) {
        for(Spot spot: spots) {
            spotMapper.insertSpot(spot);
        }
    }
}
