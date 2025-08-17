package kr.kro.areuhot.alert.service;

import kr.kro.areuhot.alert.dto.*;
import kr.kro.areuhot.alert.mapper.AlertMapper;
import kr.kro.areuhot.alert.mapper.AlertProcessingMapper;
import kr.kro.areuhot.alert.model.Alert;
import kr.kro.areuhot.alert.model.AlertProcessing;
import kr.kro.areuhot.alert.model.AlertStatus;
import kr.kro.areuhot.alert.util.AlertConditionValidator;
import kr.kro.areuhot.common.exception.CustomException;
import kr.kro.areuhot.common.exception.ErrorCode;
import kr.kro.areuhot.common.util.S3Util;
import kr.kro.areuhot.common.websocket.WebSocketPublisher;
import kr.kro.areuhot.common.websocket.WebSocketTopic;
import kr.kro.areuhot.event.CreatedAlertEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AlertService {
    private final AlertMapper alertMapper;
    private final AlertProcessingMapper alertProcessingMapper;
    private final S3Util s3Util;
    private final WebSocketPublisher publisher;
    private final AlertConditionValidator validator;

    // firebase
    private final ApplicationEventPublisher eventPublisher;

    private static final int DANGER_THRESHOLD_HOURS = 12; // 12시간 이내
    private static final int DANGER_THRESHOLD_COUNT = 2; // 2번 이상

    public AlertResponseDto getAlertsById(Integer warehouseId, Integer alertId) {
        AlertResponseDto dto = alertMapper.getAlertByAlertId(warehouseId, alertId);
        if (dto == null)
            throw new CustomException(ErrorCode.ALERT_NOT_FOUND);
        return dto;
    }

    public AlertPageResponseDto getPagedAlerts(AlertSearchCondition condition, Integer limit, Integer offset) {
        if (condition != null)
            validator.validate(condition);

        long totalElements = countAlerts(condition);

        if (totalElements == 0) {
            return AlertPageResponseDto.builder()
                    .content(Collections.emptyList())
                    .offset(offset)
                    .limit(limit)
                    .totalElements(0L)
                    .totalPages(0)
                    .last(true)
                    .build();
        }

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

    public AlertDetailResponseDto getAlertDetail(Integer alertId) {
        AlertDetailResponseDto dto = alertMapper.getAlertDetailByAlertId(alertId);

        if (dto == null)
            throw new CustomException(ErrorCode.ALERT_NOT_FOUND);

        if (dto.getImageThermalUrl() != null) {
            String presignedUrl = s3Util.generatePresignedUrl(dto.getImageThermalUrl());
            dto.setImageThermalUrl(presignedUrl);
        }
        if (dto.getImageNormalUrl() != null) {
            String presignedUrl = s3Util.generatePresignedUrl(dto.getImageNormalUrl());
            dto.setImageNormalUrl(presignedUrl);
        }

        return dto;
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
            String thermalUrl = s3Util.extractKeyFromUrl(mqttMessage.getImageThermalUrl());
            String normalUrl = s3Util.extractKeyFromUrl(mqttMessage.getImageNormalUrl());
            Alert alert = Alert.builder()
                    .robotId(mqttMessage.getRobotId())
                    .rackId(rackId)
                    .warehouseId(warehouseId)
                    .spotId(spotId)
                    .temperature(mqttMessage.getTemperature())
                    .imageThermalUrl(thermalUrl)
                    .imageNormalUrl(normalUrl)
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
                publishAlert(alert);
                // firebase
                eventPublisher.publishEvent(CreatedAlertEvent.of(alert));
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
            int warehouseAlertCount = alertMapper.countRecentAlertsByWarehouseId(warehouseId, DANGER_THRESHOLD_HOURS,
                    currentTime);

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

    @Transactional
    public void processAlert(Integer alertId, AlertProcessingRequestDto requestDto) {
        try {
            log.info("Alert Processing 시작: alert_id={}, handler_name={}",
                    alertId, requestDto.getHandlerName());

            // 1. Alert 존재 여부 및 상태 확인
            Alert alert = alertMapper.findAlertById(alertId);
            if (alert == null) {
                log.error("Alert을 찾을 수 없음: alert_id={}", alertId);
                throw new CustomException(ErrorCode.ALERT_NOT_FOUND);
            }
            if (alert.getStatus() == AlertStatus.DONE) {
                log.error("이미 처리된 Alert: alert_id={}", alertId);
                throw new CustomException(ErrorCode.ALERT_ALREADY_PROCESSED);
            }

            // 2. Alert에서 rackId 가져오기
            Integer rackId = alert.getRackId();

            // 3. AlertProcessing 저장
            LocalDateTime handledAt = requestDto.getUpdatedAt() != null ? requestDto.getUpdatedAt()
                    : LocalDateTime.now();

            AlertProcessing processing = AlertProcessing.builder()
                    .alertId(alertId)
                    .userId(requestDto.getUserId())
                    .handledAt(handledAt)
                    .handlerName(requestDto.getHandlerName())
                    .itemType(requestDto.getItemType())
                    .rackId(rackId)
                    .comment(requestDto.getComment())
                    .build();

            int processingResult = alertProcessingMapper.insertAlertProcessing(processing);

            // 4. Alert 상태를 DONE으로 변경
            int alertResult = alertMapper.updateAlertStatus(alertId, AlertStatus.DONE, handledAt);

            if (processingResult > 0 && alertResult > 0) {
                log.info("Alert Processing 성공: alert_id={}, processing_id={}",
                        alertId, processing.getId());
            } else {
                log.error("Alert Processing 실패: alert_id={}", alertId);
                throw new CustomException(ErrorCode.ALERT_PROCESSING_FAILED);
            }

        } catch (Exception e) {
            log.error("Alert Processing 중 오류 발생: alert_id={}", alertId, e);
            throw e;
        }
    }

    @Transactional
    public void updateAlertProcessing(Integer alertId, AlertProcessingRequestDto requestDto) {
        try {
            log.info("Alert Processing 수정 시작: alert_id={}, handler_name={}",
                    alertId, requestDto.getHandlerName());

            // 1. Alert 존재 여부 확인
            Alert alert = alertMapper.findAlertById(alertId);
            if (alert == null) {
                log.error("Alert을 찾을 수 없음: alert_id={}", alertId);
                throw new CustomException(ErrorCode.ALERT_NOT_FOUND);
            }

            // 2. AlertProcessing 존재 여부 확인
            AlertProcessing existingProcessing = alertProcessingMapper.findByAlertId(alertId);
            if (existingProcessing == null) {
                log.error("AlertProcessing을 찾을 수 없음: alert_id={}", alertId);
                throw new CustomException(ErrorCode.ALERT_PROCESSING_NOT_FOUND);
            }

            // 3. Alert에서 rackId 가져오기
            Integer rackId = alert.getRackId();

            // 4. 업데이트 시간 설정
            LocalDateTime updatedAt = requestDto.getUpdatedAt() != null ? requestDto.getUpdatedAt()
                    : LocalDateTime.now();

            // 5. AlertProcessing 전체 업데이트
            AlertProcessing updatedProcessing = AlertProcessing.builder()
                    .id(existingProcessing.getId())
                    .alertId(alertId)
                    .userId(requestDto.getUserId())
                    .handledAt(updatedAt)
                    .handlerName(requestDto.getHandlerName())
                    .itemType(requestDto.getItemType())
                    .rackId(rackId)
                    .comment(requestDto.getComment())
                    .build();

            int processingResult = alertProcessingMapper.updateAlertProcessing(updatedProcessing);

            // 6. Alert의 updatedAt도 함께 업데이트
            int alertResult = alertMapper.updateAlertUpdatedAt(alertId, updatedAt);

            if (processingResult > 0 && alertResult > 0) {
                log.info("Alert Processing 수정 성공: alert_id={}, processing_id={}",
                        alertId, existingProcessing.getId());
            } else {
                log.error("Alert Processing 수정 실패: alert_id={}", alertId);
                throw new CustomException(ErrorCode.ALERT_PROCESSING_UPDATE_FAILED);
            }

        } catch (Exception e) {
            log.error("Alert Processing 수정 중 오류 발생: alert_id={}", alertId, e);
            throw e;
        }
    }

    private void publishAlert(Alert dto) {
        AlertMessageDto message = AlertMessageDto.builder()
                .alertId(dto.getId())
                .spotId(dto.getSpotId())
                .rackId(dto.getRackId())
                .temperature(dto.getTemperature())
                .danger(dto.getDanger())
                .createdAt(dto.getCreatedAt())
                .build();

        publisher.send(WebSocketTopic.ALERT, message);
    }
}