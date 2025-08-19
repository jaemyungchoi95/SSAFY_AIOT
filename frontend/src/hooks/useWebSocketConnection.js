import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useSocketStore } from '../stores/useSocketStore';

export function useWebSocketConnection() {
  const { setClient, setConnected } = useSocketStore();

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`https://api.are-u-hot.kro.kr/api/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('📡 WebSocket 연결됨');
        setConnected(true);
      },
      onStompError: (frame) => {
        console.error('STOMP Error', frame);
        setConnected(false);
      },
      onDisconnect: () => {
        console.log('🔌 WebSocket 연결 해제됨.');
        // 4. 연결이 끊어지면, 전역 상태 isConnected를 false로 업데이트합니다.
        setConnected(false);
      },
    });

    setClient(client);

    client.activate();

    return () => {
      client.deactivate();
      console.log('🔌 WebSocket 연결 해제됨');
    };
  }, [setClient, setConnected]);
}
