import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// MSW 활성화 함수
async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }
  // MSW 브라우저 워커를 가져온다.
  const { worker } = await import('./mocks/browser.js');

  return worker.start({
    // 처리되지 않은 요청은 실제 네트워크로 보내도록 허용
    onUnhandledRequest: 'bypass',
  });
}

const root = createRoot(document.getElementById('root'));

// MSW 활성화가 완료된 후에 React 앱을 렌더링합니다.
// enableMocking().then(() => {
//   root.render(
//     // <StrictMode>
//     <App />,
//     // </StrictMode>,
//   );
// });

// 실제 서버데이터 호출
root.render(
  <StrictMode>
    <App />,
  </StrictMode>,
);
