import { useUserStore } from '../../stores/useUserStore';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const username = useUserStore((state) => state.username);
  const nav = useNavigate();

  return (
    <header className="bg-[#20212a] text-[#eaeaf0] flex items-center justify-center md:justify-between py-3 px-5 mb-2">
      <button className="" onClick={() => nav('/')}>
        <img src={logo} alt="Logo" className="logo" />
      </button>

      <div className={'hidden md:flex md:items-center md:gap-8'}>
        <nav className="flex items-center gap-8">
          <button
            className="font-bold cursor-pointer"
            onClick={() => nav('/issue')}
          >
            이슈페이지
          </button>
          <button
            className="font-bold cursor-pointer"
            onClick={() => {
              if (isLoggedIn) {
                // 로그아웃 처리 예시 (간단하게 스토어 상태 변경)
                useUserStore.getState().logout();
                nav('/');
              } else {
                nav('/login');
              }
            }}
          >
            {isLoggedIn ? `${username} 님 / 로그아웃` : '로그인'}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
