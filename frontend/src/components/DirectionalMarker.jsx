import { Group, Circle, Line } from 'react-konva';
import { getMarkerColor } from '../utils/spotStyles';

const DirectionalMarker = ({ spot, scale, onClick }) => {
  const { x, y, status, direction } = spot;
  const markerColor = getMarkerColor(status);
  const radius = 6 / scale; // 원의 크기를 스케일에 맞춰 조정
  const pointerSize = (radius + 40) / scale; // 포인터 크기 조정
  const pointerOffset = radius - 1 / scale; // 포인터 오프셋 조정

  return (
    <Group x={x} y={y} rotation={direction} onClick={onClick} onTap={onClick}>
      <Circle radius={radius} fill={markerColor} shadowBlur={5} />
      {typeof direction === 'number' && (
        <Line
          points={[
            // direction 정방향시 코드
            // pointerOffset,
            // 0, // 삼각형의 꼭지점 (회전의 기준점)
            // pointerOffset + pointerSize,
            // -pointerSize / 2,
            // pointerOffset + pointerSize,
            // pointerSize / 2,
            pointerOffset,
            0,
            -pointerSize,
            -pointerSize / 2,
            -pointerSize,
            pointerSize / 2,
          ]}
          fill={markerColor}
          closed={true}
          shadowBlur={5}
          opacity={0.7}
        />
      )}
    </Group>
  );
};

export default DirectionalMarker;
