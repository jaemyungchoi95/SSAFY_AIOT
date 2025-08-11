import React, { useState } from 'react';
import './LoginInput.css';
import pwdShow from '../../assets/PwdShow.png';
import pwdNShow from '../../assets/PwdNShow.png';
import { useUserStore } from '../../stores/useUserStore';

const LoginInput = ({ text, autoFocus }) => {
  const isPassword = text === '비밀번호';
  const [showPassword, setShowPassword] = useState(false);
  const setUserName = useUserStore((state) => state.setUserName);
  const setPassword = useUserStore((state) => state.setPassword);

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : 'text';

  const handleChange = (e) => {
    if (isPassword) {
      setPassword(e.target.value);
    } else {
      setUserName(e.target.value);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const placeholderText = isPassword
    ? '비밀번호를 입력해주세요'
    : '아이디를 입력해주세요';

  return (
    <div className="LoginInput">
      <div className="LoginInput_Title">{text}</div>
      <div className="LoginInput_Input">
        <input
          type={inputType}
          className={isPassword ? 'password-input' : 'login-input'}
          autoFocus={autoFocus}
          placeholder={placeholderText}
          onChange={handleChange}
        />
        {isPassword && (
          <button
            type="button"
            className="ToggleButton"
            onClick={toggleShowPassword}
          >
            <img src={showPassword ? pwdShow : pwdNShow} alt="비밀번호 토글" />
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginInput;
