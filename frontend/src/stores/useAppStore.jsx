import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';

export const useAppStore = create(
  devtools((set, get) => ({
    // 상태(state) 정의
    imageUrl: null,
    racks: [],
    spots: [],
    issues: [],
    reports: [],
    warehouses: [],
    selectedIssueId: null,
    selectedWarehouseId: null,
    loading: false,
    error: null,

    // 앱 초기화
    initializeApp: async () => {
      try {
        // 1. 가장 먼저 전체 창고 목록을 가져옵니다.
        const warehouseRes = await axios.get('/api/warehouses');
        const warehousesData = warehouseRes.data.data.map((w) => ({
          ...w,
          id: w.warehouseId,
        }));

        if (warehousesData.length > 0) {
          // 2. 창고 목록이 있으면, 첫 번째 창고의 ID를 기본 ID로 설정합니다.
          const defaultWarehouseId = warehousesData[0].id;
          set({
            warehouses: warehousesData,
            selectedWarehouseId: defaultWarehouseId,
          });

          // 3. 이제 그 기본 ID를 가지고 나머지 데이터를 불러옵니다.
          await get().fetchInitialData(defaultWarehouseId);
        } else {
          // 창고가 하나도 없을 경우의 처리
          set({ loading: false, error: '사용 가능한 창고가 없습니다.' });
        }
      } catch (error) {
        console.error('[STORE] 앱 초기화 실패!', error);
        set({ error, loading: false });
      }
    },
    // 액션 (Actions) 정의
    fetchInitialData: async (warehouseId) => {
      set({ loading: true, error: null });
      try {
        const [mapInfoRes, rackListRes, issueRes, reportRes] =
          await Promise.all([
            axios.get(`/api/warehouses/${warehouseId}/map`),
            axios.get(`/api/warehouses/${warehouseId}/racks`),
            axios.get(`/api/alerts?warehouseId=${warehouseId}`),
            axios.get(`/api/reports?warehouseId=${warehouseId}`),
          ]);

        // 1. API에서 받아온 원본 데이터를 확인합니다.
        console.log('[STORE] API 원본 데이터:', {
          mapInfo: mapInfoRes.data.data,
          rackList: rackListRes.data.data,
          issues: issueRes.data.data,
          reports: reportRes.data.data,
        });

        const imageUrl = mapInfoRes.data.data.filePath;
        const rackList = rackListRes.data.data;
        const issuesData = issueRes.data.data;
        const reportsData = reportRes.data.data;

        // rackList나 issuesData가 비어있는지 확인합니다.
        if (!rackList || rackList.length === 0) {
          console.warn('[STORE] rackList 데이터가 비어있습니다!');
        }
        if (!issuesData || issuesData.length === 0) {
          console.warn('[STORE] issuesData(alerts) 데이터가 비어있습니다!');
        }

        const allSpots = [];
        const processedRacks = rackList.map((rack) => {
          rack.spotList.forEach((spot) => {
            allSpots.push({
              ...spot,
              // spotId: spot.spotId,
              rackId: rack.rackId,
              status: 'normal',
            });
          });
          // return { ...rack, rack_id: rack.rackId };
          return rack;
        });

        // 2. 랙과 스팟 정보가 잘 가공되었는지 확인합니다.
        console.log('[STORE] 가공된 데이터:', {
          processedRacks,
          allSpots,
        });

        // 2. 이슈 데이터를 기반으로 spots의 상태를 업데이트(병합)합니다.
        const mergedSpots = allSpots.map((spot) => {
          const issueOnThisSpot = issuesData.find(
            (issue) =>
              issue.rackId === spot.rackId && issue.spotId === spot.spotId,
          );
          if (issueOnThisSpot) {
            return {
              ...spot,
              status: issueOnThisSpot.status,
              issueId: issueOnThisSpot.alertId,
            };
          }
          return spot;
        });

        // 3. 최종적으로 상태에 저장될 데이터를 확인합니다.
        console.log('[STORE] 최종 상태 데이터 (set 직전):', {
          racks: processedRacks,
          spots: mergedSpots,
        });

        set({
          imageUrl: imageUrl,
          racks: processedRacks,
          spots: mergedSpots,
          issues: issuesData,
          reports: reportsData,
          loading: false,
        });
      } catch (error) {
        console.error('[STORE] 데이터 로딩 실패! 오류 발생:', error);
        set({ error, loading: false });
      }
    },

    // 특정 마커를 선택 혹은 선택 해지
    setSelectedIssueId: (issueId) => {
      set({ selectedIssueId: issueId });
    },
    // 창고 선택
    setSelectedWarehouseId: (id) => {
      set({ selectedWarehouseId: id });
      get().fetchInitialData(id);
    },
  })),
);
