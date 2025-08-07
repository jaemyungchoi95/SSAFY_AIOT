package kr.kro.areuhot.alert.controller;

import kr.kro.areuhot.alert.dto.AlertDetailResponseDto;
import kr.kro.areuhot.alert.dto.AlertPageResponseDto;
import kr.kro.areuhot.alert.dto.AlertProcessingRequestDto;
import kr.kro.areuhot.alert.dto.AlertResponseDto;
import kr.kro.areuhot.alert.dto.AlertSearchCondition;
import kr.kro.areuhot.alert.service.AlertService;
import kr.kro.areuhot.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class AlertController {
    private final AlertService alertService;

    @GetMapping("/warehouses/{warehouseId}/alerts/{alertId}")
    public ResponseEntity<ApiResponse<AlertResponseDto>> getAlert(
            @PathVariable Integer alertId,
            @PathVariable Integer warehouseId
    ) {
        AlertResponseDto dto = alertService.getAlertsById(warehouseId, alertId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @GetMapping("/warehouses/{warehouseId}/alerts")
    public ResponseEntity<ApiResponse<AlertPageResponseDto>> getPagedAlertsByWarehouseId(
            @PathVariable Integer warehouseId,
            @RequestParam(required = false, defaultValue = "0") Integer offset,
            @RequestParam(required = false, defaultValue = "30") Integer limit,
            @ModelAttribute AlertSearchCondition condition
    ) {
        condition.setWarehouseId(warehouseId);
        AlertPageResponseDto result = alertService.getPagedAlerts(condition, limit, offset);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<AlertPageResponseDto>> getPagedAllAlerts(
            @RequestParam(required = false, defaultValue = "0") Integer offset,
            @RequestParam(required = false, defaultValue = "30") Integer limit,
            @ModelAttribute AlertSearchCondition condition
    ) {
        AlertPageResponseDto result = alertService.getPagedAlerts(condition, limit, offset);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/alerts/{alertId}")
    public ResponseEntity<ApiResponse<AlertDetailResponseDto>> getAlertDetail(
            @PathVariable Integer alertId
    ) {
        AlertDetailResponseDto dto = alertService.getAlertDetail(alertId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping("/alerts/{alertId}/processing")
    public ResponseEntity<ApiResponse<Void>> processAlert(
            @PathVariable Integer alertId,
            @RequestBody AlertProcessingRequestDto requestDto
    ) {
        alertService.processAlert(alertId, requestDto);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PutMapping("/alerts/{alertId}/processing")
    public ResponseEntity<ApiResponse<Void>> updateAlertProcessing(
            @PathVariable Integer alertId,
            @RequestBody AlertProcessingRequestDto requestDto
    ) {
        alertService.updateAlertProcessing(alertId, requestDto);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
