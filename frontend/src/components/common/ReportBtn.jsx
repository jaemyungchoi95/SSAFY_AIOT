import React from 'react';
import './ReportBtn.css';

const ReportBtn = ({ text, onClick }) => {
  return (
    <button className="ReportBtn" onClick={onClick}>
      <img src="../../src/assets/UpdateIcon.png" alt="" />
      {text}
    </button>
  );
};

export default ReportBtn;
