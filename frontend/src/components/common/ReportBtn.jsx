import React from 'react';
import './ReportBtn.css';
import UpdateIcon from '../../assets/UpdateIcon.png';
import CloseBtn from '../../assets/CloseBtn.png';

const ReportBtn = ({ text, onClick }) => {
  const getSeletIcon = () => {
    if (text == '수정하기') {
      return UpdateIcon;
    }
    if (text == '등록하기') {
      return UpdateIcon;
    }
    if (text == '취소하기') {
      return CloseBtn;
    }
    return null;
  };

  const selectedIcon = getSeletIcon();

  return (
    <button className="ReportBtn" onClick={onClick}>
      {selectedIcon && ( // 아이콘이 있을 때만 img 태그 렌더링
        <img
          src={selectedIcon}
          alt=""
          // 조건부 클래스 적용: '취소하기'일 때 'ReportBtn_Icon_Small' 클래스 추가
          className={`ReportBtn_Icon ${text === '취소하기' ? 'ReportBtn_Icon_Small' : ''}`}
        />
      )}
      {text}
    </button>
  );
};

export default ReportBtn;
