import React from 'react';
import './Login.css';
import LoginForm from '../components/common/LoginForm';
import LoginLogo from '../assets/LoginLogo.png';

const Login = () => {
  return (
    <div className="Login">
      <div className="Login_Logo">
        <img src={LoginLogo} alt="" />
      </div>
      <div className="Login_form">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
