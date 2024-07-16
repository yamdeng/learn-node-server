
import withSourceView from '@/hooks/withSourceView';
import { useEffect } from 'react';
/* store 경로를 변경해주세요. */
import useAirplaneFormStore from '@/stores/guide/useAirplaneFormStore';

function AirplaneForm() {

  /* formStore state input 변수 */
  const {  id, createUserId, updateUserId, createDate, updateDate, isDelete, name, nameEn, airCode, countryCode, lastPainDate, lastFixDate, size, errors, changeInput, save, clear } =
    useAirplaneFormStore();

  useEffect(() => {
    return clear();
  }, []);

  return (
    <>
      <div className="grid-one-container">
                
        <div className="div-label">ID :</div>
        <div className="div-input">
          <input
            type="text"
            className={errors.id ? 'input-not-valid' : ''}
            placeholder="ID"
            name="id"
            id="id"
            value={id}
            onChange={(event) => changeInput('id', event.target.value)}
          />
          {errors.id ? <span className="error_message">{errors.id}</span> : null}
        </div>        
                
        <div className="div-label">등록자 ID :</div>
        <div className="div-input">
          <input
            type="text"
            className={errors.createUserId ? 'input-not-valid' : ''}
            placeholder="등록자 ID"
            name="createUserId"
            id="createUserId"
            value={createUserId}
            onChange={(event) => changeInput('createUserId', event.target.value)}
          />
          {errors.createUserId ? <span className="error_message">{errors.createUserId}</span> : null}
        </div>        
                
        <div className="div-label">수정자 ID :</div>
        <div className="div-input">
          <input
            type="text"
            className={errors.updateUserId ? 'input-not-valid' : ''}
            placeholder="수정자 ID"
            name="updateUserId"
            id="updateUserId"
            value={updateUserId}
            onChange={(event) => changeInput('updateUserId', event.target.value)}
          />
          {errors.updateUserId ? <span className="error_message">{errors.updateUserId}</span> : null}
        </div>        
                
        <div className="div-label">등록일 :</div>
        <div className="div-input">
          <input
            type="text"
            className={errors.createDate ? 'input-not-valid' : ''}
            placeholder="등록일"
            name="createDate"
            id="createDate"
            value={createDate}
            onChange={(event) => changeInput('createDate', event.target.value)}
          />
          {errors.createDate ? <span className="error_message">{errors.createDate}</span> : null}
        </div>        
                
        <div className="div-label">수정일 :</div>
        <div className="div-input">
          <input
            type="text"
            className={errors.updateDate ? 'input-not-valid' : ''}
            placeholder="수정일"
            name="updateDate"
            id="updateDate"
            value={updateDate}
            onChange={(event) => changeInput('updateDate', event.target.value)}
          />
          {errors.updateDate ? <span className="error_message">{errors.updateDate}</span> : null}
        </div>        
                
        <div className="div-label">삭제 여부 :</div>
        <div className="div-input">
          <input
            type="text"
            className={errors.isDelete ? 'input-not-valid' : ''}
            placeholder="삭제 여부"
            name="isDelete"
            id="isDelete"
            value={isDelete}
            onChange={(event) => changeInput('isDelete', event.target.value)}
          />
          {errors.isDelete ? <span className="error_message">{errors.isDelete}</span> : null}
        </div>        
                
        <div className="div-label">비행기이름 :</div>
        <div className="div-input">
          <input
            type="text"
            className={errors.name ? 'input-not-valid' : ''}
            placeholder="비행기이름"
            name="name"
            id="name"
            value={name}
            onChange={(event) => changeInput('name', event.target.value)}
          />
          {errors.name ? <span className="error_message">{errors.name}</span> : null}
        </div>        
                
        <div className="div-label">비행기영문명 :</div>
        <div className="div-input">
          <input
            type="text"
            className={errors.nameEn ? 'input-not-valid' : ''}
            placeholder="비행기영문명"
            name="nameEn"
            id="nameEn"
            value={nameEn}
            onChange={(event) => changeInput('nameEn', event.target.value)}
          />
          {errors.nameEn ? <span className="error_message">{errors.nameEn}</span> : null}
        </div>        
                
        <div className="div-label">비행기코드 :</div>
        <div className="div-input">
          <input
            type="text"
            className={errors.airCode ? 'input-not-valid' : ''}
            placeholder="비행기코드"
            name="airCode"
            id="airCode"
            value={airCode}
            onChange={(event) => changeInput('airCode', event.target.value)}
          />
          {errors.airCode ? <span className="error_message">{errors.airCode}</span> : null}
        </div>        
                
        <div className="div-label">국가코드 :</div>
        <div className="div-input">
          <input
            type="text"
            className={errors.countryCode ? 'input-not-valid' : ''}
            placeholder="국가코드"
            name="countryCode"
            id="countryCode"
            value={countryCode}
            onChange={(event) => changeInput('countryCode', event.target.value)}
          />
          {errors.countryCode ? <span className="error_message">{errors.countryCode}</span> : null}
        </div>        
                
        <div className="div-label">최종비행시간 :</div>
        <div className="div-input">
          <input
            type="text"
            className={errors.lastPainDate ? 'input-not-valid' : ''}
            placeholder="최종비행시간"
            name="lastPainDate"
            id="lastPainDate"
            value={lastPainDate}
            onChange={(event) => changeInput('lastPainDate', event.target.value)}
          />
          {errors.lastPainDate ? <span className="error_message">{errors.lastPainDate}</span> : null}
        </div>        
                
        <div className="div-label">최종수리시간 :</div>
        <div className="div-input">
          <input
            type="text"
            className={errors.lastFixDate ? 'input-not-valid' : ''}
            placeholder="최종수리시간"
            name="lastFixDate"
            id="lastFixDate"
            value={lastFixDate}
            onChange={(event) => changeInput('lastFixDate', event.target.value)}
          />
          {errors.lastFixDate ? <span className="error_message">{errors.lastFixDate}</span> : null}
        </div>        
                
        <div className="div-label">크기 :</div>
        <div className="div-input">
          <input
            type="text"
            className={errors.size ? 'input-not-valid' : ''}
            placeholder="크기"
            name="size"
            id="size"
            value={size}
            onChange={(event) => changeInput('size', event.target.value)}
          />
          {errors.size ? <span className="error_message">{errors.size}</span> : null}
        </div>        
        
        <div className="right" style={{ width: 580 }}>
          <button className="button button-cancel" onClick={clear}>
            취소
          </button>
          <button className="button button-info" onClick={save}>
            저장
          </button>
        </div>
      </div>
    </>
  );
}
export default AirplaneForm;
