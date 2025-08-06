package kr.kro.areuhot.robot.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class RackUploadDto {
    private Double x1, y1, x2, y2, x3, y3, x4, y4;
    private Double centerX, centerY;
    private List<SpotUploadDto> spotList;
}