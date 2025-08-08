package kr.kro.areuhot.alert.mapper;

import kr.kro.areuhot.alert.dto.AlertDetailResponseDto;
import kr.kro.areuhot.alert.dto.AlertResponseDto;
import kr.kro.areuhot.alert.dto.AlertSearchCondition;
import kr.kro.areuhot.alert.model.Alert;
import kr.kro.areuhot.alert.model.AlertStatus;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface AlertMapper {
    /* 단건 조회 */
    AlertResponseDto getAlertByAlertId(
            @Param("warehouseId") Integer warehouseId,
            @Param("alertId") Integer alertId
    );

    /* 조건 페이징 조회 */
    List<AlertResponseDto> selectPagedAlerts(
            @Param("condition") AlertSearchCondition condition,
            @Param("offset") Integer offset,
            @Param("limit") Integer limit
    );

    /* alert detail 조회 */
    AlertDetailResponseDto getAlertDetailByAlertId(
           @Param("alertId") Integer alertId
    );

    /* Alert 단건 조회 (내부 로직용) */
    Alert findAlertById(@Param("alertId") Integer alertId);

    /* 총 개수 조회 */
    long countAlerts(@Param("condition") AlertSearchCondition condition);

    // Alert 저장
    int insertAlert(Alert alert);
    
    // spot_uuid로 spot_id 조회
    Integer findSpotIdByUuid(@Param("spotUuid") String spotUuid);
    
    // robot_id로 warehouse_id 조회
    Integer findWarehouseIdByRobotId(@Param("robotId") Integer robotId);
    
    // spot_id로 rack_id 조회
    Integer findRackIdBySpotId(@Param("spotId") Integer spotId);
    
    // 특정 spot에서 12시간 이내 알림 개수 조회 (위험도 판단용)
    int countRecentAlertsBySpotId(@Param("spotId") Integer spotId, 
                                  @Param("hours") Integer hours,
                                  @Param("currentTime") LocalDateTime currentTime);
    
    // 특정 warehouse에서 12시간 이내 알림 개수 조회 (위험도 판단용)
    int countRecentAlertsByWarehouseId(@Param("warehouseId") Integer warehouseId, 
                                      @Param("hours") Integer hours,
                                      @Param("currentTime") LocalDateTime currentTime);
    
    // Alert 상태 업데이트
    int updateAlertStatus(@Param("alertId") Integer alertId, 
                         @Param("status") AlertStatus status, 
                         @Param("updatedAt") LocalDateTime updatedAt);
    
    // Alert updated_at 업데이트
    int updateAlertUpdatedAt(@Param("alertId") Integer alertId, 
                            @Param("updatedAt") LocalDateTime updatedAt);
}
