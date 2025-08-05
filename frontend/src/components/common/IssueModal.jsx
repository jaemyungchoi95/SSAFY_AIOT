import React from 'react';
import './IssueModal.css';
import ModalHeader from './ModalHeader';
import Modal_Content_Left from './ModalContentLeft';
import Modal_Content_Right from './ModalContentRight';

const IssueModal = ({ issue, report, onClose }) => {
  if (!issue) return null;

  return (
    <div className="IssueModal_Backdrop" onClick={onClose}>
      <div className="IssueModal" onClick={(e) => e.stopPropagation()}>
        {/* <h2>Rack-{issue.rack_id} 상세 정보</h2>
        <p>온도: {issue.temperature}°C</p>
        <p>상태: {issue.status}</p>
        <p>위험 여부: {issue.is_danger ? '위험' : '정상'}</p>
        {report && (
          <>
            <p>처리자: {report.handler_name}</p>
            <p>코멘트: {report.comment}</p>
          </>
        )}
        <button onClick={onClose}>닫기</button> */}
        <div className="Modal_Header">
          <ModalHeader />
        </div>
        <div className="Modal_Content">
          <div className="Modal_Content_Left_Box">
            <Modal_Content_Left />
          </div>
          <div className="Modal_Content_Right_Box">
            <Modal_Content_Right />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueModal;
