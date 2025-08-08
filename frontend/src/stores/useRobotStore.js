import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useRobotStore = create(
  devtools((set) => ({
    // 상태
    robotPositions: {}, // 현재 로봇 위치 { "robot-1": { x, y, ... }, "robot-2": { ... } }
    moving: false, // 로봇 이동중 여부
    error: null,

    // 액션
    // 로봇 위치 받아오기
    setRobotPosition: (pos) => {
      if (!pos || !pos.robotId) return;
      set((state) => ({
        robotPositions: {
          ...state.robotPositions,
          [pos.robotId]: pos,
        },
      }));
    },

    // 로봇 위치 이동 명령
    // moveRobotTo: async (robotId, targetPosition) => {
    //   set({ moving: true });
    //   try {
    //     await api.sendMoveCommand(robotId, targetPosition);
    //     set({ moving: false });
    //     // 명령 후 위치 갱신
    //     get().fetchRobotPosition(robotId);
    //   } catch (err) {
    //     console.error('[ROBOT] 이동 명령 실패:', err);
    //     set({ error: err, moving: false });
    //   }
    // },

    // 상태 초기화
    resetRobotState: () => {
      set({ robotPositions: {}, moving: false, error: null });
    },
  })),
);
