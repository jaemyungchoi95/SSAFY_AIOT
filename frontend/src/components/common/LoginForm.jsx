import React from 'react';
import './LoginForm.css';
import LoginInput from './LoginInput';

import LoginIcon from '../../assets/LoginIcon.png';

const LoginForm = () => {
  return (
    <div className="LoginForm">
      <div className="LoginForm_Header">
        <div className="LoginForm_Header_Title">
          <img src={LoginIcon} alt="" />
          관리자 인증
        </div>
        <div className="LoginForm_Header_Des">
          이슈 처리를 위해서는 관리자 로그인이 필요합니다
        </div>
      </div>
      <div className="LoginForm_Input">
        <LoginInput text={'아이디'} autoFocus={true} />
        <LoginInput text={'비밀번호'} />
      </div>
      <div className="LoginForm_Btn">
        <button>로그인</button>
      </div>
      <hr />
      <div className="LoginForm_Footer">
        아이디 또는 비밀번호 분실시 담당자에게 문의하세요.
      </div>
    </div>
  );
};

export default LoginForm;
