import { create } from 'zustand';

export const useFilterStore = create((set) => ({
  selectedTime: '전체',
  setSelectedTime: (time) => set({ selectedTime: time }),

  selectedDay: '전체',
  setSelectedDay: (day) => set({ selectedDay: day }),

  selectedStatus: '전체',
  setSelectedStatus: (status) => set({ selectedStatus: status }),
}));
