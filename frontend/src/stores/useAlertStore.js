import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useAlertStore = create(
  devtools((set, get) => ({
    // 1. 상태 정의
    socketAlerts: [],

    // 2. 액션 정의
    addSocketAlert: (newAlert) =>
      set((state) => {
        // 기존 알림들은 isNew를 false로 설정
        const updatedSocketAlerts = state.socketAlerts.map((alert) => ({
          ...alert,
          isNew: false,
        }));

        // 새 알림을 추가하고 isNew를 true로 설정
        const newSocketAlerts = { ...newAlert, isNew: true };

        return {
          socketAlerts: [...updatedSocketAlerts, newSocketAlerts],
        };
      }),

    dismissAlert: (alertId) =>
      set((state) => ({
        socketAlerts: state.socketAlerts.filter(
          (alert) => alert.alertId !== alertId,
        ),
      })),
  })), // devtools
); // create
