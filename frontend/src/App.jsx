import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import IssuePage from './pages/IssuePage';
import './App.css';
import Header from './components/common/Header';
import { useAppStore } from './stores/useAppStore';
import { useWebSocketConnection } from './hooks/useWebSocketConnection';

import { onMessage, getToken } from 'firebase/messaging';
import { messaging } from './utils/firebase';

function App() {
  const initializeAppData = useAppStore((state) => state.initializeAppData);
  const location = useLocation();

  // 초기 정보 로딩
  useEffect(() => {
    initializeAppData();
  }, [initializeAppData]);

  //
  useEffect(() => {
    function registerServiceWorker() {
      if (typeof window !== 'undefined') {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker
            .register('/firebase-messaging-sw.js')
            .then((registration) => {
              console.log('Service Worker Registered');
              console.dir(registration);
            });
        }
      }
    }
    const requestPermission = async () => {
      const messagingResolve = await messaging();
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications.');
        return;
      }
      if (messagingResolve) {
        const token = await getToken(messagingResolve);
        console.log('token : ', token);
      }
    };

    const onMessageListener = async () => {
      const messagingResolve = await messaging();
      if (messagingResolve) {
        onMessage(messagingResolve, (payload) => {
          console.log('payload : ', payload);
          if (!('Notification' in window)) {
            return;
          }
          const permission = Notification.permission;
          const title = payload.data?.title;
          const body = payload.data?.body;
          if (permission === 'granted') {
            // console.log("payload", payload);
            if (payload.data) {
              const notification = new Notification(title, {
                body,
                icon: '/favicon.ico',
              });
              notification.onclick = () => {
                window.open(payload.data.redirectUri, '_blank')?.focus();
              };
            }
          }
        });
      }
    };
    registerServiceWorker();
    requestPermission();
    onMessageListener();
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
