import React from 'react';
import './DateInfo.css';
import formatDateTime from '../../utils/FormatDateTime';

const DateInfo = ({ createdAt, handledAt }) => {
  const date = handledAt
    ? formatDateTime(handledAt)
    : formatDateTime(createdAt);

  return (
    <div className="DateInfo">
      <img
        src="/src/assets/Date.png"
        alt="날짜 아이콘"
        className="DateInfo_Icon"
      />
      <span className="DateInfo_Text">{date}</span>
    </div>
  );
};

export default DateInfo;
