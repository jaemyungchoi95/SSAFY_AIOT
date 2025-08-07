import React from 'react';
import './IssueModal.css';
import ModalHeader from './ModalHeader';
import Modal_Content_Left from './ModalContentLeft';
import Modal_Content_Right from './ModalContentRight';

const IssueModal = ({ onClose }) => {
  return (
    <div className="IssueModal_Backdrop" onClick={onClose}>
      <div className="IssueModal" onClick={(e) => e.stopPropagation()}>
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
