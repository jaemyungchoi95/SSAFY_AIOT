import React, { useEffect, useMemo, useState } from 'react';
import './MapHeader.css';
import FilterLocation from './FilterLocation';
import { useAppStore } from '../../stores/useAppStore';

const MapHeader = ({ scale, zoomIn, zoomOut, resetZoom }) => {
  const { alerts, selectedWarehouseId } = useAppStore();
  const [currScale, setCurrScale] = useState(scale);

  // useMemo를 활용하여 창고의 이슈가 변경될 때만 카운트를 다시 계산
  const { cautionCnt, dangerCnt } = useMemo(() => {
    if (!Array.isArray(alerts)) {
      return { cautionCnt: 0, dangerCnt: 0 };
    }

    const filtered = alerts.filter(
      (alert) => alert.warehouseId === selectedWarehouseId,
    );
    const danger = filtered.filter((alert) => alert.danger === true).length;
    const caution = filtered.filter(
      (alert) => alert.status === 'UNCHECKED' && !alert.danger,
    ).length;
    return { cautionCnt: caution, dangerCnt: danger };
  }, [alerts, selectedWarehouseId]);

  useEffect(() => {
    setCurrScale(scale);
  }, [scale]);

  return (
    <div className="MapHeader">
      <div className="MapHeader_left">
        <FilterLocation />
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
