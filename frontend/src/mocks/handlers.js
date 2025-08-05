import { http, HttpResponse } from 'msw';
import { alertMockData, warehouseMockData } from './data';

export const handlers = [
  // // 1. my_map.yaml 파일을 반환하는 API 핸들러
  // // GET /api/map/metadata 요청을 가로챕니다.
  // http.get('/api/map/metadata', async () => {
  //   // public 폴더의 my_map.yaml 파일을 fetch로 읽어옵니다.
  //   const response = await fetch('/my_map.yaml');
  //   const yamlText = await response.text();

  //   // 읽어온 텍스트를 응답으로 보냅니다.
  //   return HttpResponse.text(yamlText, {
  //     headers: {
  //       'Content-Type': 'text/yaml',
  //     },
  //   });
  // }),

  // 2. 맵 정보 API 핸들러
  // GET /api/map/image 요청을 가로챕니다.
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

  // 3. 랙 리스트 API 핸들러
  http.get('/api/warehouses/:warehouseId/racks', async ({ params }) => {
    const { warehouseId } = params;

    const rackListPath =
      warehouseId === '2' ? '/rackList.json' : '/rackList2.json';

    try {
      const response = await fetch(rackListPath);

      if (!response.ok) {
        throw new Error(`데이터를 가져오는데 실패하였습니다 ${rackListPath}`);
      }
      const rackListData = await response.json();
      return HttpResponse.json({
        success: true,
        message: '요청 성공',
        data: rackListData.data,
      });
    } catch (error) {
      return new HttpResponse(null, { status: 500, statusText: error.message });
    }
  }),

  // 4. alerts 데이터를 보내주는 API 핸들러
  http.get('/api/warehouses/:warehouseId/alerts', ({ params }) => {
    const warehouseId = parseInt(params.warehouseId, 10);

    // 전체 alertMockData 배열에서 요청된 warehouseId와 일치하는 데이터만 필터링합니다.
    const filteredAlerts = alertMockData.filter(
      (alert) => alert.warehouseId === warehouseId,
    );

    return HttpResponse.json({
      success: true,
      message: '요청 성공',
      data: filteredAlerts,
    });
  }),

  // 5. warehouses 데이터를 보내주는 API 핸들러
  http.get('/api/warehouses', async () => {
    return HttpResponse.json({
      success: true,
      message: '요청 성공',
      data: warehouseMockData,
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
