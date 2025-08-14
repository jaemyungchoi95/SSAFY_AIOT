package kr.kro.areuhot.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ErrorCode {
    INVALID_INPUT(400, "잘못된 요청입니다."),
    RESOURCE_NOT_FOUND(404, "요청한 리소스를 찾을 수 없습니다."),
    DUPLICATE_RESOURCE(409, "이미 존재하는 리소스입니다."),
    INTERNAL_SERVER_ERROR(500, "서버 내부 오류가 발생했습니다."),
    UNAUTHORIZED(401, "인증이 필요합니다."),
    FORBIDDEN(403, "접근 권한이 없습니다."),

    // map
    MAP_NOT_READY(404, "지도가 아직 준비되지 않았습니다."),

    // file
    PATH_MISSING(500, "파일 경로가 없습니다."),
    PATH_INVALID(500, "파일 경로가 올바르지 않습니다."),
    PRESIGN_FAILED(502, "Presign URL 생성에 실패했습니다."),

    // Alert 관련 에러
    ALERT_NOT_FOUND(404, "Alert을 찾을 수 없습니다."),
    ALERT_ALREADY_PROCESSED(409, "이미 처리된 Alert입니다."),
    ALERT_PROCESSING_NOT_FOUND(404, "AlertProcessing을 찾을 수 없습니다."),
    ALERT_PROCESSING_FAILED(500, "Alert Processing 저장에 실패했습니다."),
    ALERT_PROCESSING_UPDATE_FAILED(500, "Alert Processing 수정에 실패했습니다."),

    // Robot
    ROBOT_NOT_FOUND(404, "창고에 배정된 로봇이 없습니다."),
    ROBOT_BUSY(409, "로봇이 현재 작업 중입니다."),
    DUPLICATE_COMMAND(409, "중복된 명령입니다.");


    private final int status;
    private final String message;
}
