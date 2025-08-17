package kr.kro.areuhot.robot.service;

import kr.kro.areuhot.common.websocket.WebSocketPublisher;
import kr.kro.areuhot.common.websocket.WebSocketTopic;
import kr.kro.areuhot.event.CreatedMapEvent;
import kr.kro.areuhot.map.dto.MapReadyMessage;
import kr.kro.areuhot.map.model.WarehouseMap;
import kr.kro.areuhot.map.service.MapService;
import kr.kro.areuhot.rack.model.Rack;
import kr.kro.areuhot.rack.service.RackService;
import kr.kro.areuhot.robot.dto.FullMapUploadRequestDto;
import kr.kro.areuhot.robot.helper.FullMapHelper;
import kr.kro.areuhot.spot.model.Spot;
import kr.kro.areuhot.spot.service.SpotService;
import lombok.RequiredArgsConstructor;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FullMapService {
    private final MapService mapService;
    private final RackService rackService;
    private final SpotService spotService;
    private final WebSocketPublisher publisher;

    // firebase
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void saveFullMap(Integer warehouseId, FullMapUploadRequestDto dto) {
        WarehouseMap savedMap = mapService.saveMap(warehouseId, dto.getUrl(), dto.getCreatedAt());

        List<Rack> racks = FullMapHelper.toRackList(dto.getRackList(), warehouseId, savedMap.getId());
        List<Integer> rackIds = rackService.saveRacks(racks);

        List<Spot> spots = FullMapHelper.toSpotList(dto.getRackList(), rackIds);
        spotService.saveSpots(spots);

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                publishMapReady(warehouseId, dto.getCreatedAt());
            }
        });
    }

    private void publishMapReady(Integer warehouseId, LocalDateTime createdAt) {
        MapReadyMessage message = MapReadyMessage.builder()
                .warehouseId(warehouseId)
                .createdAt(createdAt)
                .build();

        publisher.send(WebSocketTopic.MAP_READY, message);

        // firebase
        eventPublisher.publishEvent(CreatedMapEvent.builder().createdAt(createdAt).warehouseId(warehouseId).build());
    }
}