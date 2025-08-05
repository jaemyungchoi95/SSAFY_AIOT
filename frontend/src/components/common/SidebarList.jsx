import SidebarItem from './SidebarItem';
import './SidebarList.css';
import { useAppStore } from '../../stores/useAppStore';
import { useMemo } from 'react';

const SidebarList = ({ selectedStatus, selectedTime }) => {
  const { alerts, setSelectedAlertId, selectedWarehouseId } = useAppStore();

  const filteredAlerts = useMemo(() => {
    let filtered = Array.isArray(alerts)
      ? alerts.filter((alert) => alert.warehouseId === selectedWarehouseId)
      : [];

    if (selectedStatus === '처리완료') {
      filtered = filtered.filter((alert) => alert.status === 'DONE');
    } else if (selectedStatus === '미확인') {
      filtered = filtered.filter((alert) =>
        ['UNCHECKED', 'Caution'].includes(alert.status),
      );
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
    <div className="SidebarList">
      {filteredAlerts.map((alert) => (
        <SidebarItem
          key={alert.alertId}
          alert={alert}
          onClick={() => setSelectedAlertId(alert.alertId)}
        />
      ))}
    </div>
  );
};

export default SidebarList;
