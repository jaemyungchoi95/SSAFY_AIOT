import React from 'react';
import IssueList from './IssueList';

const IssueContent = () => {
  return (
    <div className="IssueContent p-3 h-[100%] overflow-y-auto scrollbar-none">
      <IssueList />
    </div>
  );
};

export default IssueContent;
