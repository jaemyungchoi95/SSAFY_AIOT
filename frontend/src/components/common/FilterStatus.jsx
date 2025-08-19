import React from 'react';
import { useFilterStore } from '../../stores/useFilterStore';
import { useDropdownFilter } from '../../hooks/useDropdownFilter';
import FilterStatusIcon from '../../assets/FilterStatus.png';
import FilterDropIcon from '../../assets/FilterDrop.png';

const FilterStatus = () => {
  const { isOpen, setIsOpen, dropdownRef } = useDropdownFilter();
  const { selectedStatus, setSelectedStatus } = useFilterStore();

  const handleSelect = (time) => {
    setSelectedStatus(time);
    setIsOpen(false);
  };
  return (
    <div className="relative w-[100%]" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 py-2 px-3 border-1 border-[#c2c2c2] rounded-3 bg-[#20212a] text-[#eaeaf0] cursor-pointer w-[100%]"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img src={FilterStatusIcon} className="Icon" alt="" />
        <span className="Label truncate">{selectedStatus}</span>
        <img src={FilterDropIcon} alt="" className="text-xs ml-auto" />
      </button>

      {isOpen && (
        <div className="absolute top-[100%] left-0 bg-[#2a2b35] border-1 border-[#c2c2c2] rounded-3 min-w-[120px] shadow-[0_4px_8px_rgba(0,0,0,0.3)] z-[100] flex flex-col w-[100%]">
          {['전체', '처리완료', '미확인', '위험'].map((status) => (
            <button
              key={status}
              className="py-2.5 px-3 text-[#eaeaf0] cursor-pointer text-left"
              onClick={() => handleSelect(status)}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterStatus;
