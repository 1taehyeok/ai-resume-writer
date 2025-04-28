import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/MyPage.css';

// 비밀번호 변경 단계별 폼 컴포넌트
function PasswordChangeForm() {
  const [step, setStep] = useState(1); // 1: 기존 비번, 2: 신규 비번
  const [oldPassword, setOldPassword] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 임시: 기존 비밀번호가 '1234'일 때만 통과
  const checkOldPassword = (e) => {
    e.preventDefault();
    setOldPasswordError('');
    setSuccessMessage('');
    if (oldPassword === '1234') {
      setStep(2);
    } else {
      setOldPasswordError('기존 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setNewPasswordError('');
    setSuccessMessage('');
    if (!newPassword || !newPassword2) {
      setNewPasswordError('새 비밀번호를 모두 입력해주세요.');
      return;
    }
    if (newPassword !== newPassword2) {
      setNewPasswordError('새 비밀번호가 서로 일치하지 않습니다.');
      return;
    }
    // 실제로는 여기서 서버에 변경 요청
    setSuccessMessage('비밀번호가 성공적으로 변경되었습니다!');
    setStep(1);
    setOldPassword('');
    setNewPassword('');
    setNewPassword2('');
  };

  return (
    <section className="account-section">
      <h2>비밀번호 변경</h2>
      {step === 1 && (
        <form className="change-password-form" onSubmit={checkOldPassword}>
          <input
            type="password"
            placeholder="기존 비밀번호"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            autoFocus
          />
          {oldPasswordError && <div style={{color:'#e53935', marginBottom:8}}>{oldPasswordError}</div>}
          <button type="submit">확인</button>
        </form>
      )}
      {step === 2 && (
        <form className="change-password-form" onSubmit={handleChangePassword}>
          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            autoFocus
          />
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={newPassword2}
            onChange={e => setNewPassword2(e.target.value)}
          />
          {newPasswordError && <div style={{color:'#e53935', marginBottom:8}}>{newPasswordError}</div>}
          <button type="submit">비밀번호 변경</button>
        </form>
      )}
      {successMessage && <div style={{color:'#1976d2', marginTop:8}}>{successMessage}</div>}
    </section>
  );
}


function MyPage() {
  // 쿼리 파라미터에서 tab 값 추출
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab');

  // 탭 클릭 시 쿼리 파라미터 변경
  const handleTabClick = (tabValue) => {
    if (!tabValue || tabValue === 'subscription') {
      navigate('/mypage'); // 기본 탭(구독 정보)
    } else {
      navigate(`/mypage?tab=${tabValue}`);
    }
  };

  return (
    <div className="my-page side-layout">

      {/* 왼쪽 고정 탭 사이드바 */}
      <div className="mypage-sidebar">
        <div className="mypage-tabs vertical">
          <button
            className={`mypage-tab${!tab || tab === 'subscription' ? ' active' : ''}`}
            onClick={() => handleTabClick('subscription')}
          >
            구독 정보
          </button>
          <button
            className={`mypage-tab${tab === 'password' ? ' active' : ''}`}
            onClick={() => handleTabClick('password')}
          >
            비밀번호 변경
          </button>
          <button
            className={`mypage-tab${tab === 'withdraw' ? ' active' : ''}`}
            onClick={() => handleTabClick('withdraw')}
          >
            회원 탈퇴
          </button>
        </div>
      </div>
      {/* 가운데 컨텐츠 영역 */}
      <div className="mypage-main-row">
        <div className="mypage-content">
          {(!tab || tab === 'subscription') && (
            <section className="subscription-section">
              <h2>구독 정보</h2>
              {/* 구독 상태, 구독/취소 버튼 */}
              <button className="subscribe-btn">구독하기</button>
              <button className="unsubscribe-btn">구독 취소</button>
            </section>
          )}
          {tab === 'password' && (
            <PasswordChangeForm />
          )}
          {tab === 'withdraw' && (
            <section className="withdraw-section">
              <h2>회원 탈퇴</h2>
              {/* 회원 탈퇴 버튼 및 확인 모달 등 */}
              <button className="withdraw-btn">회원 탈퇴</button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyPage;
