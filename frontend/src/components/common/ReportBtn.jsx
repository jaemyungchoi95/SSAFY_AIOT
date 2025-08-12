import React from 'react';
import './ReportBtn.css';
import UpdateIcon from '../../assets/UpdateIcon.png';

const ReportBtn = ({ text, onClick }) => {
  return (
    <button className="ReportBtn" onClick={onClick}>
      <img src={UpdateIcon} alt="" />
      {text}
    </button>
  );
};

export default ReportBtn;
