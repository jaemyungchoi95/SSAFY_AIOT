import { useMemo, useState, useEffect } from 'react';
import { Stage, Layer, Image, Circle, Ring } from 'react-konva';
import axios from 'axios';

import { useMapData } from '../hooks/useMapData';
import { getMarkerColor } from '../utils/MarkerStyles';
import { useMapStore } from '../stores/useMapStore';

const MapViewer = () => {
  const {
    pgmData,
    mapMetadata,
    loading: mapLoading,
    error: mapError,
  } = useMapData();
  // use스토어에 정의된 상태와 액션을 가져온다
  const { markers, selectedMarkerId, fetchMarkers, setSelectedMarkerId } =
    useMapStore();
  // 선택된 마커를 스토어 상태 기반으로 찾아준다
  const selectedMarker = markers.find(
    (marker) => marker.id === selectedMarkerId,
  );

  // API 호출하여 마커 데이터를 가져온다
  // useEffect(() => {
  //   axios.get('/api/map/markers')
  //        .then((Response) => {
  //     setMarkers(Response.data);
  //   })
  //   .catch((error) => console.error("마커를 불러오는데 실패하였습니다.", error));
  // }, []);

  console.log('현재 선택된 마커 ID:', selectedMarkerId);

  useEffect(() => {
    fetchMarkers();
  }, [fetchMarkers]);

  // pgmData가 변경될 때만 캔버스를 다시 그리는 useMemo 훅
  const mapCanvas = useMemo(() => {
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

  if (mapLoading) return <div>Loading map...</div>;
  if (mapError) return <div>Error loading map data: {mapError.message}</div>;

  return (
    <div>
      {/* Konva의 Image 컴포넌트에 우리가 그린 캔버스를 넘겨줍니다. */}
      <Stage
        width={pgmData?.width || 500}
        height={pgmData?.height || 500}
        style={{ border: '1px solid grey' }}
        // 최초 호출시는 선택된 마커 해제
        onClick={() => setSelectedMarkerId(null)}
      >
        <Layer>{mapCanvas && <Image image={mapCanvas} />}</Layer>
        {/* 마커표시 레이어 */}
        <Layer>
          {markers.map((marker) => (
            <Circle
              key={marker.id}
              x={marker.x}
              y={marker.y}
              radius={5}
              fill={getMarkerColor(marker.status)}
              shadowBlur={5}
              onClick={(e) => {
                e.cancelBubble = true;
                setSelectedMarkerId(marker.id);
              }}
            />
          ))}
          {selectedMarker && (
            <Ring
              x={selectedMarker.x}
              y={selectedMarker.y}
              innerRadius={8} // 안쪽 원 반지름
              outerRadius={12} // 바깥쪽 원 반지름
              fill={'#FF7575'} // 채우기 색상
              opacity={0.7} // 투명도
              shadowBlur={10} // 그림자 효과
              shadowColor="red"
              listening={false} // 이 링은 클릭 이벤트를 받지 않도록 설정
            />
          )}
        </Layer>
      </Stage>
      {/* <h3>Map Metadata (from .yaml)</h3>
      <pre>{JSON.stringify(mapMetadata, null, 2)}</pre> */}
    </div>
  );
};

export default MapViewer;
