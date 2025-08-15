import React from 'react';
import tempIcon from '../../assets/Temp.png';

const TempInfo = ({ temperature }) => {
  return (
    <div className="TempInfo flex items-center gap-1">
      <img src={tempIcon} alt="온도 아이콘" className="TempInfo_Icon h-[100%]" />
      <span className="TempInfo_Value">{temperature}°C</span>
    </div>
  );
};

export default TempInfo;
