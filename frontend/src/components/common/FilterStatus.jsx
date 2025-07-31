import React from 'react';
import './FilterStatus.css';
import './FilterTime.css';
import { useState } from 'react';

const FilterStatus = ({ selectedStatus, setSelectedStatus }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (status) => {
    setSelectedStatus(status);
    setIsOpen(false);
  };
  // gemini request : 이 페이지는 전달된 props를 바탕으로 정보를 필터하여 보여줍니다 (해당하지 않는 항목은 숨김처리)
  return (
    <div className="FilterStatus">
      <button
        className="Filter_Title"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img src="../../src/assets/FilterStatus.png" className="Icon" alt="" />
        <span className="Label">{selectedStatus}</span>
        <img src="../../src/assets/FilterDrop.png" alt="" className="Chevron" />
      </button>

      {isOpen && (
        <div className="Filter_Menu">
          {['전체', '처리완료', '미확인', '위험'].map((status) => (
            <button
              key={status}
              className="Filter_Item"
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
