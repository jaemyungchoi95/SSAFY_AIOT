import { useCallback, useRef, useState } from 'react';

export const useZoom = (initScale = 1, minScale = 0.5, maxScale = 3) => {
  const stageRef = useRef(null);
  // 지도 축적 : 1이 100% 를 나타냄
  const [scale, setScale] = useState(initScale);

  const EPSILON = 0.0001;

  const zoomAtCenter = (newScale) => {
    const stage = stageRef.current;
    if (!stage) return;

    // 제한 적용
    const clampedScale = Math.max(minScale, Math.min(maxScale, newScale));

    const prevScale = stage.scaleX();
    const stageCenter = {
      x: stage.width() / 2,
      y: stage.height() / 2,
    };

    const pointerTo = {
      x: (stageCenter.x - stage.x()) / prevScale,
      y: (stageCenter.y - stage.y()) / prevScale,
    };

    const newPos = {
      x: stageCenter.x - pointerTo.x * clampedScale,
      y: stageCenter.y - pointerTo.y * clampedScale,
    };

    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw();

    setScale(clampedScale);
  };

  const zoomIn = () => {
    const newScale = scale + 0.2;
    if (newScale - maxScale > EPSILON) return;
    zoomAtCenter(newScale);
  };
  const zoomOut = () => {
    const newScale = scale - 0.2;
    if (minScale - newScale > EPSILON) return;
    zoomAtCenter(newScale);
  };
  const resetZoom = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const stageWidth = stage.width();
    const stageHeight = stage.height();

    const imageWidth = stage.children?.[0]?.width() || 0;
    const imageHeight = stage.children?.[0]?.height() || 0;

    const centerX = (stageWidth - imageWidth) / 2;
    const centerY = (stageHeight - imageHeight) / 2;

    stage.position({ x: centerX, y: centerY });
    stage.scale({ x: 1, y: 1 });
    stage.batchDraw();

    setScale(1);
  };

  const handleWheel = useCallback(
    (e) => {
      e.evt.preventDefault();

      if (e.evt.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    },
    [zoomIn, zoomOut],
  );

  return {
    stageRef,
    zoomIn,
    zoomOut,
    resetZoom,
    scale,
    handleWheel,
  };
};
