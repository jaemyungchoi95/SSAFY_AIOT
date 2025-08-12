import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const ALERT_DISPLAY_DURATION = 5000; // 원하는 시간으로 조정 가능

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
        // 동일한 alertId를 가진 기존 알림의 타임아웃이 있다면 클리어
        if (state._alertTimeouts[newAlert.alertId]) {
          clearTimeout(state._alertTimeouts[newAlert.alertId]);
          delete state._alertTimeouts[newAlert.alertId];
        }

        // 기존 알림들은 isNew를 false로 설정
        const updatedSocketAlerts = state.socketAlerts.map((alert) => ({
          ...alert,
          isNew: false,
        }));

        // 새 알림을 추가하고 isNew를 true로 설정, 고유 ID 부여 (alertId가 없거나 중복될 경우 대비)
        const newSocketAlerts = {
          ...newAlert,
          isNew: true,
          id: newAlert.alertId || Date.now(),
        };

        const timeoutId = setTimeout(() => {
          get().dismissAlert(newSocketAlerts.id);
        }, ALERT_DISPLAY_DURATION);

        return {
          socketAlerts: [...updatedSocketAlerts, newSocketAlerts],
          _alertTimeouts: {
            ...state._alertTimeouts,
            [newSocketAlerts.id]: timeoutId,
          },
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
    dismissAlert: (id) =>
      set((state) => {
        // 수동으로 닫을 경우 해당 알림의 타임아웃 클리어
        if (state._alertTimeouts[id]) {
          clearTimeout(state._alertTimeouts[id]);
          delete state._alertTimeouts[id];
        }
        return {
          socketAlerts: state.socketAlerts.filter((alert) => alert.id !== id),
        };
      }),

    // Map 알림 창닫기
    dismissMap: (id) =>
      set((state) => {
        // 수동으로 닫을 경우 해당 맵 알림의 타임아웃 클리어
        if (state._mapTimeouts[id]) {
          clearTimeout(state._mapTimeouts[id]);
          delete state._mapTimeouts[id];
        }
        return {
          socketMaps: state.socketMaps.filter((map) => map.id !== id),
        };
      }),
  })), // devtools
); // create
