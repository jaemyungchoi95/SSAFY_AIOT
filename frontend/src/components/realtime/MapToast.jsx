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
      className={`bg-[#5B5C67] border-2 border-[#FFBC5F] rounded-[15px] w-[400px] h-[80px] flex  gap-1.5`}
    >
      <div className="flex items-center justify-center w-[15%]">
        <div className="border-3 border-[#FFBC5F] rounded-full w-[30px] h-[30px] flex justify-center text-center font-bold text-[#FFBC5F]">
          !
        </div>
      </div>
      <div className="w-[70%] flex items-center gap-2">
        <p className="text-[18px] font-bold m-0 p-0">
          맵 생성이 완료되었습니다!
        </p>
        <p className="text-xs sm:text-sm md:text-base font-medium m-0 p-0 text-[#C2C2C2]">
          창고 ID: {warehouseId} ({formattedTime})
        </p>
      </div>
      <div className="w-[15%] flex justify-center items-center">
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
