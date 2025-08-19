import { useRef, useState } from 'react';
import './Map.css';
import MapHeader from './MapHeader';
import MapViewer from '../MapViewer';

// 부모 컴포넌트에서 전달해주는 컴포넌트의 제거로 해당 부분 제거 및 하위 props들 제거
const Map = () => {
  const stageRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [resetKey, setResetKey] = useState(0);

  const zoom = (scaleBy) => {
    if (!stageRef.current) return;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const newScale = oldScale * scaleBy;

    const center = { x: stage.width() / 2, y: stage.height() / 2 };
    const relatedTo = {
      x: (center.x - stage.x()) / oldScale,
      y: (center.y - stage.y()) / oldScale,
    };
    const newPos = {
      x: center.x - relatedTo.x * newScale,
      y: center.y - relatedTo.y * newScale,
    };

    setScale(newScale);
    setPosition(newPos);
  };

  const zoomIn = () => zoom(1.2);
  const zoomOut = () => zoom(1 / 1.2);
  const resetZoom = () => setResetKey((prev) => prev + 1);

  const handleWheel = (e) => {
    e.evt.preventDefault();
    if (!stageRef.current) return;
    const scaleBy = 1.05;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    setScale(newScale);
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    setPosition(newPos);
  };

  return (
    <div className="Map">
      <MapHeader
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        resetZoom={resetZoom}
        scale={scale}
      />
      <MapViewer
        scale={scale}
        setScale={setScale}
        position={position}
        setPosition={setPosition}
        stageRef={stageRef}
        onWheel={handleWheel}
        resetKey={resetKey}
      />
    </div>
  );
};

export default Map;
