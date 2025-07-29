import { create } from 'zustand';
import axios from 'axios';
import { devtools } from 'zustand/middleware';

export const useMapStore = create(
  devtools((set) => ({
    // 상태(state) 정의
    markers: [],
    selectedMarkerId: null,
    loading: false,
    error: null,

    // 액션 (Actions) 정의
    fetchMarkers: async () => {
      // fetcMarkers 함수가 호출되면 loading을 true로 바꿔주어 store의 상태변화를 유발
      set({ loading: true, error: null });
      try {
        const response = await axios.get('/api/map/markers');
        // api 호출이 성공하면 markers에 결과 데이터를 담고 다시 loading 을 false로 전환한다
        set({ markers: response.data, loading: false });
      } catch (error) {
        set({ error, loading: false });
      }
    },

    // 특정 마커를 선택 혹은 선택 해지
    setSelectedMarkerId: (id) => {
      set({ selectedMarkerId: id });
    },
  })),
);
