package kr.kro.areuhot.robot.model;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RobotCommand {
    private Integer id;
    private Integer spotId;
    private byte[] commandId;
    private Integer robotId;
    private Integer warehouseId;
    private Integer timeoutSec;
    private LocalDateTime createdAt;
}
