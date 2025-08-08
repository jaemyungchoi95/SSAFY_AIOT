import React from 'react';
import './Login.css';
import LoginForm from '../components/common/LoginForm';

const Login = () => {
  return (
    <div className="Login">
      <div className="Login_Logo">
        <img src="../../src/assets/LoginLogo.png" alt="" />
      </div>
      <div className="Login_form">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
