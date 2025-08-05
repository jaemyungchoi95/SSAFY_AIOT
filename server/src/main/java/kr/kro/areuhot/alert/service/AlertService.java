package kr.kro.areuhot.alert.service;

import kr.kro.areuhot.alert.dto.*;
import kr.kro.areuhot.alert.mapper.AlertMapper;
import kr.kro.areuhot.alert.model.Alert;
import kr.kro.areuhot.alert.model.AlertStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AlertService {
    private final AlertMapper alertMapper;

    private static final int DANGER_THRESHOLD_HOURS = 12; // 12시간 이내
    private static final int DANGER_THRESHOLD_COUNT = 2;  // 2번 이상

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

    public AlertDetailResponseDto getAlertDetail(int alertId) {
        return alertMapper.getAlertDetailByAlertId(alertId);
    }

    public long countAlerts(AlertSearchCondition condition) {
        return alertMapper.countAlerts(condition);
    }

    @Transactional
    public void saveAlertFromMqtt(RobotAlertMessage mqttMessage) {
        try {
            log.info("MQTT 메시지를 Alert로 저장 시작: spot_uuid={}, robot_id={}",
                    mqttMessage.getSpotUuid(), mqttMessage.getRobotId());

            // 1. spot_uuid로 spot_id 조회
            Integer spotId = alertMapper.findSpotIdByUuid(mqttMessage.getSpotUuid());
            if (spotId == null) {
                log.error("spot_uuid에 해당하는 spot을 찾을 수 없음: {}", mqttMessage.getSpotUuid());
                return;
            }

            // 2. robot_id로 warehouse_id 조회
            Integer warehouseId = alertMapper.findWarehouseIdByRobotId(mqttMessage.getRobotId());
            if (warehouseId == null) {
                log.error("robot_id에 해당하는 warehouse를 찾을 수 없음: {}", mqttMessage.getRobotId());
                return;
            }

            // 3. spot_id로 rack_id 조회
            Integer rackId = alertMapper.findRackIdBySpotId(spotId);
            if (rackId == null) {
                log.error("spot_id에 해당하는 rack을 찾을 수 없음: {}", spotId);
                return;
            }

            // 4. 위험도 판단
            boolean danger = determineDangerLevel(spotId, warehouseId);

            // 5. Alert 엔티티 생성
            LocalDateTime now = LocalDateTime.now();
            Alert alert = Alert.builder()
                    .robotId(mqttMessage.getRobotId())
                    .rackId(rackId)
                    .warehouseId(warehouseId)
                    .spotId(spotId)
                    .temperature(mqttMessage.getTemperature())
                    .imageThermalUrl(mqttMessage.getImageThermalUrl())
                    .imageNormalUrl(mqttMessage.getImageNormalUrl())
                    .status(AlertStatus.UNCHECKED)
                    .danger(danger)
                    .createdAt(mqttMessage.getCreatedAt() != null ? mqttMessage.getCreatedAt() : now)
                    .updatedAt(now)
                    .build();

            // 6. Alert 저장
            int result = alertMapper.insertAlert(alert);

            if (result > 0) {
                log.info("Alert 저장 성공: id={}, spot_id={}, robot_id={}, is_danger={}",
                        alert.getId(), spotId, mqttMessage.getRobotId(), danger);
            } else {
                log.error("Alert 저장 실패: spot_uuid={}, robot_id={}",
                        mqttMessage.getSpotUuid(), mqttMessage.getRobotId());
            }

        } catch (Exception e) {
            log.error("MQTT 메시지를 Alert로 저장 중 오류 발생", e);
        }
    }

    /**
     * 위험도 판단 로직
     * - 특정 spot에서 12시간 이내 2번 이상 알림이 발생하면 위험
     * - 특정 warehouse에서 12시간 이내 3번 이상 알림이 발생하면 위험
     */
    private boolean determineDangerLevel(Integer spotId, Integer warehouseId) {
        LocalDateTime currentTime = LocalDateTime.now();

        try {
            // 1. 해당 spot에서 12시간 이내 알림 개수 확인
            int spotAlertCount = alertMapper.countRecentAlertsBySpotId(spotId, DANGER_THRESHOLD_HOURS, currentTime);

            if (spotAlertCount >= DANGER_THRESHOLD_COUNT) {
                log.warn("위험도 판단: spot_id={}에서 12시간 이내 {}번의 알림 발생 (임계값: {})",
                        spotId, spotAlertCount, DANGER_THRESHOLD_COUNT);
                return true;
            }

            // 2. 해당 warehouse에서 12시간 이내 알림 개수 확인
            int warehouseAlertCount = alertMapper.countRecentAlertsByWarehouseId(warehouseId, DANGER_THRESHOLD_HOURS, currentTime);

            if (warehouseAlertCount >= 3) { // warehouse는 3번 이상이면 위험
                log.warn("위험도 판단: warehouse_id={}에서 12시간 이내 {}번의 알림 발생 (임계값: 3)",
                        warehouseId, warehouseAlertCount);
                return true;
            }

            return false;

        } catch (Exception e) {
            log.error("위험도 판단 중 오류 발생: spot_id={}, warehouse_id={}", spotId, warehouseId, e);
            return false; // 오류 발생 시 안전하게 false 반환
        }
    }
}