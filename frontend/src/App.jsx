import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import IssuePage from './pages/IssuePage';
import './App.css';
import Header from './components/common/Header';
import { useAppStore } from './stores/useAppStore';

function App() {
  const initializeApp = useAppStore((state) => state.initializeApp);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/issue" element={<IssuePage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
