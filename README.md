# 물류 창고 화재 예방·모니터링 플랫폼 마! 뜨급나?
물류 창고 화재 예방·모니터링 플랫폼 `마! 뜨급나?`는 SLAM 기반 맵과 자율주행 로봇, 열화상 리포트, 실시간 알림을 하나로 통합하여 제공하는 산업용 모니터링 시스템입니다. 
- 배포 URL: http://are-u-hot.kro.kr/
- 개발 기간: 25.07.21 ~ 25.08.18 

- TEST 계정
> - id: ssafy
> - password: hot123

## 프로젝트 소개 

## 빠른 시작 

## 핵심 기능 

## 개발 환경 

## 아키텍처 

## 기술 스택 
- Embedded: ROS2, 
- Frontend: JavaScript, React, Zustand, Tailwind 
- Backend: Python 3.10.11, Java 21, Spring Boot 3.5.3, Spring Security 6, MyBatis, Lombok, WebSocket(STOMP)
- DB: MySQL 8.0.37
- Storage: AWS S3 (presigned URL)

## 프로젝트 구조 
```
root/
├── server/                  # Spring Boot 백엔드 (MyBatis)
│   └── src/main/java/kr/kro/areuhot/
│       ├── alert/           # 도메인 패키지(예: alert)
│       │   ├── controller/  │ REST API
│       │   ├── service/     │ 도메인 서비스
│       │   ├── mapper/      │ MyBatis Mapper
│       │   ├── dto/         │ 요청/응답 DTO
│       │   └── model/       │ DB 매핑 모델
│       ├── map/
│       ├── rack/
│       ├── spot/
│       ├── adminauth/
│       ├── warehouse/
│       ├── rackspot/
│       ├── robot/
│       └── common/          # 공통 Util, Error, WebSocket 등
├── web/                     # 프론트엔드 (React.js, PWA)
└── embedded/                # 로봇 스크립트/도구 (Python, MQTT)
```

## 팀원 구성 및 역할 분배 
| 이름 | 역할 | 담당 영역 | 주 사용 스택 | 
|:----:|:----:|-----------|--------------|
| 김준엽 | Embedded/Robot | SLAM, MQTT, 라우팅 | Python, Paho MQTT, ROS |
| 한경훈 | Embedded/Robot | SLAM, MQTT, 라우팅 | Python, Paho MQTT, ROS |
| 유아름 | Backend | 인증·세션 Alert API, MyBatis  | Java, Spring Boot, MyBatis, MySQL |
| 황상하 | Backend | SLAM map 전처리 및 spot 추출,  MyBatis | Java, Spring Boot, MyBatis, MySQL |
| 남여경 | Frontend | 맵 렌더링, WebSocket, PWA | React, Zustand |
| 최재명 | Frontend | 맵 렌더링, WebSocket, PWA | React, Zustand |

