import React from 'react';
import './ModalHeader.css';
import Status from './Status'; // ✅ 꼭 import 필요
import { useIssueStore } from '../../stores/useIssueStore';

const ModalHeader = () => {
  const { selectedIssue } = useIssueStore();

  if (!selectedIssue) return null;

  const isCompleteText =
    selectedIssue.status === 'DONE' ? '처리완료' : '미확인';
  const isCompleteType =
    selectedIssue.status === 'DONE' ? 'Complete' : 'Caution';

  return (
    <div className="ModalHeader">
      <div className="ModalHeader_Left">
        <div className="Modal_Spot">Rack-{selectedIssue.rack_id}</div>
        <Status
          text={selectedIssue.is_danger ? '위험' : isCompleteText}
          type={selectedIssue.is_danger ? 'Danger' : isCompleteType}
        />
      </div>

      <img src="../../src/assets/CloseBtn.png" alt="" />
    </div>
  );
};

export default ModalHeader;
