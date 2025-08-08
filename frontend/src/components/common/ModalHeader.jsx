import React from 'react';
import './ModalHeader.css';
import Status from './Status';

import CloseBtn from '../../assets/CloseBtn.png';

import { useAppStore } from '../../stores/useAppStore';

const ModalHeader = () => {
  const { alerts, selectedAlertId, setSelectedAlertId } = useAppStore();
  const selectedAlert = alerts.find(
    (alert) => alert.alertId === selectedAlertId,
  );

  if (!selectedAlert) return null;

  const isCompleteText =
    selectedAlert.status === 'DONE' ? '처리완료' : '미확인';
  const isCompleteType =
    selectedAlert.status === 'DONE' ? 'Complete' : 'Caution';

  const handleClose = () => {
    setSelectedAlertId(null);
  };

  return (
    <div className="ModalHeader">
      <div className="ModalHeader_Left">
        <div className="Modal_Spot">Rack-{selectedAlert.rackId}</div>
        <Status
          text={selectedAlert.danger ? '위험' : isCompleteText}
          type={selectedAlert.danger ? 'Danger' : isCompleteType}
        />
      </div>

      <button className="Modal_CloseBtn" onClick={handleClose}>
        <img src={CloseBtn} alt="닫기 버튼" />
      </button>
    </div>
  );
};

export default ModalHeader;
