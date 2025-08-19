import { http, HttpResponse } from 'msw';
import {
  warehouseMapMockData,
  warehouseMockData,
  rackList,
  alertMonoMockData,
  alertMonoDetailMockData,
  monoWarehouseAlertListMockData,
  wholeWarehouseAlertListMockData,
} from './data';

export const handlers = [
  // 1. 맵 정보 API 핸들러
  http.get('/api/warehouses/:warehouseId/map', ({ params }) => {
    const warehouseId = parseInt(params.warehouseId, 10);
    const mapData = warehouseMapMockData.find(
      (m) => m.warehouseId === warehouseId,
    );

    return HttpResponse.json({
      success: true,
      message: '요청 성공',
      data: mapData,
    });
  }),

  // 2. 창고list API 핸들러 / 백엔드 API 테스트 완료
  http.get('/api/warehouses', () => {
    return HttpResponse.json({
      success: true,
      message: '요청 성공',
      data: warehouseMockData,
    });
  }),

  // 3. 랙 List API 핸들러 / 백엔드 API 테스트 완료
  http.get('/api/warehouses/:warehouseId/racks', async ({ params }) => {
    const warehouseId = parseInt(params.warehouseId, 10);

    const filterRacks = rackList.filter(
      (rack) => rack.warehouseId === warehouseId,
    );

    return HttpResponse.json({
      success: true,
      message: '요청 성공',
      data: filterRacks,
    });
  }),

  // 5. 창고 내부 위험 리포트 (단일) → 실시간 알림시 가져오는 API 핸들러
  http.get('/api/warehouses/:warehouseId/alerts/:alertId', ({ params }) => {
    const warehouseId = parseInt(params.warehouseId, 10);
    const alertId = parseInt(params.alertId, 10);
    const alert = alertMonoMockData.find(
      (a) => a.warehouseId === warehouseId && a.alertId === alertId,
    );
    return HttpResponse.json({ success: true, message: '성공', data: alert });
  }),

  // 6. 위험 리포트(단일) 디테일 (모달, 클릭) API 핸들러 / 백엔드 API 테스트 완료
  http.get('/api/alerts/:alertId', ({ params }) => {
    const alertId = parseInt(params.alertId, 10);

    if (alertId === alertMonoDetailMockData.alertId) {
      console.log(`[MSW] ID ${alertId}: 특별 케이스 상세 데이터를 반환합니다.`);
      return HttpResponse.json({
        success: true,
        message: '요청 성공',
        data: alertMonoDetailMockData,
      });
    }

    const foundAlertInList = monoWarehouseAlertListMockData.content.find(
      (a) => a.alertId === alertId,
    );

    if (!foundAlertInList) {
      return new HttpResponse(
        JSON.stringify({
          success: false,
          message: '해당 ID의 알림을 찾을 수 없습니다',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return HttpResponse.json({
      success: true,
      message: '요청 성공',
      data: foundAlertInList,
    });
  }),

  // 7. 창고 내부 위험 리포트 list API 핸들러 / 백엔드 API 테스트 완료
  http.get('/api/warehouses/:warehouseId/alerts', ({ params }) => {
    const warehouseId = parseInt(params.warehouseId, 10);
    const filteredContent = monoWarehouseAlertListMockData.content.filter(
      (alert) => alert.warehouseId === warehouseId,
    );
    const responseData = {
      ...monoWarehouseAlertListMockData,
      content: filteredContent,
    };
    return HttpResponse.json({
      success: true,
      message: '요청 성공',
      data: responseData,
    });
  }),

  // // 8. 전체 창고 위험 리포트 list API 핸들러 / 백엔드 API 테스트 완료
  http.get('/api/alerts', () => {
    return HttpResponse.json({
      success: true,
      message: '요청 성공',
      data: wholeWarehouseAlertListMockData,
    });
  }),

  // 전송 요청 1. 알림 리포트를 제출(등록/수정)합니다.
  http.post('/api/alerts/:alertId', async ({ request, params }) => {
    const alertId = parseInt(params.alertId, 10);
    const reportData = await request.json();

    let updatedAlert = null;

    const updateInList = (list) => {
      const alertIndex = list.findIndex((a) => a.alertId === alertId);
      if (alertIndex !== -1) {
        const originalAlert = list[alertIndex];
        const newAlertData = {
          ...originalAlert,
          ...reportData,
          status: 'DONE',
          updatedAt: new Date()
            .toISOString()
            .replace('T', ' ')
            .substring(0, 19),
        };
        list[alertIndex] = newAlertData;
        updatedAlert = newAlertData;
        return true;
      }
      return false;
    };
    updateInList(wholeWarehouseAlertListMockData.content);
    updateInList(monoWarehouseAlertListMockData.content);

    if (updatedAlert) {
      return HttpResponse.json({
        success: true,
        message: '리포트가 성공적으로 제출되었습니다.',
        data: updatedAlert,
      });
    } else {
      return new HttpResponse(
        JSON.stringify({
          success: false,
          message: '해당 ID의 알림을 찾을 수 없습니다.',
          data: null,
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  }),

  // 시연용 맵 핸들러
  http.get('/my_world.pgm', async () => {
    try {
      const response = await fetch('/mock_my_world.pgm');
      if (!response.ok) throw new Error('File not found: /mock_my_world.pgm');
      const imageBuffer = await response.arrayBuffer();
      return new HttpResponse(imageBuffer, {
        headers: { 'Content-Type': 'image/x-portable-graymap' },
      });
    } catch (error) {
      console.error('MSW PGM handler error:', error);
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
    }
  }),

  // 시험 개발용 맵 핸들러
  http.get('/JSI_SLAM_map.pgm', async () => {
    try {
      const response = await fetch('/mock_JSI_SLAM_map.pgm');
      if (!response.ok)
        throw new Error('File not found: /mock_JSI_SLAM_map.pgm');
      const imageBuffer = await response.arrayBuffer();
      return new HttpResponse(imageBuffer, {
        headers: { 'Content-Type': 'image/x-portable-graymap' },
      });
    } catch (error) {
      console.error('MSW PGM handler error:', error);
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
    }
  }),
];
