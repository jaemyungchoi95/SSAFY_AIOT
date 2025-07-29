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
    const response = await fetch('/my_map.pgm');
    const imageBuffer = await response.arrayBuffer(); // 이미지를 ArrayBuffer로읽음
    
    // ArrayBuffer를 응답으로 보냅니다.
    return new HttpResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/x-portable-graymap',
      },
    });
  }),
  
  // gemini feedback : json형식으로 mockdata 만들어서 public에 넣어놓고 나중에 백엔드에서 보내주는 데이터 파일을 읽어온다면 어떻게 하면 될지?
  http.get('/api/map/markers', async () => {
    const response = await fetch('/markers.json');
    const markerData = await response.json();
    
    return HttpResponse.json(markerData);
  }),
];