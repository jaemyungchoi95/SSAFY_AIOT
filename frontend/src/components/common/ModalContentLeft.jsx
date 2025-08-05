import React from 'react';
import './ModalContentLeft.css';
import TempInfo from './TempInfo';
import { useIssueStore } from '../../stores/useIssueStore';
import DateInfo from './DateInfo';

const Modal_Content_Left = () => {
  const { selectedIssue, selectedReport } = useIssueStore();

  return (
    <div className="Modal_Content_Left">
      <div className="Modal_Content_Left_Title">리포트 내용</div>
      <div className="Modal_Content_Left_Date">
        <DateInfo
          createdAt={selectedIssue.created_at}
          handledAt={selectedReport?.handled_at}
        />
      </div>
      <div className="Modal_Content_Left_Temp">
        <TempInfo temperature={selectedIssue.temperature} />
      </div>

      <div className="Modal_Content_Left_Images"></div>
      <img src={selectedIssue.image_normal_url} alt="" />
      <img src={selectedIssue.image_thermal_url} alt="" />
    </div>
  );
};

export default Modal_Content_Left;
