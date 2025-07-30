import { create } from 'zustand';

export const useUserStore = create((set) => ({
  // 1. 관리할 상태 (state)
  username: null,
  name: null,
  role: null,
  isLoggedIn: false,
  error: null,

  // 2. 상태를 변경하는 함수 (actions)
  login: async ({ username, name, role }) => {
    try {
      set({
        username,
        name,
        role,
        isLoggedIn: true,
        error: null,
      });
    } catch (error) {
      set({ error: '로그인에 실패하였습니다.' });
    }
  },

  logout: () => {
    set({
      username: null,
      name: null,
      role: null,
      isLoggedIn: false,
      error: null,
    });
  },
}));
