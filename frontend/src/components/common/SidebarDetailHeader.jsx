import React from 'react';
import './SidebarDetailHeader.css';
import Status from './Status';

const SidebarDetailHeader = ({ issue, onClose }) => {
  return (
    <div className="SidebarDetailHeader">
      <div className="SidebarDetailHeader_Left">
        <div className="SidebarDetailHeader_Spot">Rack-{issue.rackId}</div>
        <Status
          text={
            issue.isDanger
              ? '위험'
              : issue.status === 'DONE'
                ? '처리완료'
                : '미확인'
          }
          type={
            issue.isDanger
              ? 'Danger'
              : issue.status === 'DONE'
                ? 'Complete'
                : 'Caution'
          }
        />
      </div>

      <button onClick={onClose} className="SidebarDetailHeader_CloseBtn">
        <img src="../../src/assets/CloseBtn.png" alt="" />
      </button>
    </div>
  );
};

export default SidebarDetailHeader;
