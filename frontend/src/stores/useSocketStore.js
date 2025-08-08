import { create } from 'zustand';

export const useSocketStore = create((set) => ({
  client: null,
  isConnected: false,

  // 액션
  // 클라이언트 인스턴스 저장
  setClient: (client) => set({ client }),

  // 연결상태 변경
  setConnected: (status) => set({ isConnected: status }),
}));
