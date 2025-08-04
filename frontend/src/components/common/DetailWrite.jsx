import React from 'react';
import './DetailWrite.css';
import ReportBtn from './ReportBtn';
import { useState, useEffect } from 'react';

const DetailWrite = ({ report, onSubmit }) => {
  const [content, setContent] = useState('');
  const [empName, setEmpName] = useState('');
  useEffect(() => {
    if (report) {
      setContent(report.comment || '');
      setEmpName(report.handlerName || '');
    }
  }, [report]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleEmpNameChange = (e) => {
    setEmpName(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit({
      handlerName: empName,
      comment: content,
      reportId: report?.id || null,
    });
  };

  return (
    <div className="DetailWrite">
      <div className="DetailWrite_Value">
        <div className="DetailWrite_Emp">
          <div className="DetailWrite_EmpTitle">작업자</div>
          <textarea
            name=""
            id=""
            placeholder="작업자 이름을 입력해 주세요"
            className="DetailWrite_Input DetailWrite_EmpInput"
            value={empName}
            onChange={handleEmpNameChange}
          ></textarea>
        </div>
        <div className="DetailWrite_Message">
          <div className="DetailWrite_MessageTitle">메시지</div>
          <textarea
            name=""
            id=""
            placeholder="이슈 상황 및 처리 내용을 입력해 주세요"
            className="DetailWrite_Input DetailWrite_MessageInput"
            value={content}
            onChange={handleContentChange}
          ></textarea>
        </div>
      </div>

      <div className="DetailWrite_BtnWrapper">
        <ReportBtn text={'등록하기'} onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default DetailWrite;
