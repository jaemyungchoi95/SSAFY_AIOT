import { Fragment, useLayoutEffect } from 'react';
import { Stage, Layer, Image, Circle, Ring, Line, Text } from 'react-konva';
import { useMapData } from '../hooks/useMapData';
import { useMapCanvas } from '../hooks/useMapCanvas';
import { getMarkerColor } from '../utils/spotStyles';
import { useAppStore } from '../stores/useAppStore';
import { getCenter } from '../utils/calcRackCenter';
import { useStageSize } from '../hooks/useStageSize';

const MapViewer = ({
  scale,
  setScale,
  position,
  setPosition,
  stageRef,
  onWheel,
  resetKey,
}) => {
  const { pgmData, loading: mapLoading, error: mapError } = useMapData();
  const mapCanvas = useMapCanvas(pgmData);

  const [containerRef, containerSize] = useStageSize();

  // useApp스토어에 정의된 상태와 액션을 가져온다
  const { racks, spots, selectedIssueId, setSelectedIssueId } = useAppStore();

  const selectedSpot = Array.isArray(spots)
    ? spots.find((spot) => spot.issue_id === selectedIssueId)
    : null;

  useLayoutEffect(() => {
    if (!pgmData || containerSize.width === 0) return;

    const scaleX = containerSize.width / pgmData.width;
    const scaleY = containerSize.height / pgmData.height;
    const initialScale = Math.min(scaleX, scaleY) * 0.9;
    const offsetX = (containerSize.width - pgmData.width * initialScale) / 2;
    const offsetY = (containerSize.height - pgmData.height * initialScale) / 2;

    setScale(initialScale);
    setPosition({ x: offsetX, y: offsetY });
  }, [pgmData, containerSize, setScale, setPosition, resetKey]);

  if (mapLoading) return <div>Loading map...</div>;
  if (mapError) return <div>Error loading map data: {mapError.message}</div>;

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        overflow: 'hidden',
      }}
    >
      {/* Konva의 Image 컴포넌트에 우리가 그린 캔버스를 넘겨줍니다. */}
      <Stage
        // width={pgmData?.width}
        // height={pgmData?.height}
        width={containerSize.width}
        height={containerSize.height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable
        onDragEnd={(e) => setPosition(e.target.position())}
        onWheel={onWheel}
        ref={stageRef}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedIssueId(null);
          }
        }}
      >
        <Layer>{mapCanvas && <Image image={mapCanvas} />}</Layer>
        {/* 마커표시 레이어 */}
        <Layer>
          {Array.isArray(spots) &&
            spots.map((spot) => (
              <Circle
                key={spot.spot_id}
                x={spot.x}
                y={spot.y}
                radius={5 / scale}
                fill={getMarkerColor(spot.status)}
                shadowBlur={5}
                onClick={(e) => {
                  e.cancelBubble = true;
                  setSelectedIssueId(spot.issue_id || null);
                }}
              />
            ))}
          {selectedSpot && (
            <Ring
              x={selectedSpot.x}
              y={selectedSpot.y}
              innerRadius={8 / scale} // 안쪽 원 반지름
              outerRadius={12 / scale} // 바깥쪽 원 반지름
              fill={'#FF7575'} // 채우기 색상
              opacity={0.7} // 투명도
              shadowBlur={10} // 그림자 효과
              shadowColor="red"
              listening={false} // 이 링은 클릭 이벤트를 받지 않도록 설정
            />
          )}
        </Layer>
        <Layer>
          {Array.isArray(racks) &&
            racks.map((rack) => {
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
                    strokeWidth={2 / scale}
                  />
                  <Text
                    x={center.x}
                    y={center.y}
                    text={`Rack - ${rack.rack_id}`}
                    fontSize={14 / scale}
                    fill="black"
                    align="center"
                    verticalAlign="middle"
                    offsetX={10} // 텍스트 너비 절반 (적절히 조절 필요)
                    offsetY={2} // 텍스트 높이 절반 (적절히 조절 필요)
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
