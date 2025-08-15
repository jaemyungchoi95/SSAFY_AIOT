import React from 'react';
import SidebarList from './SidebarList';
import SidebarHeader from './SidebarHeader';

const Sidebar = () => {
  return (
    <div className="Sidebar flex flex-col h-[100%] gap-2 py-3 px-4 bg-[#20212a] text-[#eaeaf0] flex-1 rounded-2xl">
      <SidebarHeader />
      <div className="Sidebar_Content overflow-y-auto scrollbar-none">
        <SidebarList />
      </div>
    </div>
  );
};

export default Sidebar;
