export const alertMockData = [
  {
    id: 1,
    robot_id: 1,
    rack_id: 1,
    warehouse_id: 1,
    x: 147,
    y: 53,
    temperature: 75.3,
    image_thermal_url: '../src/assets/caution.png',
    image_normal_url: '../src/assets/danger.png',
    direction: 90.0,
    status: 'UNCHECKED',
    is_danger: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    robot_id: 1,
    rack_id: 1,
    warehouse_id: 1,
    x: 151,
    y: 53,
    temperature: 68.1,
    image_thermal_url: '../src/assets/RackImg.png',
    image_normal_url: '../src/assets/TempImg.png',
    direction: 45.0,
    status: 'DONE',
    is_danger: false,
    created_at: new Date(
      new Date().getTime() - 5 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    updated_at: new Date(
      new Date().getTime() - 5 * 24 * 60 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 3,
    robot_id: 1,
    rack_id: 1,
    warehouse_id: 1,
    x: 155,
    y: 53,
    temperature: 80.2,
    image_thermal_url: './assets/RackImg.png',
    image_normal_url: './assets/TempImg.png',
    direction: 270.0,
    status: 'UNCHECKED',
    is_danger: false,
    created_at: new Date(
      new Date().getTime() - 9 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    updated_at: new Date(
      new Date().getTime() - 9 * 24 * 60 * 60 * 1000,
    ).toISOString(),
  },
  {
    id: 4,
    robot_id: 1,
    rack_id: 1,
    warehouse_id: 2,
    x: 159,
    y: 53,
    temperature: 75.3,
    image_thermal_url: './assets/RackImg.png',
    image_normal_url: './assets/TempImg.png',
    direction: 90.0,
    status: 'UNCHECKED',
    is_danger: true,
    created_at: new Date(
      new Date().getTime() - 5 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    updated_at: new Date(
      new Date().getTime() - 5 * 24 * 60 * 60 * 1000,
    ).toISOString(),
  },
];

export const reportMockData = [
  {
    id: 1,
    alert_id: 2,
    user_id: 1,
    handled_at: new Date(
      new Date().getTime() - 5 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    handler_name: '김철수',
    item_type: 'oil',
    rack_id: 5,
    comment: '온도 변화 이상',
  },
];

export const warehouseMockData = [
  {
    id: 1,
    name: '서울 - 1창고',
    location: '서울특별시 구로구 고척로 47',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: '경기 - 2창고',
    location: '경기도 성남시 분당구 판교역로 240',
    created_at: new Date().toISOString(),
  },
];
