import './Map.css';
import MapHeader from './MapHeader';
import MapViewer from '../MapViewer';
import { useZoom } from '../../hooks/useZoom';

const Map = ({
  selectedWarehouse,
  setSelectedWarehouse,
  dangerCnt,
  cautionCnt,
}) => {
  const { stageRef, zoomIn, zoomOut, resetZoom, scale, handleWheel } =
    useZoom();

  return (
    <div className="Map">
      <MapHeader
        selectedWarehouse={selectedWarehouse}
        setSelectedWarehouse={setSelectedWarehouse}
        dangerCnt={dangerCnt}
        cautionCnt={cautionCnt}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        resetZoom={resetZoom}
        scale={scale}
      />
      <MapViewer scale={scale} stageRef={stageRef} onWheel={handleWheel} />
    </div>
  );
};

export default Map;
