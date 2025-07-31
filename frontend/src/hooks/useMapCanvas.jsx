// pgmData가 변경될 때만 캔버스를 다시 그리는 useMemo 훅
import { useMemo } from 'react';

export const useMapCanvas = (pgmData) => {
  return useMemo(() => {
    if (!pgmData) return null;

    const { width, height, pixels, maxGray } = pgmData;

    // 1. 메모리에 임시 캔버스를 생성합니다.
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    // 2. 픽셀 데이터를 담을 ImageData 객체를 생성합니다.
    const imageData = context.createImageData(width, height);

    // 3. PGM 픽셀 데이터를 ImageData에 채워넣습니다.
    for (let i = 0; i < pixels.length; i++) {
      // 0~255 범위로 정규화합니다.
      const grayValue = (pixels[i] / maxGray) * 255;
      // 각 픽셀은 RGBA 4개의 값으로 이루어짐
      const dataIndex = i * 4;

      imageData.data[dataIndex] = grayValue; // R
      imageData.data[dataIndex + 1] = grayValue; // G
      imageData.data[dataIndex + 2] = grayValue; // B
      imageData.data[dataIndex + 3] = 255; // A (불투명)
    }

    // 4. 완성된 이미지 데이터를 캔버스에 그립니다.
    context.putImageData(imageData, 0, 0);

    return canvas;
  }, [pgmData]); // pgmData가 바뀔 때만 이 로직이 실행됩니다.
};
