import { create } from "zustand"

export const useUserStore = create(set => ({
// 1. 관리할 상태 (state)
isLoggedIn: false,
user: null,

// 2. 상태를 변경하는 함수 (actions)
// 액션 함수들은 `set` 함수를 사용하여 상태를 업데이트합니다.
// `set` 함수는 기존 상태를 인자로 받아 새로운 상태를 반환하는 함수를 전달받습니다.

/**
 * 사용자를 로그인 처리하는 액션
 * @param {object} userData - 로그인할 사용자의 정보 (예: { name: '홍길동', email: 'hong@gildong.com' })
 */
    login: (userData) => set((state) => ({
        isLoggedIn: true,
        user: userData,
    })),

/**
 * 사용자를 로그아웃 처리하는 액션
 */
    logout: () => set((state) => ({
        isLoggedIn: false,
        user: null,
    })),
}));