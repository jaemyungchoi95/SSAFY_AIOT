package kr.kro.areuhot.map.controller;

import kr.kro.areuhot.common.dto.ApiResponse;
import kr.kro.areuhot.map.dto.MapResponseDto;
import kr.kro.areuhot.map.service.MapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/warehouses")
public class MapController {
    private final MapService mapService;

    @GetMapping("/{warehouseId}/map")
    public ResponseEntity<ApiResponse<MapResponseDto>> getActiveMap(@PathVariable Integer warehouseId) {
        MapResponseDto map = mapService.getActiveMapByWarehouseId(warehouseId);
        return ResponseEntity.ok(ApiResponse.success(map));
    }
}
