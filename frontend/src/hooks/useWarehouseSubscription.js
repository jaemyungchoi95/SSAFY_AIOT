import { useEffect, useRef } from 'react';
import { useSocketStore } from '../stores/useSocketStore';

export function useWarehouseSubscription({
  warehouseId,
  onPosition,
  onAlert,
  // onMap, // 전역관리로 전환함에 따라 주석처리 진행
}) {
  const subscriptionsRef = useRef({});

  // 2. 스토어에서 클라이언트 인스턴스와 '연결 상태'를 가져옵니다.
  const client = useSocketStore((state) => state.client);
  const isConnected = useSocketStore((state) => state.isConnected);

  useEffect(() => {
    if (!client || !isConnected) return;

    // 구독 설정
    subscriptionsRef.current.position = client.subscribe(
      `/topic/warehouses/${warehouseId}/position`,
      (msg) => onPosition?.(JSON.parse(msg.body)),
    );

    subscriptionsRef.current.alert = client.subscribe(
      `/topic/warehouses/${warehouseId}/alert`,
      (msg) => onAlert?.(JSON.parse(msg.body)),
    );

    // 전역 관리로 전환
    // subscriptionsRef.current.map = client.subscribe(
    //   `/topic/warehouses/${warehouseId}/map`,
    //   (msg) => onMap?.(JSON.parse(msg.body)),
    // );

    console.log(`📬 창고 ${warehouseId} 구독 시작`);

    return () => {
      // 이전 구독 해제
      Object.values(subscriptionsRef.current).forEach((sub) =>
        sub?.unsubscribe(),
      );
      subscriptionsRef.current = {};
      console.log(`📴 창고 ${warehouseId} 구독 해제`);
    };
  }, [warehouseId, client, isConnected, onPosition, onAlert]);
  // 의존성배열에서 onMap 삭제
}
