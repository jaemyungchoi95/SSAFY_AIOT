import React, { useEffect } from 'react';
import './LoginForm.css';
import LoginInput from './LoginInput';
import { useUserStore } from '../../stores/useUserStore';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '../../assets/LoginIcon.png';

const LoginForm = () => {
  const login = useUserStore((state) => state.login);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const error = useUserStore((state) => state.error);
  const nav = useNavigate();

  const handleLoginClick = async () => {
    // console.log('로그인 버튼 클릭');

    try {
      await login();
      // console.log('로그인 완료');
    } catch (error) {
      console.error('login 함수 실행 중 에러:', error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleLoginClick();
  };

  useEffect(() => {
    if (isLoggedIn) {
      nav('/');
    }
  }, [isLoggedIn, nav]);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  return (
    <form className="LoginForm" onSubmit={handleFormSubmit}>
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
      <div>
        <button className="LoginForm_Btn" onClick={handleLoginClick}>
          로그인
        </button>
      </div>
      <hr />
      <div className="LoginForm_Footer">
        아이디 또는 비밀번호 분실시 담당자에게 문의하세요.
      </div>
    </form>
  );
};

export default LoginForm;
