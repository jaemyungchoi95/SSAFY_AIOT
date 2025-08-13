import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const ALERT_DISPLAY_DURATION = 5000; // 원하는 시간으로 조정 가능
const MAX_ALERTS = 5; // 최대 알림 개수

export const useAlertStore = create(
  devtools((set, get) => ({
    // 1. 상태 정의
    socketAlerts: [],
    socketMaps: [],
    _alertTimeouts: {}, // 알림의 setTimeout ID를 저장
    _mapTimeouts: {}, // 맵 알림의 setTimeout ID를 저장

    // 2. 액션 정의
    // 특이사항 발견시 알림 업데이트
    addSocketAlert: (newAlert) =>
      set((state) => {
        const newTimeouts = { ...state._alertTimeouts };

        // 만약 동일한 ID의 알림이 이미 있다면, 기존 타임아웃을 취소
        if (newTimeouts[newAlert.alertId]) {
          clearTimeout(newTimeouts[newAlert.alertId]);
        }

        // 새 알림을 배열의 맨 앞에 추가하고, 기존에 있던 동일 ID의 알림은 필터링하여 제거
        const currentAlerts = [
          newAlert,
          ...state.socketAlerts.filter((a) => a.alertId !== newAlert.alertId),
        ];

        // 최대 개수(5개)를 넘는 알림은 잘라냄
        const alertsToKeep = currentAlerts.slice(0, MAX_ALERTS);
        const alertsToRemove = currentAlerts.slice(MAX_ALERTS);

        // 잘려나간 알림들의 타임아웃을 메모리에서 정리
        alertsToRemove.forEach((alert) => {
          if (newTimeouts[alert.alertId]) {
            clearTimeout(newTimeouts[alert.alertId]);
            delete newTimeouts[alert.alertId];
          }
        });

        // 새 알림에 대한 자동 닫기 타임아웃 설정
        const timeoutId = setTimeout(() => {
          get().dismissAlert(newAlert.alertId);
        }, ALERT_DISPLAY_DURATION);
        newTimeouts[newAlert.alertId] = timeoutId;

        return {
          socketAlerts: alertsToKeep,
          _alertTimeouts: newTimeouts,
        };
      }),

    // Map 생성 완료시 알림 업데이트
    addSocketMap: (newMap) =>
      set((state) => {
        if (state._mapTimeouts[newMap.warehouseId]) {
          clearTimeout(state._mapTimeouts[newMap.warehouseId]);
          delete state._mapTimeouts[newMap.warehouseId];
        }

        // 새 맵 알림 추가, 고유 ID 부여 (warehouseId가 없거나 중복될 경우 대비)
        const updateSocketMaps = {
          ...newMap,
          id: newMap.warehouseId || Date.now(),
        };

        const timeoutId = setTimeout(() => {
          get().dismissMap(updateSocketMaps.id);
        }, ALERT_DISPLAY_DURATION);

        return {
          socketMaps: [...state.socketMaps, updateSocketMaps],
          _mapTimeouts: {
            ...state._mapTimeouts,
            [updateSocketMaps.id]: timeoutId,
          },
        };
      }),

    // 소켓 알림 창닫기
    dismissAlert: (alertId) =>
      set((state) => {
        // 상태를 직접 바꾸지 않고, 복사본을 만들어 작업
        const newTimeouts = { ...state._alertTimeouts };

        // 복사된 객체에서 타임아웃을 찾아 제거
        if (newTimeouts[alertId]) {
          clearTimeout(newTimeouts[alertId]);
          delete newTimeouts[alertId];
        }
        return {
          socketAlerts: state.socketAlerts.filter(
            (alert) => alert.alertId !== alertId,
          ),
          // 수정된 타임아웃 객체를 반환하여 상태를 업데이트
          _alertTimeouts: newTimeouts,
        };
      }),

    // Map 알림 창닫기
    dismissMap: (id) =>
      set((state) => {
        // 상태를 직접 바꾸지 않고, 복사본을 만들어 작업
        const newTimeouts = { ...state._mapTimeouts };

        // 복사된 객체에서 타임아웃을 찾아 제거
        if (newTimeouts[id]) {
          clearTimeout(newTimeouts[id]);
          delete newTimeouts[id];
        }
        return {
          socketMaps: state.socketMaps.filter((map) => map.id !== id),
          _mapTimeouts: newTimeouts,
        };
      }),
  })), // devtools
); // create
