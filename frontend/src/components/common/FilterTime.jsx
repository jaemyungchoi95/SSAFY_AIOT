import React from 'react';
import { useFilterStore } from '../../stores/useFilterStore';
import { useDropdownFilter } from '../../hooks/useDropdownFilter';
import FilterTimeIcon from '../../assets/FilterTime.png';
import FilterDropIcon from '../../assets/FilterDrop.png';

const FilterTime = () => {
  const { isOpen, setIsOpen, dropdownRef } = useDropdownFilter();
  const { selectedTime, setSelectedTime } = useFilterStore();

  const handleSelect = (time) => {
    setSelectedTime(time);
    setIsOpen(false);
  };

  return (
    <div className="relative w-[100%]" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 py-2 px-3 border-1 border-[#c2c2c2] rounded-3 bg-[#20212a] text-[#eaeaf0] cursor-pointer w-[100%]"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img src={FilterTimeIcon} className="text-sm" alt="" />
        <span className="Label truncate">{selectedTime}</span>
        <img src={FilterDropIcon} alt="" className="text-xs ml-auto" />
      </button>
      {isOpen && (
        <div className="absolute top-[100%] left-0 bg-[#2a2b35] border-1 border-[#c2c2c2] rounded-3 min-w-[120px] shadow-[0_4px_8px_rgba(0,0,0,0.3)] z-[100] flex flex-col w-[100%]">
          {['최신순', '오래된순'].map((time) => (
            <button
              key={time}
              className="py-2.5 px-3 text-[#eaeaf0] cursor-pointer text-left"
              onClick={() => handleSelect(time)}
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterTime;
