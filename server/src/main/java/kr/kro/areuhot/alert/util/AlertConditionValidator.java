package kr.kro.areuhot.alert.util;

import kr.kro.areuhot.alert.dto.AlertSearchCondition;
import kr.kro.areuhot.common.exception.CustomException;
import kr.kro.areuhot.common.exception.ErrorCode;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class AlertConditionValidator {
    private static final Set<String> ALLOWED_SORTS = Set.of("latest", "oldest");
    private static final Set<String> ALLOWED_RANGES = Set.of("1d", "7d", "30d");
    private static final Set<String> ALLOWED_STATUSES = Set.of("UNCHECKED", "DONE");

    public void validate(AlertSearchCondition condition) {
        String sort = condition.getSort();
        String range = condition.getRange();
        String status = condition.getStatus();

        if (sort != null && !ALLOWED_SORTS.contains(sort)) {
            throw new CustomException(ErrorCode.INVALID_INPUT, "정렬 조건이 잘못되었습니다.");
        }

        if (range != null && !ALLOWED_RANGES.contains(range)) {
            throw new CustomException(ErrorCode.INVALID_INPUT, "기간 조건이 잘못되었습니다.");
        }

        if (status != null && !ALLOWED_STATUSES.contains(status)) {
            throw new CustomException(ErrorCode.INVALID_INPUT, "상태 조건이 잘못되었습니다.");
        }
    }

}
