import React from 'react';
import { useAlertStore } from '../../stores/useAlertStore';

const MapToast = ({ map }) => {
  const { dismissMap } = useAlertStore();

  // 방어코드 추가
  if (!map) {
    console.warn("MapToast received an undefined or null 'map' prop.");
    return null;
  }

  const { id, warehouseId, createdAt } = map;

  // createdAt을 보기 좋은 시간 형식으로 변환
  const formattedTime = new Date(createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <section
      className={
        'bg-[#5B5C67] border-2 border-[#FFBC5F] rounded-[15px] w-70 max-w-[400px] h-20 flex items-center gap-2 px-2'
      }
    >
      <div className="flex-shrink-0 px-2">
        <div className="border-[3px] border-[#FFBC5F] rounded-full w-[30px] h-[30px] flex justify-center text-center font-bold text-[#FFBC5F]">
          !
        </div>
      </div>
      <div className="flex flex-col flex-1 justify-center min-w-0">
        <p className="text-sm md:text-base font-bold m-0 p-0 truncate">
          맵 생성 완료!
        </p>
        <p className="text-xs md:text-sm font-medium m-0 p-0 text-[#C2C2C2] truncate">
          창고 ID: {warehouseId} ({formattedTime})
        </p>
      </div>
      <div className="flex-shrink-0 px-2">
        <button
          className="text-[#C2C2C2] !text-3xl m-0 pb-2 text-center"
          onClick={() => dismissMap(id)}
        >
          &times;
        </button>
      </div>
    </section>
  );
};

export default MapToast;
