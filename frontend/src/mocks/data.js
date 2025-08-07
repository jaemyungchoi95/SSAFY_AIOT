// 노션 Backend 작업목록 -> API 설계상 순서대로  MSW용 Mock 데이터를 구성한다

// 1. 맵 / GET 요청
// : /api/warehouses/{warehouse_id}/map
export const warehouseMapMockData = [
  {
    mapId: 1,
    warehouseId: 1,
    filePath: '/mock_my_world.pgm', // 향후 실제 API 호출시에는 S3 Url 입력될 예정
  },
  {
    mapId: 2,
    warehouseId: 2,
    filePath: '/JSI_SLAM_map.pgm', // 향후 실제 API 호출시에는 S3 Url 입력될 예정
  },
];

// 2. 창고list / GET 요청 / 백엔드 API 테스트 완료
// : /api/warehouses
export const warehouseMockData = [
  {
    warehouseId: 1,
    name: '서울 - 1창고',
    location: '서울특별시 구로구 고척로 47',
  },
  {
    warehouseId: 2,
    name: '경기 - 2창고',
    location: '경기도 성남시 분당구 판교역로 240',
  },
];

// 3. 랙 List / GET 요청 / 백엔드 API 테스트 완료
// : /api/warehouses/{warehouse_id}/racks
export const rackList = [
  {
    rackId: 1,
    warehouseId: 1,
    mapId: 2,
    x1: 30.0,
    y1: 30.0,
    x2: 40.0,
    y2: 30.0,
    x3: 40.0,
    y3: 40.0,
    x4: 30.0,
    y4: 40.0,
    centerX: 35.0,
    centerY: 35.0,
    spotList: [
      {
        spotId: 1,
        x: 35.0,
        y: 30.0,
        direction: 270.0,
      },
    ],
  },
  {
    rackId: 8,
    warehouseId: 2,
    mapId: 6,
    x1: 274.0,
    y1: 495.0,
    x2: 295.0,
    y2: 320.0,
    x3: 568.0,
    y3: 353.0,
    x4: 547.0,
    y4: 0.0,
    centerX: 421.0,
    centerY: 424.0,
    spotList: [
      {
        spotId: 9,
        x: 244.0,
        y: 491.0,
        direction: 186.8,
      },
      {
        spotId: 10,
        x: 249.0,
        y: 448.0,
        direction: 186.8,
      },
      {
        spotId: 11,
        x: 255.0,
        y: 404.0,
        direction: 186.8,
      },
      {
        spotId: 12,
        x: 260.0,
        y: 360.0,
        direction: 186.8,
      },
      {
        spotId: 13,
        x: 299.0,
        y: 290.0,
        direction: 276.9,
      },
      {
        spotId: 14,
        x: 344.0,
        y: 296.0,
        direction: 276.9,
      },
      {
        spotId: 15,
        x: 390.0,
        y: 301.0,
        direction: 276.9,
      },
      {
        spotId: 16,
        x: 435.0,
        y: 307.0,
        direction: 276.9,
      },
      {
        spotId: 17,
        x: 481.0,
        y: 312.0,
        direction: 276.9,
      },
      {
        spotId: 18,
        x: 526.0,
        y: 318.0,
        direction: 276.9,
      },
      {
        spotId: 19,
        x: 572.0,
        y: 323.0,
        direction: 276.9,
      },
      {
        spotId: 20,
        x: 598.0,
        y: 357.0,
        direction: 6.8,
      },
      {
        spotId: 21,
        x: 593.0,
        y: 400.0,
        direction: 6.8,
      },
      {
        spotId: 22,
        x: 587.0,
        y: 444.0,
        direction: 6.8,
      },
      {
        spotId: 23,
        x: 582.0,
        y: 488.0,
        direction: 6.8,
      },
      {
        spotId: 24,
        x: 577.0,
        y: 532.0,
        direction: 6.8,
      },
      {
        spotId: 25,
        x: 543.0,
        y: 558.0,
        direction: 96.9,
      },
      {
        spotId: 26,
        x: 498.0,
        y: 552.0,
        direction: 96.9,
      },
      {
        spotId: 27,
        x: 452.0,
        y: 547.0,
        direction: 96.9,
      },
      {
        spotId: 28,
        x: 316.0,
        y: 530.0,
        direction: 96.9,
      },
      {
        spotId: 29,
        x: 270.0,
        y: 525.0,
        direction: 96.9,
      },
    ],
  },
  {
    rackId: 9,
    warehouseId: 2,
    mapId: 6,
    x1: 531.0,
    y1: 273.0,
    x2: 550.0,
    y2: 257.0,
    x3: 570.0,
    y3: 281.0,
    x4: 551.0,
    y4: 0.0,
    centerX: 550.0,
    centerY: 277.0,
    spotList: [
      {
        spotId: 30,
        x: 512.0,
        y: 250.0,
        direction: 229.9,
      },
      {
        spotId: 31,
        x: 589.0,
        y: 304.0,
        direction: 49.9,
      },
      {
        spotId: 32,
        x: 570.0,
        y: 320.0,
        direction: 49.9,
      },
      {
        spotId: 33,
        x: 528.0,
        y: 316.0,
        direction: 140.2,
      },
      {
        spotId: 34,
        x: 508.0,
        y: 292.0,
        direction: 140.2,
      },
    ],
  },
  {
    rackId: 10,
    warehouseId: 2,
    mapId: 6,
    x1: 491.0,
    y1: 241.0,
    x2: 502.0,
    y2: 241.0,
    x3: 502.0,
    y3: 252.0,
    x4: 491.0,
    y4: 0.0,
    centerX: 496.0,
    centerY: 246.0,
    spotList: [
      {
        spotId: 35,
        x: 491.0,
        y: 211.0,
        direction: 270.0,
      },
      {
        spotId: 36,
        x: 502.0,
        y: 211.0,
        direction: 270.0,
      },
      {
        spotId: 37,
        x: 532.0,
        y: 241.0,
        direction: 0.0,
      },
      {
        spotId: 38,
        x: 532.0,
        y: 252.0,
        direction: 0.0,
      },
      {
        spotId: 39,
        x: 502.0,
        y: 282.0,
        direction: 90.0,
      },
      {
        spotId: 40,
        x: 491.0,
        y: 282.0,
        direction: 90.0,
      },
      {
        spotId: 41,
        x: 461.0,
        y: 252.0,
        direction: 180.0,
      },
      {
        spotId: 42,
        x: 461.0,
        y: 241.0,
        direction: 180.0,
      },
    ],
  },
];

