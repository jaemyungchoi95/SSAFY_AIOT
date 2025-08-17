# 마! 뜨급나?
물류 창고 화재 예방·모니터링 플랫폼 `마! 뜨급나?`는 SLAM 기반 맵과 자율주행 로봇, 열화상 리포트, 실시간 알림을 하나로 통합하여 제공하는 산업용 모니터링 시스템입니다. 

> **🚨 기본 프로젝트트 정보**
> - 배포 URL: http://are-u-hot.kro.kr/
> - 총 기획·개발 기간: 25.07.14 ~ 25.08.18 
> 
> **🚨 TEST 계정 정보**
> - id: ssafy
> - password: hot123

## 프로젝트 소개 
**🚨 문제**  
물류 창고는 밀집 적재·열원·사각지대 등으로 초기 발화 징후 파악이 어려워 탐지 지연이 발생하고, 이로 인해 큰 피해를 입을 수 있습니다.

**🚨 해결**  
`마! 뜨급나?`는 SLAM 기반 자율주행 로봇이 창고 내 촬영 스팟을 정기 순찰하며 열화상 데이터를 수집·분석하고, 이상 온도를 감지하면 실시간 알림/지도 시각화로 즉각 대응을 유도합니다.  
프론트는 PWA로, 관리자·작업자는 모바일에서 알림을 받고 현장까지의 정확한 위치 안내 및 처리 이력 등록이 가능합니다.

**🚨 핵심 가치**  
- 발화 전 단계의 조기 징후 탐지로 피해 최소화  
- 알림/처리 이력의 표준화로 대응 시간 단축  
- 원격-현장 협업(관리자↔작업자)을 통한 오퍼레이션 안정성 향상

**🚨 구성/흐름(요약)**  
- 로봇: SLAM 맵 업로드·순찰·열화상 촬영 → 이상 시 리포트 발행
- 백엔드: Spring Boot + MyBatis, 세션 인증, WebSocket(STOMP) 브로드캐스트, S3 presigned URL로 이미지 안전 제공  
- 프론트: React, PWA, 실시간 위치·리포트 지도 시각화, 처리 이력 기록

**🚨 주요 시나리오**  
1) 로봇이 스팟 도달 → 열화상 촬영/분석 → 이상 온도 감지 시 리포트 전송  
2) 서버 저장(S3 키) → presigned URL 변환 → WebSocket으로 실시간 알림  
3) 관리자/작업자: 모바일에서 위치·이미지 확인 → 처리 이력 등록(세션 인증)

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
├── frontend/                # 프론트엔드 (React.js, PWA)
└── embedded/                # 로봇 스크립트/도구 (Python, MQTT)
```

## 팀원 구성 및 역할 분배 
| 이름 | 역할 | 담당 영역 | 주 사용 스택 | 
|:----:|:----:|-----------|--------------|
| 김준엽 | Embedded | RBi, Jetson 제어·통신 구현 | Python, Paho MQTT, ROS2 |
| 한경훈 | Embedded | 팀장, SLAM, 자율주행 | Python, Paho MQTT, ROS2 |
| 유아름 | Backend | 비즈니스 로직 구현, DB 설계, design, 영상 포트폴리오  | Java, Spring Boot, MyBatis, MySQL, WebSocket |
| 황상하 | Backend | 발표, 맵 데이터 전처리, MQTT, DB | Java, Spring Boot, MyBatis, MySQL, Python, MQTT |
| 남여경 | Frontend | 컴포넌트 기반 페이지 구조 설계·구현 | React, Zustand |
| 최재명 | Frontend, Infra | 인프라, 전역 상태 관리 구조 설계·구현 | React, Zustand, Docker |

