package kr.kro.areuhot.robot.service;

import kr.kro.areuhot.common.exception.CustomException;
import kr.kro.areuhot.common.exception.ErrorCode;
import kr.kro.areuhot.common.util.UuidUtil;
import kr.kro.areuhot.robot.dto.MoveToSpotCommandRequestDto;
import kr.kro.areuhot.robot.mapper.RobotCommandMapper;
import kr.kro.areuhot.robot.model.RobotCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RobotCommandService {
    private static final int DEFAULT_TIMEOUT_SEC = 900;

    private final RobotCommandMapper robotCommandMapper;

    public void moveToSpot(Integer warehouseId, Integer robotId, MoveToSpotCommandRequestDto dto) {
        byte[] commandId = UuidUtil.toBytes(UUID.fromString(dto.getCommandId()));

        RobotCommand command = RobotCommand.builder()
                .commandId(commandId)
                .spotId(dto.getSpotId())
                .robotId(robotId)
                .warehouseId(warehouseId)
                .timeoutSec(DEFAULT_TIMEOUT_SEC)
                .build();

        try {
            robotCommandMapper.insertRobotCommand(command);
        } catch (DuplicateKeyException e) {
            throw new CustomException(ErrorCode.DUPLICATE_COMMAND);
        }

        // robot에 mqtt 메시지 발행 로직 추가 (함수)


    }

}
