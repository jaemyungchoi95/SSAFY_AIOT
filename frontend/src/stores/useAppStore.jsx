import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';

export const useAppStore = create(
  devtools((set) => ({
    // 상태(state) 정의
    imgUrl: null,
    racks: [],
    spots: [],
    issues: [],
    reports: [],
    warehouses: [],
    selectedIssueId: null,
    selectedWarehouseId: 1,
    loading: false,
    error: null,

    // 액션 (Actions) 정의
    fetchInitialData: async () => {
      set({ loading: true, error: null });
      try {
        const [mapRes, issueRes, reportRes, warehouseRes] = await Promise.all([
          axios.get('/api/map/rackList'),
          axios.get('/api/alerts'),
          axios.get('/api/reports'),
          axios.get('/api/warehouses'),
        ]);

        const { url, rackList } = mapRes.data;
        const allSpots = [];
        const processedRacks = rackList.map((rack, rackIdx) => {
          const rackId = rackIdx + 1;
          rack.spotList.forEach((spot) => {
            allSpots.push({
              ...spot,
              spot_id: allSpots.length + 1,
              rack_id: rackId,
              status: 'normal',
            });
          });
          return { ...rack, rack_id: rackId };
        });

        // 2. 이슈 데이터를 기반으로 spots의 상태를 업데이트(병합)합니다.
        const issuesData = issueRes.data;
        const mergedSpots = allSpots.map((spot) => {
          const issueOnThisSpot = issuesData.find((issue) => {
            const isRackMatch = issue.rack_id === spot.rack_id;
            const isXMatch = issue.x === spot.x;
            const isYMatch = issue.y === spot.y;

            return isRackMatch && isXMatch && isYMatch;
          });
          if (issueOnThisSpot) {
            return {
              ...spot,
              status: issueOnThisSpot.status,
              issue_id: issueOnThisSpot.id,
            };
          }
          return spot;
        });
        set({
          imageUrl: url,
          racks: processedRacks,
          spots: mergedSpots,
          issues: issuesData,
          reports: reportRes.data,
          warehouses: warehouseRes.data,
          loading: false,
        });
      } catch (error) {
        console.error('[STORE] 데이터 로딩 실패! 오류 발생:', error);
        set({ error, loading: false });
      }
    },

    // 특정 마커를 선택 혹은 선택 해지
    setSelectedIssueId: (issueId) => {
      console.log('setSelectedIssueId: (issueId)', issueId);
      set({ selectedIssueId: issueId });
    },
    // 창고 선택
    setSelectedWarehouseId: (id) => {
      console.log('setSelectedWarehouseId: (id)', id);
      set({ selectedWarehouseId: id });
    },
  })),
);
