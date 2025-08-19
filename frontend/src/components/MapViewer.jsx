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
import { v4 as uuidv4 } from 'uuid';

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
    robots,
    fetchDetailAlert,
    selectedAlertId,
    setSelectedAlertId,
    mapInteractionMode,
  } = useAppStore();

  // useRobotStore에서 필요한 액션과 상태를 가져옵니다.
  const { moveRobotTo, robotPositions, error: robotError } = useRobotStore();

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
  }, 200);

  useLayoutEffect(() => {
    debouncedRecalculate(containerSize, pgmData);
  }, [containerSize, pgmData, debouncedRecalculate]);

  useLayoutEffect(() => {
    if (resetKey > 0) {
      debouncedRecalculate(containerSize, pgmData);
    }
  }, [resetKey, containerSize, pgmData, debouncedRecalculate]);

  const debouncedMoveRobot = useDebouncedCallback(
    async (robotId, spotId) => {
      const commandId = uuidv4();
      try {
        await moveRobotTo(robotId, spotId, commandId);
        // alert(
        //   `로봇 ${robotId}에게 스팟 (${spotId})으로 이동 명령을 전송했습니다. (명령ID: ${commandId})`,
        // );
      } catch (err) {
        // alert(
        //   `로봇 이동 명령 실패: ${robotError || err.message || '알 수 없는 오류'}`,
        // );
      }
    },
    500,
    { leading: true, trailing: false },
  );

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
              fetchDetailAlert(null);
            }
          }}
        >
          <Layer>{mapCanvas && <Image image={mapCanvas} />}</Layer>
          {/* 랙을 그리는 레이어 */}
          <Layer>
            {Array.isArray(racks) &&
              racks.map((rack) => {
                const center = getCenter(rack);

                // --- 최종 로직 ---
                // 1. 랙 자체의 크기를 기반으로 한 '기본 폰트 크기'를 계산합니다.
                const rackWidth =
                  Math.max(rack.x1, rack.x2, rack.x3, rack.x4) -
                  Math.min(rack.x1, rack.x2, rack.x3, rack.x4);
                const rackHeight =
                  Math.max(rack.y1, rack.y2, rack.y3, rack.y4) -
                  Math.min(rack.y1, rack.y2, rack.y3, rack.y4);

                const baseSizeFromRack = Math.min(rackWidth, rackHeight) * 0.03; // 랙 크기에 비례
                const minBaseSize = 3; // 최소 기본 크기
                const maxBaseSize = 10; // 최대 기본 크기
                const clampedBaseSize = Math.max(
                  minBaseSize,
                  Math.min(baseSizeFromRack, maxBaseSize),
                );

                // 2. 줌(scale)에 따라 추가될 '증가량'을 계산합니다.
                const growthFactor = 0.2;
                const growth = clampedBaseSize * growthFactor;

                // 3. 최종 폰트 크기 = (랙별 기본 크기) + (줌 증가량)
                const dynamicFontSize = clampedBaseSize + growth;

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
                      fontSize={dynamicFontSize}
                      // fontSize={14 / scale}
                      fontWeight="600"
                      fill="white"
                      align="center"
                      verticalAlign="middle"
                      // offsetX={(`Rack - ${rack.rackId}`.length * 3.5) / scale}
                      // offsetY={7 / scale}
                      offsetX={
                        (`Rack - ${rack.rackId}`.length * dynamicFontSize) / 4.5
                      }
                      offsetY={dynamicFontSize / 2}
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
                    if (mapInteractionMode === 'VIEW_DETAILS') {
                      // 상세 보기 모드일 때
                      fetchDetailAlert(spot.alertId); // 기존 알림 상세 보기 기능
                    } else if (mapInteractionMode === 'COMMAND_ROBOT') {
                      // 로봇 명령 모드일 때
                      setSelectedAlertId(null); // 기존 알림 선택 해제
                      fetchDetailAlert(null); // 상세 정보 초기화

                      // 로봇 ID를 가져와 디바운스된 함수 호출
                      if (Array.isArray(robots) && robots.length > 0) {
                        const robotIdToCommand = robots[0].robotId;
                        debouncedMoveRobot(robotIdToCommand, spot.spotId); // 디바운스된 함수 호출
                      } else {
                        alert('명령을 내릴 수 있는 로봇 정보가 없습니다.');
                      }
                    }
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
