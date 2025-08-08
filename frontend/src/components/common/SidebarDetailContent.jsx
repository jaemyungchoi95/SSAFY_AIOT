import React from 'react';
import './SidebarDetailContent.css';
import BootstrapCarousel from './BootstrapCarousel.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import TempInfo from './TempInfo';
import DateInfo from './DateInfo.jsx';

const SidebarDetailContent = ({ alert }) => {
  const imagePaths = [alert.imageNormalUrl, alert.imageThermalUrl].filter(
    Boolean,
  );

  return (
    <div className="SidebarDetailContent">
      <div className="SidebarDetailContent_Date">
        <DateInfo createdAt={alert.createdAt} />
      </div>
      <div className="SidebarDetailContent_Temp">
        <TempInfo temperature={alert.temperature} />
      </div>
      <div className="SidebarDetailContent_Img">
        <BootstrapCarousel images={imagePaths} />
      </div>
    </div>
  );
};

export default SidebarDetailContent;
