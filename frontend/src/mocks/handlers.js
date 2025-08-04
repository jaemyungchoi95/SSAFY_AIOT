import { http, HttpResponse } from 'msw';
import { alertMockData, reportMockData, warehouseMockData } from './data';

export const handlers = [
  // 1. my_map.yaml 파일을 반환하는 API 핸들러
  // GET /api/map/metadata 요청을 가로챕니다.
  http.get('/api/map/metadata', async () => {
    // public 폴더의 my_map.yaml 파일을 fetch로 읽어옵니다.
    const response = await fetch('/my_map.yaml');
    const yamlText = await response.text();

    // 읽어온 텍스트를 응답으로 보냅니다.
    return HttpResponse.text(yamlText, {
      headers: {
        'Content-Type': 'text/yaml',
      },
    });
  }),

  // 2. my_map.pgm 파일을 반환하는 API 핸들러
  // GET /api/map/image 요청을 가로챕니다.
  http.get('/api/map/image', async () => {
    // 시험 개발용
    // const response = await fetch('/JSI_SLAM_map.pgm');

    // 시연용
    const response = await fetch('/my_world.pgm');
    // const response = await fetch(
    //   'https://are-you-hot.s3.ap-northeast-2.amazonaws.com/maps/JSI_SLAM_map.pgm',
    // );
    const imageBuffer = await response.arrayBuffer(); // 이미지를 ArrayBuffer로읽음

    // ArrayBuffer를 응답으로 보냅니다.
    return new HttpResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/x-portable-graymap',
      },
    });
  }),

  // 3. racks.json을 보내주는 API 핸들러
  http.get('/api/map/rackList', async () => {
    // 시험 개발용
    // const response = await fetch('/rackList.json');
    // 시연용
    const response = await fetch('/rackList2.json');
    const markerData = await response.json();

    return HttpResponse.json(markerData);
  }),

  // 4. alerts 데이터를 보내주는 API 핸들러
  http.get('/api/alerts', () => {
    const responseData = alertMockData.map((issue) => {
      let createdAt = new Date();
      if (issue.id === 2) {
        createdAt = new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000);
      } else if (issue.id === 3) {
        createdAt = new Date(new Date().getTime() - 9 * 24 * 60 * 60 * 1000);
      }
      return {
        ...issue,
        created_at: createdAt.toISOString(),
        updated_at: createdAt.toISOString(),
      };
    });
    return HttpResponse.json(responseData);
  }),

  // 5. reports 데이터를 보내주는 API 핸들러
  http.get('/api/reports', async () => {
    const responseData = reportMockData.map((report) => ({
      ...report,
      handled_at: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000),
    }));
    return HttpResponse.json(responseData);
  }),

  // 6. warehouses 데이터를 보내주는 API 핸들러
  http.get('/api/warehouses', async () => {
    const responseData = warehouseMockData.map((warehouse) => ({
      ...warehouse,
      created_at: new Date().toISOString(),
    }));
    return HttpResponse.json(responseData);
  }),
];
