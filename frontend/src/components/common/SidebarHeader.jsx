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
