import React from 'react';
import SidebarList from './SidebarList';
import SidebarHeader from './SidebarHeader';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="Sidebar">
      <SidebarHeader />
      <div className="Sidebar_Content">
        <SidebarList />
      </div>
    </div>
  );
};

export default Sidebar;
