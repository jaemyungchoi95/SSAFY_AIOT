package kr.kro.areuhot.warehouse.controller;

import kr.kro.areuhot.common.dto.ApiResponse;
import kr.kro.areuhot.rackspot.dto.RackWithSpotsResponseDto;
import kr.kro.areuhot.rackspot.service.RackSpotQueryService;
import kr.kro.areuhot.warehouse.dto.WarehouseResponseDto;
import kr.kro.areuhot.warehouse.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/warehouses")
public class WarehouseController {
    private final WarehouseService warehouseService;
    private final RackSpotQueryService rackSpotQueryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WarehouseResponseDto>>> getAllWarehouses() {
        List<WarehouseResponseDto> result = warehouseService.findAllWarehouse();
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{warehouseId}/racks")
    public ResponseEntity<ApiResponse<List<RackWithSpotsResponseDto>>> getRackWithSpots(
            @PathVariable Integer warehouseId
    ) {
        List<RackWithSpotsResponseDto> response = rackSpotQueryService.findRacksWithSpotsByWarehouseId(warehouseId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}