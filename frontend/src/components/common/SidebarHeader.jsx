import React from 'react';
import './SidebarHeader.css';
import FilterTime from './FilterTime';
import FilterStatus from './FilterStatus';

const SidebarHeader = ({
  selectedStatus,
  setSelectedStatus,
  selectedTime,
  setSelectedTime,
}) => {
  // gemini request : 이 컴포넌트는 Sidebar로부터 전달된 props들을 바탕으로 정보를 필터하여 정렬하거나 제한적 렌더링을 진행합니다.
  return (
    <div className="SidebarHeader">
      <div className="SidebarHeader_title">이슈 목록</div>
      <div className="SidebarHeader_Filter">
        <FilterTime
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
        <FilterStatus
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
      </div>
    </div>
  );
};

export default SidebarHeader;
