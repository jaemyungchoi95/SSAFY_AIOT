import React from 'react';
import './SidebarDetailHeader.css';
import Status from './Status';

import CloseBtn from '../../assets/CloseBtn.png'; // Close button image

const SidebarDetailHeader = ({ alert, onClose }) => {
  return (
    <div className="SidebarDetailHeader">
      <div className="SidebarDetailHeader_Left">
        <div className="SidebarDetailHeader_Spot">
          Rack {alert.rackId} - {alert.spotId}
        </div>
        <Status
          text={
            alert.danger
              ? '위험'
              : alert.status === 'DONE'
                ? '처리완료'
                : '미확인'
          }
          type={
            alert.danger
              ? 'Danger'
              : alert.status === 'DONE'
                ? 'Complete'
                : 'Caution'
          }
        />
      </div>

      <button onClick={onClose} className="SidebarDetailHeader_CloseBtn">
        <img src={CloseBtn} alt="" />
      </button>
    </div>
  );
};

export default SidebarDetailHeader;
