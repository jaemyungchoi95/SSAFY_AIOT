package kr.kro.areuhot.rack.service;

import kr.kro.areuhot.rack.mapper.RackMapper;
import kr.kro.areuhot.rack.model.Rack;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RackService {
    private final RackMapper rackMapper;

    public void saveRack(Rack rack) {
        rackMapper.insertRack(rack);
    }

    public List<Integer> saveRacks(List<Rack> racks) {
        List<Integer> ids = new ArrayList<>();
        for(Rack rack: racks) {
            rackMapper.insertRack(rack);
            ids.add(rack.getId());
        }
        return ids;
    }
}
