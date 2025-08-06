package kr.kro.areuhot.robot.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class SpotUploadDto {
    private Double x, y;
    private Float direction;
    private UUID uuid;
}