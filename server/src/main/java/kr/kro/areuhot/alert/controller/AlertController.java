package kr.kro.areuhot.alert.controller;

import kr.kro.areuhot.alert.dto.AlertDetailResponseDto;
import kr.kro.areuhot.alert.dto.AlertPageResponseDto;
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
            @PathVariable int alertId,
            @PathVariable int warehouseId
    ) {
        AlertResponseDto dto = alertService.getAlertsById(warehouseId, alertId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @GetMapping("/warehouses/{warehouseId}/alerts")
    public ResponseEntity<ApiResponse<AlertPageResponseDto>> getPagedAlertsByWarehouseId(
            @PathVariable int warehouseId,
            @RequestParam(required = false, defaultValue = "0") int offset,
            @RequestParam(required = false, defaultValue = "30") int limit,
            @ModelAttribute AlertSearchCondition condition
    ) {
        condition.setWarehouseId(warehouseId);
        AlertPageResponseDto result = alertService.getPagedAlerts(condition, limit, offset);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<AlertPageResponseDto>> getPagedAllAlerts(
            @RequestParam(required = false, defaultValue = "0") int offset,
            @RequestParam(required = false, defaultValue = "30") int limit,
            @ModelAttribute AlertSearchCondition condition
    ) {
        AlertPageResponseDto result = alertService.getPagedAlerts(condition, limit, offset);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/alerts/{alertId}")
    public ResponseEntity<ApiResponse<AlertDetailResponseDto>> getAlertDetail(
            @PathVariable int alertId
    ) {
        AlertDetailResponseDto dto = alertService.getAlertDetail(alertId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }
}
