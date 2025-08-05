package kr.kro.areuhot.alert.mapper;

import kr.kro.areuhot.alert.dto.AlertResponseDto;
import kr.kro.areuhot.alert.dto.AlertSearchCondition;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AlertMapper {
    /* 단건 조회 */
    AlertResponseDto getAlertByAlertId(
            @Param("warehouseId") int warehouseId,
            @Param("alertId") int alertId
    );
    /* 조건 페이징 조회 */
    List<AlertResponseDto> selectPagedAlerts(
            @Param("condition") AlertSearchCondition condition,
            @Param("offset") int offset,
            @Param("limit") int limit
    );
    /* 총 개수 조회 */
    long countAlerts(@Param("condition") AlertSearchCondition condition);
}
