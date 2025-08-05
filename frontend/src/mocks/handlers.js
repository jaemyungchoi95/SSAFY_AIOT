import { http, HttpResponse } from 'msw';
import {
  warehouseMapMockData,
  warehouseMockData,
  rackList,
  alertMonoMockData,
} from './data';

export const handlers = [
  // 1. 맵 정보 API 핸들러
  http.get('/api/warehouses/:warehouseId/map', ({ params }) => {
    const { warehouseId } = params;

    const mapFilePath =
      warehouseId === '2' ? '/JSI_SLAM_map.pgm' : '/my_world.pgm';

    // const response = await fetch(
    //   'https://are-you-hot.s3.ap-northeast-2.amazonaws.com/maps/JSI_SLAM_map.pgm',
    // );

    return HttpResponse.json({
      success: true,
      message: '요청 성공',
      data: {
        mapId: warehouseId === '2' ? 99 : 6, // 임의의 mapId
        warehouseId: parseInt(warehouseId, 10),
        filePath: mapFilePath,
      },
    });
  }),

  // 2. 창고list api : /api/warehouses
  // warehouses 데이터를 보내주는 API 핸들러
  http.get('/api/warehouses', async () => {
    return HttpResponse.json({
      success: true,
      message: '요청 성공',
      data: warehouseMockData,
    });
  }),

  // 3. 랙 리스트 API 핸들러
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

  // 4. alerts 데이터를 보내주는 API 핸들러
  http.get('/api/warehouses/:warehouseId/alerts', ({ params }) => {
    const warehouseId = parseInt(params.warehouseId, 10);

    // 전체 alertMonoMockData 배열에서 요청된 warehouseId와 일치하는 데이터만 필터링합니다.
    const filteredAlerts = alertMonoMockData.filter(
      (alert) => alert.warehouseId === warehouseId,
    );

    return HttpResponse.json({
      success: true,
      message: '요청 성공',
      data: filteredAlerts,
    });
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
