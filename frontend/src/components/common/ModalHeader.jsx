import React from 'react';
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
    <div className="ModalHeader flex justify-between py-3.5 px-7 border-b-2 border-[#424242]">
      <div className="ModalHeader_Left flex gap-5 items-center truncate">
        <div className="Modal_Spot font-bold text-2xl truncate">
          {' '}
          Rack {selectedAlert.rackId} - {selectedAlert.spotId}
        </div>
        <div className="IssueItem_StatusGroup truncate">
          {selectedAlert.danger && <Status text="위험" type="Danger" />}
          <Status text={isCompleteText} type={isCompleteType} />
        </div>
      </div>

      <button className="Modal_CloseBtn" onClick={handleClose}>
        <img src={CloseBtn} alt="닫기 버튼" />
      </button>
    </div>
  );
};

export default ModalHeader;
