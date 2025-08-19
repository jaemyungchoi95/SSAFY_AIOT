import React, { useState } from 'react';

import { useAppStore } from '../../stores/useAppStore';

const Modal_Content_Left = () => {
  const { alertDetail } = useAppStore();
  // 1. 투명도를 관리할 state 생성, 초기값 0.45
  const [opacity, setOpacity] = useState(0.45);

  // 2. 마우스 휠 이벤트를 처리할 핸들러 함수
  const handleWheel = (e) => {
    e.stopPropagation(); // 이벤트가 부모로 전파되는 것을 막는다

    // 휠을 올리면(e.deltaY < 0) 값이 증가, 내리면(e.deltaY > 0) 감소
    const direction = e.deltaY > 0 ? -1 : 1;

    // 현재 opacity 상태를 기반으로 값을 조절합니다.
    setOpacity((prevOpacity) => {
      const newOpacity = prevOpacity + direction * 0.025;
      // 값이 0과 1 사이를 벗어나지 않도록 고정(clamp)합니다.
      return Math.max(0, Math.min(1, newOpacity));
    });
  };
  if (!alertDetail) {
    // 데이터 없으면 로딩 표시하거나 빈 화면 렌더링
    return <div>로딩 중...</div>;
  }

  return (
    <div className="Modal_Content_Left py-1.5 px-7.5 h-full">
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
        onWheel={handleWheel}
      >
        <img
          src={alertDetail.imageNormalUrl}
          style={{
            filter: 'brightness(200%)',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          alt=""
        />
        <img
          src={alertDetail.imageThermalUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: opacity,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          alt=""
        />
      </div>
    </div>
  );
};

export default Modal_Content_Left;
