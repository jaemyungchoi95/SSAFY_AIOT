package kr.kro.areuhot.robot.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SpotUploadDto {
    private double x, y;
    private float direction;
}