import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import IssuePage from './pages/IssuePage';
import './App.css';
import Header from './components/common/Header';
import { useAppStore } from './stores/useAppStore';
import { useWebSocketConnection } from './hooks/useWebSocketConnection';

import { onMessage, getToken, messaging } from './utils/firebase';
import { saveFcmToken } from './api';

function App() {
  const initializeAppData = useAppStore((state) => state.initializeAppData);
  const selectedWarehouseId = useAppStore((state) => state.selectedWarehouseId);
  const location = useLocation();

  // 초기 정보 로딩
  useEffect(() => {
    initializeAppData();
  }, [initializeAppData]);

  // PWA 서비스워커 등록
  const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          // console.log('✅ Service Worker Registered');
          // console.dir(registration);
        })
        .catch((err) =>
          console.error('Service Worker registration failed', err),
        );
    }
  };

  // 3️⃣ FCM 권한 요청 + 토큰 발급 + 백엔드 저장
  const initFcm = async () => {
    const messagingResolve = await messaging();
    if (!messagingResolve || !('Notification' in window)) return;

    // 1. 현재 권한 확인
    const permission = Notification.permission;

    // console.log('permission 확인 : ', permission);
    // 권한이 'granted'이면서 토큰이 이미 RDB에 있으면 발급 X
    if (permission === 'granted') {
      const token = await getToken(messagingResolve);
      if (token) {
        // 백엔드에 토큰 저장 (중복 체크는 백엔드에서)
        await saveFcmToken({ token });
      }
      return;
    }

    // 권한이 'default'일 경우 요청
    if (permission === 'default') {
      const newPermission = await Notification.requestPermission();
      if (newPermission === 'granted') {
        const token = await getToken(messagingResolve);
        if (token) await saveFcmToken({ token });
      }
    }
  };

  // 4️⃣ 메시지 수신 리스너
  const setupOnMessageListener = async () => {
    const messagingResolve = await messaging();
    if (!messagingResolve) return;

    onMessage(messagingResolve, (payload) => {
      // console.log('📩 payload received:', payload);
      if (Notification.permission !== 'granted') return;

      const title = payload.data?.title || '알림';
      const body = payload.data?.body || '';
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
      notification.onclick = () => {
        window.open(payload.data?.redirectUri || '/', '_blank')?.focus();
      };
    });
  };

  //
  useEffect(() => {
    registerServiceWorker();
    setupOnMessageListener();
  }, []);

  useEffect(() => {
    // console.log('🟢 selectedWarehouseId changed:', selectedWarehouseId);
    initFcm();
  }, [selectedWarehouseId]);

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
