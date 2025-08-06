import React from 'react';
import './LoginForm.css';

const LoginForm = () => {
  return (
    <div className="LoginForm">
      <div className="LoginForm_Header">
        <div className="LoginForm_Header_Title">
          <img src="../../src/assets/LoginIcon.png" alt="" />
          관리자 인증
        </div>
        <div className="LoginForm_Header_Des">
          이슈 처리를 위해서는 관리자 로그인이 필요합니다
        </div>
      </div>
      <div className="LoginForm_Input"></div>
      <div className="LoginForm_Btn"></div>
    </div>
  );
};

export default LoginForm;
