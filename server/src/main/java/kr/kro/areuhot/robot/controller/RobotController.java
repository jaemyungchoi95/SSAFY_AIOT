package kr.kro.areuhot.robot.controller;

import kr.kro.areuhot.common.dto.ApiResponse;
import kr.kro.areuhot.robot.dto.RobotResponseDto;
import kr.kro.areuhot.robot.service.RobotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RobotController {
    private final RobotService robotService;

    @GetMapping("/warehouses/{warehouseId}/robots")
    public ResponseEntity<ApiResponse<List<RobotResponseDto>>> getRobots(
            @PathVariable("warehouseId") Integer warehouseId
    ) {
        List<RobotResponseDto> robots = robotService.findRobotListByWarehouseId(warehouseId);
        return ResponseEntity.ok(ApiResponse.success(robots));
    }
}
