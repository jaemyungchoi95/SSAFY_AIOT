import React from 'react';
import './DateInfo.css';
import formatDateTime from '../../utils/FormatDateTime';
import dateIcon from '../../assets/Date.png';

const DateInfo = ({ createdAt }) => {
  const date = formatDateTime(createdAt);

  return (
    <div className="DateInfo">
      <img src={dateIcon} alt="날짜 아이콘" className="DateInfo_Icon" />
      <span className="DateInfo_Text">{date}</span>
    </div>
  );
};

export default DateInfo;
