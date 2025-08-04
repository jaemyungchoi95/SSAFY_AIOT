export const alertMockData = [
  {
    alertId: 1,
    warehouseId: 1,
    rackId: 1,
    spotId: 1,
    temperature: 75.3,
    image_thermal_url: '../src/assets/caution.png',
    image_normal_url: '../src/assets/danger.png',
    status: 'UNCHECKED',
    isDanger: false,
    createdAt: '2025-07-23 09:00:00',
    updatedAt: '2025-07-24 09:00:00',
  },
  {
    alertId: 2,
    warehouseId: 2,
    rackId: 8,
    spotId: 9,
    temperature: 68.1,
    image_thermal_url: '../src/assets/RackImg.png',
    image_normal_url: '../src/assets/TempImg.png',
    status: 'DONE',
    isDanger: false,
    createdAt: '2025-07-24 09:00:00',
    updatedAt: '2025-07-25 09:00:00',
  },
  {
    alertId: 3,
    warehouseId: 2,
    rackId: 9,
    spotId: 30,
    temperature: 80.2,
    image_thermal_url: './assets/RackImg.png',
    image_normal_url: './assets/TempImg.png',
    status: 'UNCHECKED',
    isDanger: false,
    createdAt: '2025-07-25 09:00:00',
    updatedAt: '2025-07-26 09:00:00',
  },
  {
    alertId: 4,
    warehouseId: 2,
    rackId: 10,
    spotId: 35,
    temperature: 75.3,
    image_thermal_url: './assets/RackImg.png',
    image_normal_url: './assets/TempImg.png',
    status: 'UNCHECKED',
    isDanger: true,
    createdAt: '2025-08-01 09:00:00',
    updatedAt: '2025-08-02 09:00:00',
  },
];

export const reportMockData = [
  {
    reportId: 1,
    warehouseId: 2,
    alertId: 2,
    userId: 1,
    handledAt: new Date(
      new Date().getTime() - 5 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    handlerName: '김철수',
    itemType: 'oil',
    rackId: 8,
    comment: '온도 변화 이상',
  },
];

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
