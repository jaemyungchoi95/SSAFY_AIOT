import { create } from 'zustand';

// 1. 필터들의 초기 상태를 객체로 정의합니다.
const initialState = {
  selectedTime: '최신순',
  selectedDay: '전체',
  selectedStatus: '전체',
};

export const useFilterStore = create((set) => ({
  // 2. 초기 상태를 spread 문법으로 가져옵니다.
  ...initialState,

  // 필터 상태변경 액션
  setSelectedTime: (time) => set({ selectedTime: time }),
  setSelectedDay: (day) => set({ selectedDay: day }),
  setSelectedStatus: (status) => set({ selectedStatus: status }),

  resetFilters: () => set(initialState),
}));
