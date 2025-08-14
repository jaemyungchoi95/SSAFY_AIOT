package kr.kro.areuhot.robot.dto;

import lombok.Data;

@Data
public class MoveToSpotCommandRequestDto {
    private Integer spotId;
    private String commandId;
}
