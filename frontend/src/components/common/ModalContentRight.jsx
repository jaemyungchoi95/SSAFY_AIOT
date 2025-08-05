import React from 'react';
import './ModalContentRIght.css';
import DetailWrite from './DetailWrite';

const Modal_Content_Right = () => {
  return (
    <div className="Modal_Content_Right">
      <div className="Modal_Content_Right_Title">처리 내역 등록</div>
      <div className="Modal_Content_Right_Content">
        <DetailWrite />
      </div>
    </div>
  );
};

export default Modal_Content_Right;
