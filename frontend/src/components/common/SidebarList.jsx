import SidebarItem from './SidebarItem';
import { useAppStore } from '../../stores/useAppStore';
import { useFilterStore } from '../../stores/useFilterStore';
import { useMemo } from 'react';

const SidebarList = () => {
  const { alerts, selectedWarehouseId, fetchDetailAlert } = useAppStore();
  const { selectedStatus, selectedTime } = useFilterStore();

  const filteredAlerts = useMemo(() => {
    let filtered = Array.isArray(alerts)
      ? alerts.filter((alert) => alert.warehouseId === selectedWarehouseId)
      : [];

    if (selectedStatus === '처리완료') {
      filtered = filtered.filter((alert) => alert.status === 'DONE');
    } else if (selectedStatus === '미확인') {
      filtered = filtered.filter((alert) => alert.status === 'UNCHECKED');
    } else if (selectedStatus === '위험') {
      filtered = filtered.filter((alert) => alert.danger === true);
    }

    // 원본 배열을 수정하지 않도록 복사본을 만들어서 정렬함
    const sorted = [...filtered].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return selectedTime === '최신순' ? timeB - timeA : timeA - timeB;
    });
    // 복사하여 정렬한 배열을 반환
    return sorted;
  }, [alerts, selectedWarehouseId, selectedStatus, selectedTime]);

  return (
    <div className="SidebarList flex flex-col w-[100%] truncate">
      {filteredAlerts.map((alert) => (
        <SidebarItem
          key={alert.alertId}
          alert={alert}
          onClick={() => fetchDetailAlert(alert.alertId)}
        />
      ))}
    </div>
  );
};

export default SidebarList;
