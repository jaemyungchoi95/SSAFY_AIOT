import { http, HttpResponse } from 'msw';

// 임시 마커 데이터 (JSON 형식)
// gemini feedback : 구조를 바꿈으로서 여기에 있는 데이터는 어떻게 되는건지 설명해줘

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
    const response = await fetch('/JSI_SLAM_map.pgm');
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
    const response = await fetch('/rackList.json');
    const markerData = await response.json();

    return HttpResponse.json(markerData);
  }),

  // 4. racks.json을 보내주는 API 핸들러
  http.get('/api/map/racks', async () => {
    const response = await fetch('/racks.json');
    const rackData = await response.json();

    return HttpResponse.json(rackData);
  }),
];
