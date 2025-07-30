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

    MAP_NOT_READY(400, "지도가 아직 준비되지 않았습니다."),
    ROBOT_BUSY(409, "로봇이 현재 작업 중입니다.");


    private final int status;
    private final String message;
}
