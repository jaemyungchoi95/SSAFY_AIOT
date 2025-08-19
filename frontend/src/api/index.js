import axios from 'axios';

const getResponseData = (res) => res.data.data;

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_SPRING_BASE_URL;

// 1. 맵 / GET 요청
// : /api/warehouses/{warehouse_id}/map
// useAppStore.js 의 fetchInitialData에 사용됨
export const fetchMapInfo = (warehouseId) =>
  axios.get(`/api/warehouses/${warehouseId}/map`).then(getResponseData);

// 2. 창고list / GET 요청
// : /api/warehouses
// useAppStore.js 의 initializeAppData에 사용됨
export const fetchWarehouses = () =>
  axios.get('/api/warehouses').then(getResponseData);

// 3. 랙 List / GET 요청
// : /api/warehouses/{warehouse_id}/racks
// useAppStore.js 의 fetchInitialData에 사용됨
export const fetchRacks = (warehouseId) =>
  axios.get(`/api/warehouses/${warehouseId}/racks`).then(getResponseData);

// 4. 맵, 랙, 촬영스팟 전송 / POST 요청
// : /api/robots/{robot_id}/full-map
// 이 항목은 백엔드-로봇간 통신

// 5. 창고 내부 위험 리포트 (단일) → 실시간 알림시 가져오는 용 (리스트 추가) / GET 요청
// : /api/warehouses/{warehouseId}/alerts/{alertId}
export const fetchMonoAlert = (warehouseId, alertId) =>
  axios
    .get(`/api/warehouses/${warehouseId}/alerts/${alertId}`)
    .then(getResponseData);

// 6. 위험 리포트(단일) 디테일 (모달, 클릭) / GET 요청
// : /api/alerts/{alertId}
// useAppStore.js 의 fetchDetailAlert에 사용됨
export const fetchMonoAlertDetail = (alertId) =>
  axios.get(`/api/alerts/${alertId}`).then(getResponseData);

// 7. 창고 내부 위험 리포트 list / GET 요청
// : /api/warehouses/{warehouseId}/alerts
// useAppStore.js 의 fetchInitialData에 사용됨
export const fetchAlertsForWarehouse = (warehouseId) =>
  axios.get(`/api/warehouses/${warehouseId}/alerts`).then(getResponseData);

// 8. 전체 창고 위험 리포트 list / GET 요청
// : /api/alerts
export const fetchAlertsForWholeWarehouse = () =>
  axios.get('/api/alerts').then(getResponseData);

// 9. 창고 내부 로봇 list / GET 요청
// /api/warehouses/{warehouseId}/robots
export const fetchRobotList = (warehouseId) => {
  return axios
    .get(`/api/warehouses/${warehouseId}/robots`)
    .then(getResponseData);
};

// 10. 리포트 처리 등록 / POST 요청
// /api/alerts/{alertId}/processing
export const submitAlertReport = (alertId, reportData) => {
  // 이 예제에서는 POST를 사용하지만, 실제로는 등록(POST)과 수정(PATCH)을 구분해야 할 수 있습니다.
  return axios
    .post(`/api/alerts/${alertId}/processing`, reportData)
    .then(getResponseData);
};

// 11. 리포트 처리 수정 / PUT 요청
// /api/alerts/{alertId}/processing
export const updateAlertReport = (alertId, reportData) => {
  return axios
    .put(`/api/alerts/${alertId}/processing`, reportData)
    .then(getResponseData);
};

// 12.유저 로그인 / POST 요청
///api/admin/login
export const login = (username, password) => {
  return axios
    .post('/api/admin/login', { username, password }, { withCredentials: true })
    .then((response) => response.data);
};

// 13. 유저 로그아웃 / POST 요청
///api/admin/logout
export const logout = () => {
  return axios.post('/api/admin/logout', null, { withCredentials: true });
};

// 14. 서버 → 로봇 촬영 스팟 / MQTT 통신
// 서버 로봇간 통신

// 15. 로봇 → 서버 리포트 / MQTT 통신
// 서버 로봇간 통신

// 16. 로봇 → 서버 로봇의 실시간 위치 / MQTT 통신
// 서버 로봇간 통신

// 17. 서버 → 프론트 robot position / 웹소켓 통신

// 18. 서버 → 프론트 alert / 웹소켓 통신

// 19. 서버 → 프론트 맵 완성 알림 / 웹소켓 통신

// 20. 프론트 → 서버 로봇 명령 / POST 요청
// /api/warehouses/{warehouseId}/robots/{robotId}
export const sendMoveCommand = (warehouseId, robotId, spotId, commandId) => {
  const payload = {
    spotId: spotId,
    commandId: commandId,
  };
  // console.log(
  //   `[API] 로봇 이동 명령 전송 페이로드: ${JSON.stringify(payload)} warehouseId: ${warehouseId}`,
  // );

  return axios
    .post(`/api/warehouses/${warehouseId}/robots/${robotId}`, payload)
    .then(getResponseData);
};

// 번외. Fcm 토큰 저장
export const saveFcmToken = (token) => {
  return axios.post('/api/notification/token', token).then(getResponseData);
};
