import Konva from 'konva';
import { useRef, useEffect } from 'react';
import { Circle } from 'react-konva';

const RobotMarker = ({ robot, scale }) => {
  const circleRef = useRef(null);

  // 로봇의 위치가 변경될 때마다 깜빡이는 효과를 다시 시작합니다.
  useEffect(() => {
    const node = circleRef.current;
    if (!node) return;

    node.opacity(1);

    // Tween을 생성하여 0.5초 동안 투명도를 0.2 -> 1로 변경하고,
    // yoyo: true 옵션으로 계속 반복하게 만듭니다.
    const tween = new Konva.Tween({
      node: node,
      duration: 0.8,
      opacity: 0.8,
      easing: Konva.Easings.EaseInOut,
      yoyo: true,
      onFinish: function () {
        this.play();
      },
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
      fill="white" // 디버깅용 빨간색
      stroke={'#5E96E0'}
      strokeWidth={4 / scale}
      shadowBlur={10}
      shadowColor="#5E96E0"
    />
  );
};

export default RobotMarker;
