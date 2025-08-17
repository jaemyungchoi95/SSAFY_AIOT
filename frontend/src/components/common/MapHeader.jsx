import React, { useMemo } from 'react';
import './MapHeader.css';

import zoomInIcon from '../../assets/ZoomIn.png';
import zoomOutIcon from '../../assets/Zoomout.png';
import cautionIcon from '../../assets/caution.png';
import dangerIcon from '../../assets/danger.png';
import ZoomOriginIcon from '../../assets/ZoomOrigin.png';

import FilterLocation from './FilterLocation';
import { useAppStore } from '../../stores/useAppStore';

const MapHeader = ({ scale, zoomIn, zoomOut, resetZoom }) => {
  const {
    alerts,
    selectedWarehouseId,
    mapInteractionMode,
    setMapInteractionMode,
  } = useAppStore();

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
      (alert) => alert.status === 'UNCHECKED',
    ).length;
    return { cautionCnt: caution, dangerCnt: danger };
  }, [alerts, selectedWarehouseId]);

  // 맵 상호작용 모드 전환 핸들러
  const toggleMapInteractionMode = () => {
    setMapInteractionMode(
      mapInteractionMode === 'VIEW_DETAILS' ? 'COMMAND_ROBOT' : 'VIEW_DETAILS',
    );
  };

  return (
    <div className="MapHeader">
      <div className="MapHeader_left px-3">
        <FilterLocation />
      </div>
      <div className="MapHeader_right flex gap-6">
        <div className="MapHeader_issue flex gap-3">
          <div className="MapHeader_caution">
            <img src={cautionIcon} alt="" />
            <span className="MapHeader_IssueCnt"> {cautionCnt} </span>
            <span className="truncate">미확인</span>
          </div>
          <div className="MapHeader_danger">
            <img src={dangerIcon} alt="" />
            <span className="MapHeader_IssueCnt"> {dangerCnt} </span>
            <span className="truncate"> 위험 </span>
          </div>
        </div>
        <div className="MapHeader_ratio">
          <button
            type="button"
            className={
              mapInteractionMode === 'VIEW_DETAILS'
                ? 'py-0.5 px-2 truncate'
                : 'py-0.5 px-2 bg-[#396DF0] font-bold !rounded-md truncate'
            }
            onClick={toggleMapInteractionMode}
            aria-label="맵 상호작용 모드 전환"
          >
            조작
          </button>
          <button
            type="button"
            className="MapHeader_ZoomIn"
            onClick={zoomIn}
            aria-label="확대"
          >
            <img src={zoomInIcon} alt="줌인 아이콘" />
          </button>
          <span>{(scale * 100).toFixed(0)}%</span>
          <button
            type="button"
            className="MapHeader_ZoomOut"
            onClick={zoomOut}
            aria-label="축소"
          >
            <img src={zoomOutIcon} alt="줌아웃 아이콘" />
          </button>
          <button
            type="button"
            className="MapHeader_ZoomOrigin"
            onClick={resetZoom}
            aria-label="원래 크기로"
          >
            <img src={ZoomOriginIcon} alt="원본보기" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapHeader;
