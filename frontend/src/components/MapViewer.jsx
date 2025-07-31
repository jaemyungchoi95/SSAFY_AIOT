import { useEffect, Fragment } from 'react';
import { Stage, Layer, Image, Circle, Ring, Line, Text } from 'react-konva';

import { useMapData } from '../hooks/useMapData';
import { useMapCanvas } from '../hooks/useMapCanvas';
import { getMarkerColor } from '../utils/spotStyles';
import { useMapStore } from '../stores/useMapStore';
import { getCenter } from '../utils/calcRackCenter';

const MapViewer = ({ scale, stageRef, onWheel }) => {
  const { pgmData, loading: mapLoading, error: mapError } = useMapData();

  // pgmData를 바탕으로 Canvas를 그려서 가져온다
  const mapCanvas = useMapCanvas(pgmData);

  // use스토어에 정의된 상태와 액션을 가져온다
  const { racks, spots, selectedSpotId, fetchMapData, setSelectedSpotId } =
    useMapStore();

  // 선택된 마커를 스토어 상태 기반으로 찾아준다
  const selectedSpot = spots.find((spots) => spots.spot_id === selectedSpotId);

  // spot 데이터를 불러온다
  useEffect(() => {
    fetchMapData();
  }, [fetchMapData]);

  if (mapLoading) return <div>Loading map...</div>;
  if (mapError) return <div>Error loading map data: {mapError.message}</div>;

  return (
    <div className=" p-[20px 10px]">
      {/* Konva의 Image 컴포넌트에 우리가 그린 캔버스를 넘겨줍니다. */}
      <Stage
        width={pgmData?.width}
        height={pgmData?.height}
        // style={{ border: '1px solid grey' }}
        scaleX={scale}
        scaleY={scale}
        draggable={scale > 1}
        // 최초 호출시는 선택된 마커 해제
        onClick={() => setSelectedSpotId(null)}
        onWheel={onWheel}
        ref={stageRef}
      >
        <Layer>{mapCanvas && <Image image={mapCanvas} />}</Layer>
        {/* 마커표시 레이어 */}
        <Layer>
          {spots.map((spot) => (
            <Circle
              key={spot.spot_id}
              x={spot.x}
              y={spot.y}
              radius={5}
              fill={getMarkerColor(spot.status)}
              shadowBlur={5}
              onClick={(e) => {
                e.cancelBubble = true;
                setSelectedSpotId(spot.spot_id);
              }}
            />
          ))}
          {selectedSpot && (
            <Ring
              x={selectedSpot.x}
              y={selectedSpot.y}
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
        <Layer>
          {racks.map((rack) => {
            const center = getCenter(rack);
            return (
              <Fragment key={rack.rack_id}>
                <Line
                  key={rack.rack_id}
                  points={[
                    rack.x1,
                    rack.y1,
                    rack.x2,
                    rack.y2,
                    rack.x3,
                    rack.y3,
                    rack.x4,
                    rack.y4,
                    rack.x1,
                    rack.y1, // 다시 처음으로 닫기
                  ]}
                  stroke="blue"
                  fill="rgba(0,0,255,0.2)"
                  closed={true}
                  strokeWidth={2}
                />
                <Text
                  x={center.x}
                  y={center.y}
                  text={`Rack - ${rack.rack_id}`}
                  fontSize={14}
                  fill="black"
                  align="center"
                  verticalAlign="middle"
                  offsetX={50} // 텍스트 너비 절반 (적절히 조절 필요)
                  offsetY={7} // 텍스트 높이 절반 (적절히 조절 필요)
                />
              </Fragment>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default MapViewer;
