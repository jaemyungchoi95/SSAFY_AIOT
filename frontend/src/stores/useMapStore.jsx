import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';

export const useMapStore = create(
  devtools((set) => ({
    // 상태(state) 정의
    imgUrl: null,
    racks: [],
    spots: [],
    selectedSpotId: null,
    loading: false,
    error: null,

    // 액션 (Actions) 정의
    fetchMapData: async () => {
      set({ loading: true, error: null });
      try {
        const response = await axios.get('/api/map/rackList');
        const { url, rackList } = response.data;

        const allSpots = [];
        const processRacks = rackList.map((rack, rackIdx) => {
          const rackId = rackIdx + 1;

          const enrichedSpots = rack.spotList.map((spot, spotIdx) => {
            const spotId = allSpots.length + 1; // 전체 고유 ID
            const spotWithMeta = {
              ...spot,
              spot_id: spotId,
              rack_id: rackId,
              status: 'normal', // 기본값
            };
            allSpots.push(spotWithMeta);
            return spotWithMeta;
          });

          return {
            ...rack,
            rack_id: rackId,
            center_x: rack.centerX,
            center_y: rack.centerY,
            spotList: enrichedSpots,
          };
        });
        set({
          imageUrl: url,
          racks: processRacks,
          spots: allSpots,
          loading: false,
        });
      } catch (error) {
        set({ error, loading: false });
      }
    },

    // 특정 마커를 선택 혹은 선택 해지
    setSelectedSpotId: (spot_id) => {
      set({ selectedSpotId: spot_id });
    },
  })),
);
