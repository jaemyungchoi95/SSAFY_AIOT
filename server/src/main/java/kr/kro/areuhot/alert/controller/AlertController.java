package kr.kro.areuhot.alert.controller;

import kr.kro.areuhot.alert.dto.AlertPageResponseDto;
import kr.kro.areuhot.alert.dto.AlertResponseDto;
import kr.kro.areuhot.alert.dto.AlertSearchCondition;
import kr.kro.areuhot.alert.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AlertController {
    private final AlertService alertService;

    @GetMapping("/warehouses/{warehouseId}/alerts/{alertId}")
    public AlertResponseDto getAlert(
            @PathVariable int alertId,
            @PathVariable int warehouseId
    ) {
        return alertService.getAlertsById(warehouseId, alertId);
    }

    @GetMapping("/warehouses/{warehouseId}/alerts")
    public AlertPageResponseDto getPagedAlertsByWarehouseId(
            @PathVariable int warehouseId,
            @RequestParam(required = false, defaultValue = "0") int offset,
            @RequestParam(required = false, defaultValue = "30") int limit,
            @ModelAttribute AlertSearchCondition condition
    ) {
        condition.setWarehouseId(warehouseId);
        return alertService.getPagedAlerts(condition, limit, offset);
    }

    @GetMapping("/alerts")
    public AlertPageResponseDto getPagedAllAlerts(
            @RequestParam(required = false, defaultValue = "0") int offset,
            @RequestParam(required = false, defaultValue = "30") int limit,
            @ModelAttribute AlertSearchCondition condition
    ) {
        return alertService.getPagedAlerts(condition, limit, offset);
    }
}
