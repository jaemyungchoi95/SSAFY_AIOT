import axios from 'axios';

// 로봇 이동명령 기능 확장에 대한 api 호출 함수
// 로봇 현재 위치 가져오기
export const getRobotPosition = (robotId) =>
  axios.get(`/api/robots/${robotId}/position`).then((res) => res.data.data);

// 로봇을 특정 위치로 이동시키는 명령
export const sendMoveCommand = (robotId, targetPosition) =>
  axios
    .post(`/api/robots/${robotId}/move`, targetPosition)
    .then((res) => res.data.data);
