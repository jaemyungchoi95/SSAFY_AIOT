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
    private int offset;
    private int limit;
    private long totalElements;
    private int totalPages;
    private boolean last;
}