// 4. 맵, 랙, 촬영스팟 전송 / POST 요청
// : /api/robots/{robot_id}/full-map
// 이 항목은 백엔드-로봇간 통신

// 5. 창고 내부 위험 리포트 (단일) → 실시간 알림시 가져오는 용 (리스트 추가) / GET 요청
// : /api/warehouses/{warehouseId}/alerts/{alertId}
export const alertMonoMockData = [
  {
    alertId: 1,
    warehouseId: 1,
    warehouseName: '서울 - 1창고',
    userName: '최관리자',
    rackId: 1,
    spotId: 1,
    temperature: 75.3,
    status: 'UNCHECKED',
    danger: false,
    createdAt: '2025-07-23 09:00:00',
    updatedAt: '2025-07-24 09:00:00',
    processingId: null,
    comment: null,
  },
  {
    alertId: 2,
    warehouseId: 2,
    warehouseName: '경기 - 2창고',
    userName: '남관리자',
    rackId: 8,
    spotId: 9,
    temperature: 68.1,
    status: 'DONE',
    danger: false,
    createdAt: '2025-07-24 09:00:00',
    updatedAt: '2025-07-25 09:00:00',
    processingId: 1,
    comment: '온도 변화 이상',
  },
  {
    alertId: 3,
    warehouseId: 2,
    warehouseName: '경기 - 2창고',
    userName: '남관리자',
    rackId: 9,
    spotId: 30,
    temperature: 80.2,
    status: 'UNCHECKED',
    danger: false,
    createdAt: '2025-07-25 09:00:00',
    updatedAt: '2025-07-26 09:00:00',
    processingId: null,
    comment: null,
  },
  {
    alertId: 4,
    warehouseId: 2,
    warehouseName: '경기 - 2창고',
    userName: '남관리자',
    rackId: 10,
    spotId: 35,
    temperature: 75.3,
    status: 'UNCHECKED',
    danger: true,
    createdAt: '2025-08-01 09:00:00',
    updatedAt: '2025-08-02 09:00:00',
    processingId: null,
    comment: null,
  },
];

// 6. 위험 리포트(단일) 디테일 (모달, 클릭) / POST 요청 / 백엔드 API 테스트 완료
// : /api/alerts/{alertId}
export const alertMonoDetailMockData = {
  alertId: 2,
  warehouseId: 2,
  warehouseName: '경기 - 2창고',
  userName: '남관리자',
  rackId: 8,
  spotId: 9,
  temperature: 80.2,
  imageThermalUrl: null,
  imageNormalUrl: null,
  status: 'DONE',
  danger: false,
  createdAt: '2025-07-25 09:00:00',
  updatedAt: '2025-07-26 19:00:00',
  processingId: null,
  handlerName: '최재명',
  comment: '현장 근처가 뜨거움',
  itemType: '배터리',
  handledAt: '2025-07-26 19:00:00',
};

