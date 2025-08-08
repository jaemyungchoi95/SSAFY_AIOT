import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import IssuePage from './pages/IssuePage';
import './App.css';
import Header from './components/common/Header';
import { useAppStore } from './stores/useAppStore';
import Test from './pages/Test';
import { useWebSocketConnection } from './hooks/useWebSocketConnection';

function App() {
  const initializeApp = useAppStore((state) => state.initializeApp);
  const location = useLocation();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return (
    <div className="App">
      {/* 로그인 경로면 Header 안 보여줌 */}
      {location.pathname !== '/login' && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/issue" element={<IssuePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<Test />} />
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
