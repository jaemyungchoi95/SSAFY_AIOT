package kr.kro.areuhot.alert.service;

import kr.kro.areuhot.alert.dto.AlertPageResponseDto;
import kr.kro.areuhot.alert.dto.AlertResponseDto;
import kr.kro.areuhot.alert.dto.AlertSearchCondition;
import kr.kro.areuhot.alert.mapper.AlertMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertService {
    private final AlertMapper alertMapper;

    public AlertResponseDto getAlertsById(int warehouseId, int alertId) {
        return alertMapper.getAlertByAlertId(warehouseId, alertId);
    }

    public AlertPageResponseDto getPagedAlerts(AlertSearchCondition condition, int limit, int offset) {
        long totalElements = countAlerts(condition);
        int totalPages = (int) Math.ceil((double) totalElements / limit);
        int sqlOffset = offset * limit;
        boolean last = offset + limit >= totalElements;

        List<AlertResponseDto> content = alertMapper.selectPagedAlerts(condition, sqlOffset, limit);

        return AlertPageResponseDto.builder()
                .content(content)
                .offset(offset)
                .limit(limit)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .last(last)
                .build();
    }

    public long countAlerts(AlertSearchCondition condition) {
        return alertMapper.countAlerts(condition);
    }

}
