import React from 'react';
import './TempInfo.css';

const TempInfo = ({ temperature }) => {
  return (
    <div className="TempInfo">
      <img
        src="../../src/assets/Temp.png"
        alt="온도 아이콘"
        className="TempInfo_Icon"
      />
      <span className="TempInfo_Value">{temperature}°C</span>
    </div>
  );
};

export default TempInfo;
