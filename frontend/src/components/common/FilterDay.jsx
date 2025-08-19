import React from 'react';

import CalenderIcon from '../../assets/Calender.png';
import FilterDropIcon from '../../assets/FilterDrop.png';

import { useFilterStore } from '../../stores/useFilterStore';
import { useDropdownFilter } from '../../hooks/useDropdownFilter';

const FilterDay = () => {
  const { isOpen, setIsOpen, dropdownRef } = useDropdownFilter();
  const { selectedDay, setSelectedDay } = useFilterStore();

  const handleSelect = (day) => {
    setSelectedDay(day);
    setIsOpen(false);
  };

  return (
    <div className="relative w-[100%]" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 py-2 px-3 border-1 border-[#c2c2c2] rounded-3 bg-[#20212a] text-[#eaeaf0] cursor-pointer w-[100%]"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img src={CalenderIcon} className="Icon" alt="" />
        <span className="Label truncate">{selectedDay}</span>
        <img src={FilterDropIcon} alt="" className="text-xs ml-auto" />
      </button>

      {isOpen && (
        <div className="absolute top-[100%] left-0 bg-[#2a2b35] border-1 border-[#c2c2c2] rounded-3 min-w-[120px] shadow-[0_4px_8px_rgba(0,0,0,0.3)] z-[100] flex flex-col w-[100%]">
          {['전체', '하루', '일주일', '한달'].map((day) => (
            <button
              key={day}
              className="py-2.5 px-3 text-[#eaeaf0] cursor-pointer text-left"
              onClick={() => handleSelect(day)}
            >
              {day}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDay;
