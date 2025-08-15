import React from 'react';
import ModalHeader from './ModalHeader';
import Modal_Content_Left from './ModalContentLeft';
import Modal_Content_Right from './ModalContentRight';

const IssueModal = ({ onClose }) => {
  return (
    <div className="IssueModal_Backdrop flex items-center justify-center z-[1000] fixed top-0 left-0 w-[100%] h-[100%] bg-[rgba(0,0,0,0.4)]"
         onClick={onClose}>
      <div className="IssueModal flex flex-col bg-[#20212a] rounded-2xl w-[90vw] h-[90vh] max-w-[1800px] border-2 border-[#424242]" onClick={(e) => e.stopPropagation()}>
        <div className="Modal_Header flex-shrink-0 mb-3">
          <ModalHeader />
        </div>
        <div className="Modal_Content flex flex-1 overflow-hidden mb-3 gap-4">
          <div className="Modal_Content_Left_Box border-r-2 border-[#424242] flex-3 min-w-0">
            <Modal_Content_Left />
          </div>
          <div className="Modal_Content_Right_Box flex-1 min-w-0">
            <Modal_Content_Right />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueModal;
