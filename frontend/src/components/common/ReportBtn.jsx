import React from 'react';
import './ReportBtn.css';

const ReportBtn = ({ text }) => {
  return (
    <button className="ReportBtn">
      <img src="../../src/assets/UpdateIcon.png" alt="" />
      {text}
    </button>
  );
};

export default ReportBtn;
