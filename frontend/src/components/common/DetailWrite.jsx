import React from 'react';
import './DetailWrite.css';
import ReportBtn from './ReportBtn';
import { useState, useEffect } from 'react';

const DetailWrite = ({ alert, onSubmit, onCancel }) => {
  const [content, setContent] = useState('');
  const [empName, setEmpName] = useState('');
  const [itemName, setItemName] = useState('');

  useEffect(() => {
    if (alert) {
      setContent(alert.comment || '');
      setEmpName(alert.handlerName || '');
      setItemName(alert.itemType || '');
    }
  }, [alert]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleEmpNameChange = (e) => {
    setEmpName(e.target.value);
  };

  // 아이템 타입 입력 추가
  const handleItemNameChange = (e) => {
    setItemName(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit({
      handlerName: empName,
      comment: content,
      itemType: itemName,
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
        <div className="DetailWrite_Item">
          <div className="DetailWrite_ItemTitle">물건명</div>
          <textarea
            name=""
            id=""
            placeholder="물건 종류를 입력해 주세요"
            className="DetailWrite_Input DetailWrite_ItemInput"
            value={itemName}
            onChange={handleItemNameChange}
          ></textarea>
        </div>
        <div className="DetailWrite_Message">
          <div className="DetailWrite_MessageTitle">메시지</div>
          <textarea
            name=""
            id=""
            placeholder="처리 내용을 입력해 주세요"
            className="DetailWrite_Input DetailWrite_MessageInput"
            value={content}
            onChange={handleContentChange}
          ></textarea>
        </div>
      </div>

      <div className="DetailWrite_BtnWrapper">
        <ReportBtn text={'취소하기'} onClick={onCancel} />
        <ReportBtn text={'등록하기'} onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default DetailWrite;
