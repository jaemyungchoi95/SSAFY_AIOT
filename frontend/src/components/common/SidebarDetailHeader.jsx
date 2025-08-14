import React from 'react';
import Status from './Status';

import CloseBtn from '../../assets/CloseBtn.png'; // Close button image

const SidebarDetailHeader = ({ alert, onClose }) => {
  const isCompleteText = alert.status === 'DONE' ? '처리완료' : '미확인';
  const isCompleteType = alert.status === 'DONE' ? 'Complete' : 'Caution';
  return (
    <div className="SidebarDetailHeader flex border-b-[3px] border-[#33333c] py-2.5 px-3 justify-between items-center">
      <div className="SidebarDetailHeader_Left flex">
        <div className="SidebarDetailHeader_Spot text-[1.2rem] md:text-[1.4rem] font-bold">
          Rack {alert.rackId} - {alert.spotId}
        </div>
        <div className="SidebarDetailHeader_StatusGroup flex">
          {alert.danger && <Status text="위험" type="Danger" />}
          <Status text={isCompleteText} type={isCompleteType} />
        </div>
      </div>

      <button
        onClick={onClose}
        className="SidebarDetailHeader_CloseBtn cursor-pointer"
      >
        <img src={CloseBtn} alt="" />
      </button>
    </div>
  );
};

export default SidebarDetailHeader;
