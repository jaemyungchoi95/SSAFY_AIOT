import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as api from '../api/index';

export const useAppStore = create(
  devtools((set, get) => ({
    // 상태(state) 정의
    imageUrl: null, // AWS S3에 있는 url 정보를 받아준다
    racks: [], // 전체 랙에 대한 상태를 관리한다
    spots: [], // 창고별 - 랙별의 촬영 스팟을 관리한다
    robots: [], // 창고별 - 로봇의 정보를 가진다.
    alerts: [], // 전체 리포트 알림에 대한 상태를 관리한다
    alertDetail: null, // 선택된 특정 리포트 알림에 대한 정보를 가진다
    warehouses: [], // 창고별 아이디와 이름 그리고 가지고 있는 지도에 대한 정보를 가진다
    selectedAlertId: null, // 현재 선택된 리포트 알림의 아이디를 관리한다
    selectedWarehouseId: null, // 현재 선택된 창고 아이디의 상태를 관리한다
    viewingImageUrl: null, // 현재 모달에서 보고 있는 이미지 URL, null이면 닫힌 상태
    // 'VIEW_DETAILS': 스팟 클릭 시 상세 정보 보기 (기본값)
    // 'COMMAND_ROBOT': 스팟 클릭 시 로봇 이동 명령 UI 활성화
    mapInteractionMode: 'VIEW_DETAILS',

    loading: false,
    error: null,

    // 액션 (Actions) 정의

    // 앱 초기화 액션
    initializeApp: async () => {
      try {
        // 1. 가장 먼저 전체 창고 목록을 가져옵니다.
        const warehouseRes = await api.fetchWarehouses();
        console.log('warehouseRes:', warehouseRes);

        if (Array.isArray(warehouseRes) && warehouseRes.length > 0) {
          const warehousesData = warehouseRes.map((w) => ({
            ...w,
            id: w.warehouseId,
          }));

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

    // Home 페이지의 데이터를 받아오는 액션
    fetchInitialData: async (warehouseId) => {
      set({
        loading: true,
        error: null,
        imageUrl: null,
        racks: [],
        spots: [],
        alerts: [],
        robots: [],
      });
      try {
        const [mapInfoRes, rackListRes, alertsRes, robotRes] =
          await Promise.all([
            api.fetchMapInfo(warehouseId), // 1번
            api.fetchRacks(warehouseId), // 3번
            api.fetchAlertsForWarehouse(warehouseId), // 7번
            api.fetchRobotList(warehouseId), // 9번
          ]);

        // 1. API에서 받아온 원본 데이터를 확인합니다.
        console.log('[STORE] API 원본 데이터:', {
          mapInfo: mapInfoRes,
          rackList: rackListRes,
          alerts: alertsRes,
          robots: robotRes,
        });

        const imageUrl = mapInfoRes.filePath;
        const rackList = rackListRes;
        const alertsData = alertsRes;
        const robotList = robotRes;

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
              danger: null,
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
            console.log('초기 로딩 데이터 - alertOnThisSpot:', alertOnThisSpot);

            return {
              ...spot,
              temperature: Number(alertOnThisSpot.temperature.toFixed(1)),
              status: alertOnThisSpot.status,
              danger: alertOnThisSpot.danger,
              alertId: alertOnThisSpot.alertId,
            };
          }
          return spot;
        });

        const processedAlerts = alertsData.content.map((alert) => ({
          ...alert,
          temperature: Number(alert.temperature.toFixed(1)),
        }));

        // 3. 최종적으로 상태에 저장될 데이터를 확인합니다.
        console.log('[STORE] 최종 상태 데이터 (set 직전):', {
          racks: processedRacks,
          spots: mergedSpots,
          alerts: processedAlerts,
        });

        set({
          imageUrl: imageUrl,
          racks: processedRacks,
          spots: mergedSpots,
          alerts: processedAlerts,
          robots: robotList,
          loading: false,
        });
      } catch (error) {
        console.error('[STORE] 데이터 로딩 실패! 오류 발생:', error);
        set({ error, loading: false });
      }
    }, // fetchInitialData 액션 끝

    // 새로운 위험 알림 데이터 수신에 대한 액션
    updateAlertDataFromSocket: (newAlert) => {
      const processedAlert = {
        ...newAlert,
        temperature: Number(newAlert.temperature.toFixed(1)),
      };

      const state = get();
      // 만약 지금 상세 정보를 보고 있고, 그 정보가 방금 들어온 알림과 동일한 것이라면
      if (state.alertDetail && state.alertDetail === processedAlert.alertId) {
        console.log(
          `[STORE] 현재 보고 있는 알림(${processedAlert.alertId})에 대한 업데이트 수신. 상세 정보를 다시 불러옵니다.`,
        );
        // 상세 정보를 다시 불러오는 액션을 호출합니다.
        state.fetchDetailAlert(processedAlert.alertId);
      }

      set((state) => ({
        spots: state.spots.map((spot) => {
          if (
            spot.rackId == processedAlert.rackId &&
            spot.spotId === processedAlert.spotId
          ) {
            return {
              ...spot,
              status: processedAlert.status,
              alertId: processedAlert.alertId,
              temperature: processedAlert.temperature,
            };
          }
          return spot;
        }),
        alerts: [
          processedAlert,
          ...state.alerts.filter(
            (alert) => alert.alertId !== processedAlert.alertId,
          ),
        ],
      }));
    },

    // 새로운 맵데이터 알림 수신에 대한 액션
    updateMapDataFromSocket: (newMapData) => {
      const currentWarehouseId = get().selectedWarehouseId;
      const currentImageUrl = get().imageUrl;
      const newImageUrl = newMapData.url;

      const newMapWarehouseId = newMapData.warehouseId;

      if (newMapWarehouseId !== currentWarehouseId) {
        console.log(`[STORE] 수신된 맵 데이터는 현재 선택된 창고(${currentWarehouseId})의 데이터가 아닙니다. (
       ${newMapWarehouseId})`);
        return;
      }

      if (currentImageUrl !== newImageUrl) {
        console.log(
          `[STORE] 새로운 맵 데이터 수신! URL 변경 감지: ${currentImageUrl} -> ${newImageUrl}`,
        );
        get().fetchInitialData(currentWarehouseId);
      } else {
        console.log(
          `[STORE] 수신된 맵 데이터는 기존 맵과 동일합니다. (${newImageUrl})`,
        );
      }
    },

    // 특정 이슈에 대한 상세정보를 가져옴
    fetchDetailAlert: async (alertId) => {
      if (!alertId) {
        // alertId가 null이면 상세 정보를 초기화합니다.
        set({ alertDetail: null, selectedAlertId: null, loading: false });
        return;
      }

      set({ loading: true, error: null, selectedAlertId: alertId });
      try {
        const alertDetailRes = await api.fetchMonoAlertDetail(alertId); // 5번
        console.log(
          `[DEBUG] 서버가 ID ${alertId}에 대해 응답한 데이터:`,
          alertDetailRes,
        );
        const processedAlertDetail = {
          ...alertDetailRes,
          temperature: Number(alertDetailRes.temperature.toFixed(1)),
        };

        set({
          alertDetail: processedAlertDetail,
          loading: false,
        });
      } catch (error) {
        set({ error, loading: false });
      }
    },

    // 등록에 대한 액션
    submitAlertReport: (alertId, reportData) => {
      const fullReportData = {
        ...reportData,
        itemType: get().reportItemName, // 상태에서 가져온 itemType 대응 필드
        updatedAt: new Date().toISOString(),
        // userId: get().userId, // 만약 userId 상태가 있다면 추가
        userId: 1,
      };

      set((state) => {
        const updatedAlerts = state.alerts.map((alert) => {
          if (alert.alertId === alertId) {
            return {
              ...alert,
              status: 'DONE',
              handlerName: fullReportData.handlerName,
              comment: fullReportData.comment,
              handledAt: fullReportData.updatedAt,
            };
          }
          return alert;
        });
        return { alerts: updatedAlerts };
      });
      api.submitAlertReport(alertId, fullReportData);
    }, // submitAlertReport 액션 끝

    updateAlertReport: (alertId, reportData) => {
      const fullReportData = {
        ...reportData,
        itemType: get().reportItemName, // 상태에서 가져온 itemType 대응 필드
        updatedAt: new Date().toISOString(),
        // userId: get().userId, // 만약 userId 상태가 있다면 추가
        userId: 1,
      };

      set((state) => {
        const updatedAlerts = state.alerts.map((alert) => {
          if (alert.alertId === alertId) {
            return {
              ...alert,
              status: 'DONE',
              handlerName: fullReportData.handlerName,
              comment: fullReportData.comment,
              handledAt: fullReportData.updatedAt,
            };
          }
          return alert;
        });
        return { alerts: updatedAlerts };
      });
      console.log('📦 fullReportData', fullReportData);

      api.updateAlertReport(alertId, fullReportData);
    }, // updateAlertReport 액션 끝

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
        const alertsContent = alertsData.content || [];

        const processedAlerts = alertsContent.map((alert) => ({
          ...alert,
          temperature: Number(alert.temperature.toFixed(1)),
        }));

        set({ alerts: processedAlerts || [] });
      } catch (error) {
        console.error('[STORE] 전체 창고 경고 리스트 로딩 실패:', error);
      }
    },

    // --- 아래 모달 관련 액션
    setViewingImageUrl: (url) => set({ viewingImageUrl: url }),
    clearViewingImageUrl: () => set({ viewingImageUrl: null }),

    // 로봇의 이동명령 모드에 대한 액션
    setMapInteractionMode: (mode) => set({ mapInteractionMode: mode }),

    // 로그아웃시 다시 초기상태로 appStore 데이터를 돌려놓는 액션
    resetAppStore: () => {
      set({
        selectedAlertId: null,
        alertDetail: null,
        isEditing: false,
        isWritingId: null,
      });
    },
  })),
);
