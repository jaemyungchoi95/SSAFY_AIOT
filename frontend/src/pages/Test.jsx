import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const Test = () => {
  const [warehouseId, setWarehouseId] = useState(1);
  const [messages, setMessages] = useState([]);
  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);

  // 연결 및 초기 구독
  useEffect(() => {
    console.log('페이지 렌더링 시작');
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/api/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket 연결 완료');
        stompClientRef.current = client;
        subscribeToWarehouse(warehouseId);
      },
      onStompError: (frame) => {
        console.error('STOMP 에러:', frame);
      },
    });

    client.activate(); // 여기서 실패중!!
    console.log('activate 시도 후');

    // clean-up
    // 단, 이 코드는 참고만 해주세요 (아래 설명 추가)
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      client.deactivate();
    };
  }, []);

  // warehouseId 변경 시 구독 재설정
  useEffect(() => {
    console.log('구독 시도');
    if (stompClientRef.current?.connected) {
      console.log('연결');
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
      subscribeToWarehouse(warehouseId);
    } else {
      console.log('미연결 상태');
    }
  }, [warehouseId]);

  const subscribeToWarehouse = (id) => {
    const topic = `/topic/warehouses/${id}/position`;
    console.log(warehouseId, '번 구독 시작');
    const sub = stompClientRef.current.subscribe(topic, (message) => {
      console.log('수신 시작');
      const data = JSON.parse(message.body);
      console.log('수신 데이터:', data);
      setMessages((prev) => [...prev, data]);
    });
    subscriptionRef.current = sub;
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>WebSocket 테스트 페이지</h2>
      <label>
        창고 ID:
        <input
          type="number"
          value={warehouseId}
          onChange={(e) => setWarehouseId(Number(e.target.value))}
          style={{ marginLeft: '0.5rem' }}
        />
      </label>

      <h4 style={{ marginTop: '1rem' }}>수신 메시지:</h4>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{JSON.stringify(msg)}</li>
        ))}
      </ul>
    </div>
  );
};

export default Test;
