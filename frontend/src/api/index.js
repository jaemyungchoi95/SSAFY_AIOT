import axios from 'axios';

const getResponseData = (res) => res.data.data;

// 1. 맵 / GET 요청
// : /api/warehouses/{warehouse_id}/map
export const fetchMapInfo = (warehouseId) =>
  axios.get(`/api/warehouses/${warehouseId}/map`).then(getResponseData);

// 2. 창고list / GET 요청
// : /api/warehouses
export const fetchWarehouses = () =>
  axios.get('/api/warehouses').then(getResponseData);

// 3. 맵, 랙, 촬영스팟 전송 / POST 요청
// : /api/robots/{robot_id}/full-map
// 이 항목은 백엔드-로봇간 통신

// 4. 랙 List / GET 요청
// : /api/warehouses/{warehouse_id}/racks
export const fetchRacks = (warehouseId) =>
  axios.get(`/api/warehouses/${warehouseId}/racks`).then(getResponseData);

// 5. 창고 내부 위험 리포트 (단일) → 실시간 알림시 가져오는 용 (리스트 추가) / GET 요청
// : /api/warehouses/{warehouseId}/alerts/{alertId}
export const fetchMonoAlert = (warehouseId, alertId) =>
  axios
    .get(`/api/warehouses/${warehouseId}/alerts/${alertId}`)
    .then(getResponseData);

// 6. 위험 리포트(단일) 디테일 (모달, 클릭) / GET 요청
// : /api/alerts/{alertId}
export const fetchMonoAlertDetail = (alertId) =>
  axios.get(`/api/alerts/${alertId}`).then(getResponseData);

// 7. 창고 내부 위험 리포트 list / GET 요청
// : /api/warehouses/{warehouseId}/alerts
export const fetchAlertsForWarehouse = (warehouseId) =>
  axios.get(`/api/warehouses/${warehouseId}/alerts`).then(getResponseData);

// 8. 전체 창고 위험 리포트 list / GET 요청
// : /api/alerts
export const fetchAlertsForWholeWarehouse = () =>
  axios.get('/api/alerts').then(getResponseData);

/** 알림 리포트를 제출(등록/수정)합니다. */
export const submitAlertReport = (alertId, reportData) => {
  // 이 예제에서는 POST를 사용하지만, 실제로는 등록(POST)과 수정(PATCH)을 구분해야 할 수 있습니다.
  return axios.post(`/api/alerts/${alertId}`, reportData).then(getResponseData);
};
