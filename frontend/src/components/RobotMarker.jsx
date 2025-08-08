import Konva from 'konva';
import { useRef, useEffect } from 'react';
import { Circle } from 'react-konva';

const RobotMarker = ({ robot, scale }) => {
  const circleRef = useRef(null);

  // 로봇의 위치가 변경될 때마다 깜빡이는 효과를 다시 시작합니다.
  useEffect(() => {
    const node = circleRef.current;
    if (!node) return;

    // Tween을 생성하여 0.5초 동안 투명도를 0.2 -> 1로 변경하고,
    // yoyo: true 옵션으로 계속 반복하게 만듭니다.
    const tween = new Konva.Tween({
      node: node,
      duration: 0.5,
      opacity: 0.2,
      easing: Konva.Easings.EaseInOut,
      yoyo: true,
    });

    // 애니메이션 시작
    tween.play();

    // 컴포넌트가 사라지거나 위치가 바뀔 때 이전 애니메이션을 정리
    return () => tween.destroy();
  }, [robot.x, robot.y]); // x, y 좌표가 바뀔 때마다 효과를 재시작

  return (
    <Circle
      ref={circleRef}
      key={robot.robotId}
      x={robot.x}
      y={robot.y}
      radius={8 / scale}
      fill="red" // 디버깅용 빨간색
      opacity={1} // 초기 투명도는 1
      shadowBlur={5}
      shadowColor="black"
    />
  );
};

export default RobotMarker;
