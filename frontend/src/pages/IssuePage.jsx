import React from 'react';
import IssueFilter from '../components/common/IssueFilter';
import IssueContent from '../components/common/IssueContent';

const IssuePage = () => {
  return (
    <div className="flex flex-col gap-2.5 h-[calc(100dvh-80px)] mx-5">
      <div className="bg-[#20212a] flex-[0.5] rounded-[15px] pb-3 pt-2">
        <IssueFilter />
      </div>
      <div className="bg-[#20212a] flex-[3] rounded-[15px] flex flex-col overflow-hidden">
        <IssueContent />
      </div>
    </div>
  );
};

export default IssuePage;
