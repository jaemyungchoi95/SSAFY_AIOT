import React from 'react';
import formatDateTime from '../../utils/FormatDateTime';
import dateIcon from '../../assets/Date.png';

const DateInfo = ({ createdAt }) => {
  const date = formatDateTime(createdAt);

  return (
    <div className="DateInfo flex gap-2.5  mb-1 items-center w-[100%]">
      <img src={dateIcon} alt="날짜 아이콘" className="DateInfo_Icon h-[100%]" />
      <span className="DateInfo_Text">{date}</span>
    </div>
  );
};

export default DateInfo;
