import React, { useEffect } from 'react';
import './SidebarHeader.css';
import FilterTime from './FilterTime';
import FilterStatus from './FilterStatus';
import { useAppStore } from '../../stores/useAppStore';
import { useFilterStore } from '../../stores/useFilterStore';

const SidebarHeader = () => {
  const selectedWarehouseId = useAppStore((state) => state.selectedWarehouseId);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  useEffect(() => {
    resetFilters();
  }, [selectedWarehouseId, resetFilters]);

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
