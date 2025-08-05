import React from 'react';
import './SidebarHeader.css';
import FilterTime from './FilterTime';
import FilterStatus from './FilterStatus';

const SidebarHeader = () => {
  return (
    <div className="SidebarHeader">
      <div className="SidebarHeader_title">이슈 목록</div>
      <div className="SidebarHeader_Filter">
        <FilterTime />
        <FilterStatus />
      </div>
    </div>
  );
};

export default SidebarHeader;