// 7. 창고 내부 위험 리포트 list / GET 요청
// : /api/warehouses/{warehouseId}/alerts
export const monoWarehouseAlertListMockData = {
  content: [
    {
      alertId: 1,
      warehouseId: 1,
      warehouseName: '서울 - 1창고',
      userName: '최관리자',
      rackId: 1,
      spotId: 1,
      temperature: 75.3,
      status: 'UNCHECKED',
      danger: false,
      createdAt: '2025-07-23 09:00:00',
      updatedAt: '2025-07-24 09:00:00',
      processingId: null,
      comment: null,
    },
    {
      alertId: 2,
      warehouseId: 2,
      warehouseName: '경기 - 2창고',
      userName: '남관리자',
      rackId: 8,
      spotId: 9,
      temperature: 68.1,
      status: 'DONE',
      danger: false,
      createdAt: '2025-07-24 09:00:00',
      updatedAt: '2025-07-25 09:00:00',
      processingId: 1,
      comment: '온도 변화 이상',
    },
    {
      alertId: 3,
      warehouseId: 2,
      warehouseName: '경기 - 2창고',
      userName: '남관리자',
      rackId: 9,
      spotId: 30,
      temperature: 80.2,
      status: 'UNCHECKED',
      danger: false,
      createdAt: '2025-07-25 09:00:00',
      updatedAt: '2025-07-26 09:00:00',
      processingId: null,
      comment: null,
    },
    {
      alertId: 4,
      warehouseId: 2,
      warehouseName: '경기 - 2창고',
      userName: '남관리자',
      rackId: 10,
      spotId: 35,
      temperature: 75.3,
      status: 'UNCHECKED',
      danger: true,
      createdAt: '2025-08-01 09:00:00',
      updatedAt: '2025-08-02 09:00:00',
      processingId: null,
      comment: null,
    },
  ],
  offset: 0,
  limit: null,
  totalElements: null,
  totalPages: null,
  last: null,
};

// 8. 전체 창고 위험 리포트 list / GET 요청
// : /api/alerts
export const wholeWarehouseAlertListMockData = {
  content: [
    {
      alertId: 1,
      warehouseId: 1,
      warehouseName: '서울 - 1창고',
      userName: '최관리자',
      rackId: 1,
      spotId: 1,
      temperature: 75.3,
      status: 'UNCHECKED',
      danger: false,
      createdAt: '2025-07-23 09:00:00',
      updatedAt: '2025-07-24 09:00:00',
      processingId: null,
      comment: null,
    },
    {
      alertId: 2,
      warehouseId: 2,
      warehouseName: '경기 - 2창고',
      userName: '남관리자',
      rackId: 8,
      spotId: 9,
      temperature: 68.1,
      status: 'DONE',
      danger: false,
      createdAt: '2025-07-24 09:00:00',
      updatedAt: '2025-07-25 09:00:00',
      processingId: 1,
      comment: '온도 변화 이상',
    },
    {
      alertId: 3,
      warehouseId: 2,
      warehouseName: '경기 - 2창고',
      userName: '남관리자',
      rackId: 9,
      spotId: 30,
      temperature: 80.2,
      status: 'UNCHECKED',
      danger: false,
      createdAt: '2025-07-25 09:00:00',
      updatedAt: '2025-07-26 09:00:00',
      processingId: null,
      comment: null,
    },
    {
      alertId: 4,
      warehouseId: 2,
      warehouseName: '경기 - 2창고',
      userName: '남관리자',
      rackId: 10,
      spotId: 35,
      temperature: 75.3,
      status: 'UNCHECKED',
      danger: true,
      createdAt: '2025-08-01 09:00:00',
      updatedAt: '2025-08-02 09:00:00',
      processingId: null,
      comment: null,
    },
  ],
  offset: 0,
  limit: null,
  totalElements: null,
  totalPages: null,
  last: null,
};

// 9. 빈칸
// : 빈칸

// 10. 창고 내부 로봇 list / GET 요청
// : 빈칸

// 11. 리포트 처리 등록 / POST 요청
// : 빈칸

// 12. 리포트 처리 수정 / PATCH 요청
// : 빈칸

// 13. 유저 로그인 / POST 요청
// : 빈칸
