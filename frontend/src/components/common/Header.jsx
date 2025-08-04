import { useUserStore } from '../../stores/useUserStore';
import './Header.css';
import { useNavigate } from 'react-router-dom';

// import useUserStore from '.. /../stores/useUserStore';

// 작업 진행중인 페이지!!!

const Header = () => {
  // const [isLoggedIn, username] = useUserStore();
  const nav = useNavigate();

  return (
    <div className="Header">
      <button className="Header_Logo" onClick={() => nav('/')}>
        <img src="../../src/assets/logo.png" alt="Logo" className="logo" />
      </button>
      <button className="Header_Issue" onClick={() => nav('/issue')}>
        이슈페이지
      </button>

      {/* <div
        className="Header_Login"
        onClick={() => {
          if (isLoggedIn) {
            // 로그아웃 처리 예시 (간단하게 스토어 상태 변경)
            useUserStore.getState().logout();
          } else {
            nav('/login');
          }
        }}
      >
        {isLoggedIn ? `${username} 님 (로그아웃)` : '로그인'}
      </div> */}
    </div>
  );
};

export default Header;
