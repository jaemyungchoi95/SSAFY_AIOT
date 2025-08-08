import { create } from 'zustand';

const initialState = {
  selectedTime: '최신순',
  selectedDay: '전체',
  selectedDayRange: null,
  selectedStatus: '전체',
};

export const useFilterStore = create((set) => ({
  ...initialState,

  setSelectedTime: (time) => set({ selectedTime: time }),
  setSelectedDay: (day) => {
    const now = new Date();
    let range = null;
    if (day === '하루') range = new Date(now.setDate(now.getDate() - 1));
    else if (day === '일주일') range = new Date(now.setDate(now.getDate() - 7));
    else if (day === '한달') range = new Date(now.setMonth(now.getMonth() - 1));

    set({ selectedDay: day, selectedDayRange: range });
  },
  setSelectedStatus: (status) => set({ selectedStatus: status }),

  resetFilters: () => set(initialState),
}));
