import React, { useEffect } from 'react';
import './DetailWrite.css';
import ReportBtn from './ReportBtn';
import { useAppStore } from '../../stores/useAppStore';

const DetailWrite = ({ alert, onSubmit }) => {
  const {
    reportHandlerName,
    reportComment,
    reportItemName,
    setReportHandlerName,
    setReportComment,
    setReportItemName,
    resetReportFields,
  } = useAppStore();

  useEffect(() => {
    if (alert) {
      setReportHandlerName(alert.handlerName || '');
      setReportItemName(alert.itemType || '');
      setReportComment(alert.comment || '');
    } else {
      resetReportFields();
    }
  }, [
    alert,
    setReportHandlerName,
    setReportComment,
    setReportItemName,
    resetReportFields,
  ]);

  // 아이템 타입 입력 추가
  const handleItemNameChange = (e) => {
    setReportItemName(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit({
      handlerName: reportHandlerName.trim(),
      itemType: reportItemName.trim(),
      comment: reportComment.trim(),
    });
  };

  return (
    <div className="DetailWrite">
      <div className="DetailWrite_Value">
        <div className="DetailWrite_Emp">
          <div className="DetailWrite_EmpTitle">작업자</div>
          <textarea
            placeholder="작업자 이름을 입력해 주세요"
            className="DetailWrite_Input DetailWrite_EmpInput"
            value={reportHandlerName}
            onChange={(e) => setReportHandlerName(e.target.value)}
          />
        </div>
        <div className="DetailWrite_Item">
          <div className="DetailWrite_ItemTitle">물건명</div>
          <textarea
            name=""
            id=""
            placeholder="물건 종류를 입력해 주세요"
            className="DetailWrite_Input DetailWrite_ItemInput"
            value={reportItemName}
            onChange={handleItemNameChange}
          ></textarea>
        </div>
        <div className="DetailWrite_Message">
          <div className="DetailWrite_MessageTitle">메시지</div>
          <textarea
            placeholder="이슈 상황 및 처리 내용을 입력해 주세요"
            className="DetailWrite_Input DetailWrite_MessageInput"
            value={reportComment}
            onChange={(e) => setReportComment(e.target.value)}
          />
        </div>
      </div>

      <div className="DetailWrite_BtnWrapper">
        <ReportBtn text="등록하기" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default DetailWrite;
