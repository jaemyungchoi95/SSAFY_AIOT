import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import IssuePage from './pages/IssuePage';
import './App.css';
import Header from './components/common/Header';
import { useAppStore } from './stores/useAppStore';
import { useWebSocketConnection } from './hooks/useWebSocketConnection';

function App() {
  const initializeApp = useAppStore((state) => state.initializeApp);
  const location = useLocation();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // 1. 알림 권한 요청 : 앱 초기화 시점에서 한 번
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          console.log("알림 권한:", permission);
        });
      }
    }
  }, []);

  return (
    <div className="App">
      {/* 로그인 경로면 Header 안 보여줌 */}
      {location.pathname !== '/login' && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/issue" element={<IssuePage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default function WrappedApp() {
  useWebSocketConnection();

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
