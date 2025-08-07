import React from 'react';
import './ModalContentLeft.css';
import TempInfo from './TempInfo';
import DateInfo from './DateInfo';
import { useAppStore } from '../../stores/useAppStore';

const Modal_Content_Left = () => {
  const { alerts, selectedAlertId } = useAppStore();
  const selectedAlert = alerts.find((a) => a.alertId === selectedAlertId);

  return (
    <div className="Modal_Content_Left">
      <div className="Modal_Content_Left_Title">리포트 내용</div>
      <div className="Modal_Content_Left_Date">
        <DateInfo
          createdAt={selectedAlert.createdAt}
          handledAt={selectedAlert?.handledAt}
        />
      </div>
      <div className="Modal_Content_Left_Temp">
        <TempInfo temperature={selectedAlert.temperature} />
      </div>

      <div className="Modal_Content_Left_Images"></div>
      <img src={selectedAlert.imageThermalUrl} alt="" />
      <img src={selectedAlert.imageNormalUrl} alt="" />
    </div>
  );
};

export default Modal_Content_Left;
