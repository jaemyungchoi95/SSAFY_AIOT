import React, { useEffect } from 'react';
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
      <div className="SidebarHeader_title text-2xl font-bold mt-1 mb-3">이슈 목록</div>
      <div className="SidebarHeader_Filter flex justify-between gap-3 mb-1">
        <FilterTime />
        <FilterStatus />
      </div>
    </div>
  );
};

export default SidebarHeader;
