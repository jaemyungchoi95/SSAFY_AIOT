package kr.kro.areuhot.spot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class SpotResponseDto {
    private Integer spotId;
    private Double x, y;
    private Float direction;
}
