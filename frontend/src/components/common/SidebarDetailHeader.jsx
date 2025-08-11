import React from 'react';
import './SidebarDetailHeader.css';
import Status from './Status';

import CloseBtn from '../../assets/CloseBtn.png'; // Close button image

const SidebarDetailHeader = ({ alert, onClose }) => {
  const isCompleteText = alert.status === 'DONE' ? '처리완료' : '미확인';
  const isCompleteType = alert.status === 'DONE' ? 'Complete' : 'Caution';
  return (
    <div className="SidebarDetailHeader">
      <div className="SidebarDetailHeader_Left">
        <div className="SidebarDetailHeader_Spot">
          Rack {alert.rackId} - {alert.spotId}
        </div>
        <div className="SidebarDetailHeader_StatusGroup">
          {alert.danger && <Status text="위험" type="Danger" />}
          <Status text={isCompleteText} type={isCompleteType} />
        </div>
      </div>

      <button onClick={onClose} className="SidebarDetailHeader_CloseBtn">
        <img src={CloseBtn} alt="" />
      </button>
    </div>
  );
};

export default SidebarDetailHeader;
