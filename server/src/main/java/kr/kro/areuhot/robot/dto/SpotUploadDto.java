package kr.kro.areuhot.robot.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class SpotUploadDto {
    private double x, y;
    private float direction;
    private UUID uuid;
}