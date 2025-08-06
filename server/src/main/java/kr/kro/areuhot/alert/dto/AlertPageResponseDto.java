package kr.kro.areuhot.alert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class AlertPageResponseDto {
    private List<AlertResponseDto> content;
    private Integer offset;
    private Integer limit;
    private Long totalElements;
    private Integer totalPages;
    private Boolean last;
}
