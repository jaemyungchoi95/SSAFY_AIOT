import React from 'react';
import './SidebarDetailContent.css';
import FormatDateTime from '../../utils/FormatDateTime';
import BootstrapCarousel from './BootstrapCarousel.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import TempInfo from './TempInfo';
import DateInfo from './DateInfo.jsx';

const SidebarDetailContent = ({ issue, report }) => {
  const imagePaths = [issue.image_normal_url, issue.image_thermal_url].filter(
    Boolean,
  );

  return (
    <div className="SidebarDetailContent">
      <div className="SidebarDetailContent_Date">
        <DateInfo createdAt={issue.created_at} handledAt={report?.handled_at} />
      </div>
      <div className="SidebarDetailContent_Temp">
        <TempInfo temperature={issue.temperature} />
      </div>
      <div className="SidebarDetailContent_Img">
        <BootstrapCarousel images={imagePaths} />
      </div>
    </div>
  );
};

export default SidebarDetailContent;
