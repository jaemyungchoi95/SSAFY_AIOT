import React from 'react'
import './Header.css'
// import axios from 'axios';
import { useEffect, useState } from 'react'
// import useUserStore from '.. /../stores/useUserStore'

const Header = () => {

  const [isLogin, setIsLogin] = useState(false);
  // const { userId, username } = useUserStore();

  // useEffect(() => {
  //   axios.get((response) => {
  //     const data = response.data;
  //   })
  // }, [])

  return (
    <div className='Header'>
        <div className='Header_Logo'>
          <img src="../../src/assets/logo.png" alt="Logo" className='logo' />
        </div>
        <div className='Header_Login'>
          로그인
        </div>
    </div>
  )
}

export default Header