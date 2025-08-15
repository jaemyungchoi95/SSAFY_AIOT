package kr.kro.areuhot.robot.controller;

import kr.kro.areuhot.common.dto.ApiResponse;
import kr.kro.areuhot.robot.dto.MoveToSpotCommandRequestDto;
import kr.kro.areuhot.robot.dto.RobotResponseDto;
import kr.kro.areuhot.robot.service.RobotCommandService;
import kr.kro.areuhot.robot.service.RobotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RobotController {
    private final RobotService robotService;
    private final RobotCommandService robotCommandService;

    @GetMapping("/warehouses/{warehouseId}/robots")
    public ResponseEntity<ApiResponse<List<RobotResponseDto>>> getRobots(
            @PathVariable("warehouseId") Integer warehouseId
    ) {
        List<RobotResponseDto> robots = robotService.findRobotListByWarehouseId(warehouseId);
        return ResponseEntity.ok(ApiResponse.success(robots));
    }

    @PostMapping("/warehouses/{warehouseId}/robots/{robotId}")
    public ResponseEntity<ApiResponse<Void>> postCommand(
            @PathVariable("warehouseId") Integer warehouseId,
            @PathVariable("robotId") Integer robotId,
            @RequestBody MoveToSpotCommandRequestDto dto

    ) {
        robotCommandService.moveToSpot(warehouseId, robotId, dto);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
