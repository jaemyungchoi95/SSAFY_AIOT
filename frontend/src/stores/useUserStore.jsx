import { create } from 'zustand';
import { login } from '../api';
import { logout } from '../api';
import { useAppStore } from './useAppStore';

export const useUserStore = create((set) => ({
  // 1. 관리할 상태 (state)
  username: '',
  password: '',
  userId: null,
  name: null,
  isLoggedIn: false,
  error: null,

  // 2. 상태를 변경하는 함수 (actions)
  setUserName: (username) => {
    set({ username });
  },
  setPassword: (password) => {
    set({ password });
  },

  login: async () => {
    try {
      const { username, password } = useUserStore.getState();
      const res = await login(username, password);

      set({
        userId: res.userId,
        name: res.username,
        isLoggedIn: true,
        error: null,
      });
    } catch (error) {
      set({ error: '로그인 실패', isLoggedIn: false });
    }
  },

  logout: async () => {
    try {
      await logout();
      // User 스토어의 상태를 초기화합니다.
      set({
        username: '',
        password: '',
        userId: null,
        name: null,
        isLoggedIn: false,
        error: null,
      });

      // App 스토어의 상태도 함께 초기화합니다.
      useAppStore.getState().resetAppStore();
    } catch (error) {
      console.error('로그아웃 실패', error);
    }
  },
}));
