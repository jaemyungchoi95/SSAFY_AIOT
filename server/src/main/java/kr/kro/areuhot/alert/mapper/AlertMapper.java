package kr.kro.areuhot.alert.mapper;

import kr.kro.areuhot.alert.model.Alert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface AlertMapper {
    
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
                                  @Param("hours") int hours, 
                                  @Param("currentTime") LocalDateTime currentTime);
    
    // 특정 warehouse에서 12시간 이내 알림 개수 조회 (위험도 판단용)
    int countRecentAlertsByWarehouseId(@Param("warehouseId") Integer warehouseId, 
                                      @Param("hours") int hours, 
                                      @Param("currentTime") LocalDateTime currentTime);
} 