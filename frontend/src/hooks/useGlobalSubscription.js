import { useEffect } from 'react';
import { useSocketStore } from '../stores/useSocketStore';
import { useAlertStore } from '../stores/useAlertStore';
import { useAppStore } from '../stores/useAppStore';

export function useGlobalSubscription() {
  const client = useSocketStore((state) => state.client);
  const isConnected = useSocketStore((state) => state.isConnected);
  const addSocketMap = useAlertStore((state) => state.addSocketMap);

  const updateMapDataFromSocket = useAppStore(
    (state) => state.updateMapDataFromSocket,
  );

  useEffect(() => {
    // 만약 클라이언트 연결이 안되어있으면 동작하지 않는다
    if (!client || !isConnected) return;

    const subscription = client.subscribe('/topic/warehouses/map', (msg) => {
      const mapData = JSON.parse(msg.body);
      console.log('전체 맵 생성 알림 수신 : ', mapData);
      // 1. Toast 알림을 위한 액션 호출
      addSocketMap(mapData);

      // 2. 실시간 맵 교채를 위해 액션 호출
      updateMapDataFromSocket(mapData);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [client, isConnected, addSocketMap, updateMapDataFromSocket]);
}
