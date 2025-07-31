import React, { useEffect, useState } from 'react';
import './MapHeader.css';
import FilterLocation from './FilterLocation';

const MapHeader = ({
  selectedWarehouse,
  setSelectedWarehouse,
  dangerCnt,
  cautionCnt,
  scale,
  zoomIn,
  zoomOut,
  resetZoom,
}) => {
  // console.log("cautionCnt", cautionCnt, "dangerCnt", dangerCnt);
  const [currScale, setCurrScale] = useState(scale);

  useEffect(() => {
    setCurrScale(scale);
  }, [scale]);

  return (
    <div className="MapHeader">
      <div className="MapHeader_left">
        <FilterLocation
          selectedWarehouse={selectedWarehouse}
          setSelectedWarehouse={setSelectedWarehouse}
        />
      </div>
      <div className="MapHeader_right">
        <div className="MapHeader_issue">
          <div className="MapHeader_caution">
            <img src="../../src/assets/caution.png" alt="" />
            <span className="MapHeader_IssueCnt"> {cautionCnt} </span>
            <span>미확인</span>
          </div>
          <div className="MapHeader_danger">
            <img src="../../src/assets/danger.png" alt="" />
            <span className="MapHeader_IssueCnt"> {dangerCnt} </span>
            <span> 위험 </span>
          </div>
        </div>
        <div className="MapHeader_ratio">
          <img
            src="../../src/assets/ZoomIn.png"
            alt=""
            className="MapHeader_ZoomIn"
            onClick={() => zoomIn()}
          />
          <span>{(currScale * 100).toFixed(0)}%</span>
          <img
            src="../../src/assets/Zoomout.png"
            alt=""
            className="MapHeader_ZoomOut"
            onClick={() => zoomOut()}
          />
          <img
            src="../../src/assets/ZoomOrigin.png"
            alt=""
            className="MapHeader_ZoomOrigin"
            onClick={() => resetZoom()}
          />
        </div>
      </div>
    </div>
  );
};

export default MapHeader;
