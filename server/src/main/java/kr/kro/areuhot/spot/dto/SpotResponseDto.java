package kr.kro.areuhot.spot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class SpotResponseDto {
    private int spotId;
    private double x, y;
    private float direction;
}
