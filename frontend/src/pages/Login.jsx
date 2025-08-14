import React from 'react';
import LoginForm from '../components/common/LoginForm';
import LoginLogo from '../assets/LoginLogo.png';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const nav = useNavigate();

  return (
    <div className="Login flex justify-center items-center h-[100vh] text-center flex-col bg-[#20212a]">
      <div className="Login_Logo mb-7">
        <button onClick={() => nav('/')}>
          <img src={LoginLogo} alt="" />
        </button>
      </div>
      <div className="w-[35%]">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
