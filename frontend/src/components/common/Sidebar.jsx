import React from 'react';
import SidebarList from './SidebarList';
import SidebarHeader from './SidebarHeader';
import './Sidebar.css';
import { useState } from 'react';

const Sidebar = () => {
  const [selectedStatus, setSelectedStatus] = useState('전체');
  const [selectedTime, setSelectedTime] = useState('최신순');
  // gemini request : 이 컴포넌트는 Home 으로부터 전달받은 props를 다시 SidebarHeader, SidebarList로 전달하는 역할을 합니다.
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
          selectedStatus={selectedStatus}
          selectedTime={selectedTime}
        />
      </div>
    </div>
  );
};

export default Sidebar;
