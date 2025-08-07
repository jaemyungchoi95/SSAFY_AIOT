import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as api from '../api/index';

export const useAppStore = create(
  devtools((set, get) => ({
    // 상태(state) 정의
    imageUrl: null, // AWS S3에 있는 url 정보를 받아준다
    racks: [], // 전체 랙에 대한 상태를 관리한다
    spots: [], // 창고별 - 랙별의 촬영 스팟을 관리한다
    alerts: [], // 전체 리포트 알림에 대한 상태를 관리한다
    alertDetail: null, // 선택된 특정 리포트 알림에 대한 정보를 가진다
    // gemini question : 왜 alertDetail 초기 상태를 배열이 아닌 null로 가져가는지?
    // 혹시 아직 선택되지 않았을 때 빈 배열인 상태면 문제가 되는 부분이 있는건지?
    // 만약 typescript라면 타입이 고정되어있을텐데 그런 관점에서 고려했을때는?

    warehouses: [], // 창고별 아이디와 이름 그리고 가지고 있는 지도에 대한 정보를 가진다
    selectedAlertId: null, // 현재 선택된 리포트 알림의 아이디를 관리한다
    selectedWarehouseId: null, // 현재 선택된 창고 아이디의 상태를 관리한다
    loading: false,
    error: null,

    // 액션 (Actions) 정의

    // 앱 초기화 액션
    initializeApp: async () => {
      try {
        // 1. 가장 먼저 전체 창고 목록을 가져옵니다.
        const warehouseRes = await api.fetchWarehouses();
        const warehousesData = warehouseRes.map((w) => ({
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
    }, // initializeApp 액션 끝

    // 특정 이슈에 대한 상세정보를 가져옴
    fetchDetailAlert: async (alertId) => {
      set({ loading: true, error: null, selectedAlertId: alertId });
      try {
        const alertDetailRes = await api.fetchMonoAlertDetail(alertId); // 5번
        set({
          alertDetail: alertDetailRes,
          loading: false,
        });
      } catch (error) {
        set({ error, loading: false });
      }
    },

    // Home 페이지의 데이터를 받아오는 액션
    fetchInitialData: async (warehouseId) => {
      set({ loading: true, error: null });
      try {
        const [mapInfoRes, rackListRes, alertsRes] = await Promise.all([
          api.fetchMapInfo(warehouseId), // 1번
          api.fetchRacks(warehouseId), // 3번
          api.fetchAlertsForWarehouse(warehouseId), // 7번
        ]);

        // 1. API에서 받아온 원본 데이터를 확인합니다.
        console.log('[STORE] API 원본 데이터:', {
          mapInfo: mapInfoRes,
          rackList: rackListRes,
          alerts: alertsRes,
        });

        const imageUrl = mapInfoRes.filePath;
        const rackList = rackListRes;
        const alertsData = alertsRes;
        console.log('alertsData : ', alertsData);

        // rackList나 issuesData가 비어있는지 확인합니다.
        if (!rackList || rackList.length === 0) {
          console.warn('[STORE] rackList 데이터가 비어있습니다!');
        }
        if (!alertsData || alertsData.length === 0) {
          console.warn('[STORE] alertsData(alerts) 데이터가 비어있습니다!');
        }

        const allSpots = [];
        const processedRacks = rackList.map((rack) => {
          rack.spotList.forEach((spot) => {
            allSpots.push({
              ...spot,
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
          const alertOnThisSpot = alertsData.content.find(
            (alert) =>
              alert.rackId === spot.rackId && alert.spotId === spot.spotId,
          );
          if (alertOnThisSpot) {
            return {
              ...spot,
              status: alertOnThisSpot.status,
              alertId: alertOnThisSpot.alertId,
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
          alerts: alertsData.content,
          loading: false,
        });
      } catch (error) {
        console.error('[STORE] 데이터 로딩 실패! 오류 발생:', error);
        set({ error, loading: false });
      }
    }, // fetchInitialData 액션 끝

    // 등록/수정에 대한 액션
    submitAlertReport: (alertId, reportData) => {
      // MSW/API에 실제로 데이터를 전송하는 로직 (나중에 추가 가능)
      // axios.post(`/api/alerts/${alertId}/report`, reportData);
      set((state) => {
        const updatedAlerts = state.alerts.map((alert) => {
          if (alert.alertId === alertId) {
            return {
              ...alert,
              status: 'DONE',
              handlerName: reportData.handlerName,
              comment: reportData.comment,
              handledAt: new Date().toISOString(),
            };
          }
          return alert;
        });
        return { alerts: updatedAlerts };
      });
    }, // submitAlertReport 액션 끝

    // 특정 마커를 선택 혹은 선택 해지
    setSelectedAlertId: (alertId) => {
      set({ selectedAlertId: alertId });
    },
    // 창고 선택
    setSelectedWarehouseId: (warehouseId) => {
      set({ selectedWarehouseId: warehouseId });
      get().fetchInitialData(warehouseId);
    },

    // 키워드 검색
    searchKeyword: '',
    setSearchKeyword: (keyword) => {
      set({ searchKeyword: keyword });
    },

    //위험 필터
    showDangerOnly: false,
    setShowDangerOnly: (value) => set({ showDangerOnly: value }),

    //이슈페이지 버튼 필터
    selectedStatusFilter: '전체',
    setSelectedStatusFilter: (value) => set({ selectedStatusFilter: value }),

    //편집
    isEditing: false,
    setIsEditing: (value) => set({ isEditing: value }),

    //글쓰기
    isWritingId: null,
    setIsWritingId: (value) => set({ isWritingId: value }),

    //리포트 작성관련
    reportHandlerName: '',
    reportComment: '',
    reportItemName: '',

    setReportHandlerName: (name) => set({ reportHandlerName: name }),
    setReportComment: (comment) => set({ reportComment: comment }),
    setReportItemName: (itemType) => set({ reportItemName: itemType }),
    resetReportFields: () => set({ reportHandlerName: '', reportComment: '' }),

    //전체 alert 들고오기
    fetchWholeWarehouseAlerts: async () => {
      try {
        const alertsData = await api.fetchAlertsForWholeWarehouse();
        set({ alerts: alertsData.content || [] });
      } catch (error) {
        console.error('[STORE] 전체 창고 경고 리스트 로딩 실패:', error);
      }
    },
  })),
);
