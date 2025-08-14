import { useDebouncedCallback } from 'use-debounce';
import { Fragment, useLayoutEffect, useMemo } from 'react';
import { Stage, Layer, Image, Ring, Line, Text } from 'react-konva';
import { useMapData } from '../hooks/useMapData';
import { useMapCanvas } from '../hooks/useMapCanvas';
import { getCenter } from '../utils/calcRackCenter';
import { useStageSize } from '../hooks/useStageSize';
import DirectionalMarker from './DirectionalMarker';
import RobotMarker from './RobotMarker';

import { useAppStore } from '../stores/useAppStore';
import { useRobotStore } from '../stores/useRobotStore';

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
  const {
    racks,
    spots,
    fetchDetailAlert,
    selectedAlertId,
    setSelectedAlertId,
    // selectedWarehouseId,
  } = useAppStore();

  const [commandTargetSpot, setCommandTargetSpot] = useState(null); // 로봇 명령 대상 스팟

  // useRobotStore에서 필요한 액션과 상태를 가져옵니다.
  const {
    moveRobotTo,
    moving: robotMoving,
    robotPositions,
    error: robotError,
  } = useRobotStore();

  const selectedSpot = useMemo(() => {
    if (!selectedAlertId || !Array.isArray(spots)) {
      return null;
    }
    // alertDetail의 ID와 일치하는 spot을 spots 배열에서 찾습니다.
    return spots.find((spot) => spot.alertId === selectedAlertId);
  }, [selectedAlertId, spots]);

  const debouncedRecalculate = useDebouncedCallback((size, data) => {
    if (!data || size.width === 0 || size.height === 0) {
      return;
    }
    const scaleX = size.width / data.width;
    const scaleY = size.height / data.height;
    const newScale = Math.min(scaleX, scaleY) * 0.9;

    const newPos = {
      x: (size.width - data.width * newScale) / 2,
      y: (size.height - data.height * newScale) / 2,
    };

    setScale(newScale);
    setPosition(newPos);
  });

  useLayoutEffect(() => {
    debouncedRecalculate(containerSize, pgmData);
  }, [containerSize, pgmData, debouncedRecalculate]);

  useLayoutEffect(() => {
    if (resetKey > 0) {
      debouncedRecalculate(containerSize, pgmData);
    }
  }, [resetKey, containerSize, pgmData, debouncedRecalculate]);

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        overflow: 'hidden',
        backgroundColor: mapLoading ? '#20212a' : 'transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#EAEAF0',
      }}
    >
      {/* 로딩 중일 때 메시지 표시 */}
      {mapLoading && <div>맵 로딩 중...</div>}

      {/* 에러 발생 시 메시지 표시 */}
      {mapError && <div>맵 로딩 오류: {mapError.message}</div>}

      {/* 로딩도 아니고 에러도 없는데 맵 데이터가 없을 때 메시지 표시 */}
      {!mapLoading && !mapError && !mapCanvas && (
        <div>선택된 창고에 맵 정보가 없습니다.</div>
      )}
      {/* 컨테이너 크기가 잡히고 에러가 없을 때만 Stage를 렌더링합니다. */}
      {containerSize.width > 0 && mapCanvas && !mapError && (
        <Stage
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
              setSelectedAlertId(null);
            }
          }}
        >
          <Layer>{mapCanvas && <Image image={mapCanvas} />}</Layer>
          {/* 랙을 그리는 레이어 */}
          <Layer>
            {Array.isArray(racks) &&
              racks.map((rack) => {
                const center = getCenter(rack);
                return (
                  <Fragment key={rack.rackId}>
                    <Line
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
                      text={`Rack - ${rack.rackId}`}
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
          {/* 마커표시 레이어 */}
          <Layer>
            {Array.isArray(spots) &&
              spots.map((spot) => (
                <DirectionalMarker
                  key={spot.spotId}
                  spot={spot}
                  scale={scale}
                  onClick={(e) => {
                    e.cancelBubble = true;
                    fetchDetailAlert(spot.alertId);
                  }}
                />
              ))}
            {selectedSpot && (
              <Ring
                x={selectedSpot.x}
                y={selectedSpot.y}
                innerRadius={16 / scale} // 안쪽 원 반지름
                outerRadius={20 / scale} // 바깥쪽 원 반지름
                fill={'#FF7575'} // 채우기 색상
                opacity={0.7} // 투명도
                listening={false} // 이 링은 클릭 이벤트를 받지 않도록 설정
              />
            )}
          </Layer>
          {/* 로봇 위치 표시 레이어 */}
          <Layer>
            {Object.values(robotPositions).map((robot) => (
              <RobotMarker key={robot.robotId} robot={robot} scale={scale} />
            ))}
          </Layer>
        </Stage>
      )}
      {/* 에러가 발생하면 에러 메시지를 표시합니다. */}
      {mapError && <div>Error loading map data: {mapError.message}</div>}
    </div>
  );
};

export default MapViewer;
