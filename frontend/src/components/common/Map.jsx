import React from 'react';
import './Map.css';
import MapHeader from './MapHeader';
import MapViewer from '../MapViewer';

const Map = ({
  selectedWarehouse,
  setSelectedWarehouse,
  dangerCnt,
  cautionCnt,
}) => {
  return (
    <div className="Map">
      <MapHeader
        selectedWarehouse={selectedWarehouse}
        setSelectedWarehouse={setSelectedWarehouse}
        dangerCnt={dangerCnt}
        cautionCnt={cautionCnt}
      />
      <MapViewer />
    </div>
  );
};

export default Map;
