import React from 'react';
import SidebarList from './SidebarList';
import SidebarHeader from './SidebarHeader';
import './Sidebar.css';
import { useState } from 'react';

const Sidebar = ({
  selectedWarehouse,
  setDangerCnt,
  setCautionCnt,
  setSelectedIssue,
}) => {
  const [selectedStatus, setSelectedStatus] = useState('전체');
  const [selectedTime, setSelectedTime] = useState('최신순');
  return (
    <div className="Sidebar">
      <SidebarHeader
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
      />
      <div className="Sidebar_Content">
        <SidebarList
          selectedWarehouse={selectedWarehouse}
          selectedStatus={selectedStatus}
          selectedTime={selectedTime}
          setDangerCnt={setDangerCnt}
          setCautionCnt={setCautionCnt}
          setSelectedIssue={setSelectedIssue}
        />
      </div>
    </div>
  );
};

export default Sidebar;
