import React from 'react';
import BootstrapCarousel from './BootstrapCarousel.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import TempInfo from './TempInfo';
import DateInfo from './DateInfo.jsx';

const SidebarDetailContent = ({ alert }) => {
  const imagePaths = [alert.imageNormalUrl, alert.imageThermalUrl].filter(
    Boolean,
  );

  return (
    <div className="SidebarDetailContent py-3 px-3">
      <div className="SidebarDetailContent_Date flex gap-2.5 mb-1">
        <DateInfo createdAt={alert.createdAt} />
      </div>
      <div className="SidebarDetailContent_Temp flex gap-2.5 ml-[-2px] mb-2.5">
        <TempInfo temperature={alert.temperature} />
      </div>
      <div className="SidebarDetailContent_Img flex flex-col justify-center w-[100%] h-52 overflow-hidden">
        <BootstrapCarousel images={imagePaths} />
      </div>
    </div>
  );
};

export default SidebarDetailContent;
