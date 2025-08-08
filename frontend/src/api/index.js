import axios from 'axios';

const getResponseData = (res) => res.data.data;

// 1. 맵 / GET 요청
// : /api/warehouses/{warehouse_id}/map
// useAppStore.js 의 fetchInitialData에 사용됨
export const fetchMapInfo = (warehouseId) =>
  axios.get(`/api/warehouses/${warehouseId}/map`).then(getResponseData);

// 2. 창고list / GET 요청
// : /api/warehouses
// useAppStore.js 의 initializeApp에 사용됨
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

// 9. 빈칸
// 10. 창고 내부 로봇 list
// 빈칸

// 11. 리포트 처리 등록 / POST 요청
// /api/alerts/{alertId}/processing
export const submitAlertReport = (alertId, reportData) => {
  // 이 예제에서는 POST를 사용하지만, 실제로는 등록(POST)과 수정(PATCH)을 구분해야 할 수 있습니다.
  return axios
    .post(`/api/alerts/${alertId}/processing`, reportData)
    .then(getResponseData);
};

// 12. 리포트 처리 수정 / PUT 요청
// /api/alerts/{alertId}/processing
export const updateAlertReport = (alertId, reportData) => {
  return axios
    .put(`/api/alerts/${alertId}/processing`, reportData)
    .then(getResponseData);
};
