package kr.kro.areuhot.robot.controller;

import kr.kro.areuhot.common.dto.ApiResponse;
import kr.kro.areuhot.robot.dto.FullMapUploadRequestDto;
import kr.kro.areuhot.robot.service.FullMapService;
import kr.kro.areuhot.robot.service.RobotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/robots")
public class FullMapController {
    private final FullMapService fullMapService;
    private final RobotService robotService;

    @PostMapping("/{robotId}/full-map")
    public ResponseEntity<ApiResponse<Void>> uploadFullMap(
            @PathVariable("robotId") Integer robotId,
            @RequestBody FullMapUploadRequestDto dto
            ) {
        int warehouseId = robotService.findWarehouseIdByRobotId(robotId);
        fullMapService.saveFullMap(warehouseId, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "FullMap 저장 성공", null));
    }
}
