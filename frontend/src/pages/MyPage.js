import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // AuthContext import
import { updateProfile as apiUpdateProfile } from '../services/auth'; // auth service의 updateProfile 함수 import
import '../styles/MyPage.css';

// 개인정보 업데이트 폼 컴포넌트
function ProfileUpdateForm() {
  const { user, login: authLogin } = useAuth(); // user 정보와 login 함수 가져오기
  const [name, setName] = useState(user?.name || ''); // 현재 사용자 이름으로 초기화
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const updateData = { name };
    let isPasswordChangeAttempt = false;

    if (newPassword || newPassword2) { // 새 비밀번호 입력 필드 중 하나라도 채워져 있으면
      isPasswordChangeAttempt = true;
      if (!currentPassword) {
        setError('비밀번호 변경을 위해서는 현재 비밀번호를 입력해주세요.');
        setLoading(false);
        return;
      }
      if (newPassword !== newPassword2) {
        setError('새 비밀번호가 서로 일치하지 않습니다.');
        setLoading(false);
        return;
      }
      if (newPassword.length < 4) { // 비밀번호 최소 길이 설정 (예시)
          setError('새 비밀번호는 최소 4자 이상이어야 합니다.');
          setLoading(false);
          return;
      }
      updateData.current_password = currentPassword;
      updateData.password = newPassword;
    } else if (currentPassword) { // 새 비밀번호는 없는데 현재 비밀번호만 입력된 경우
      setError('새 비밀번호를 입력하지 않으면 현재 비밀번호를 확인할 수 없습니다.');
      setLoading(false);
      return;
    }

    // 이름만 변경하는 경우에도 currentPassword나 newPassword가 없어도 되도록
    // updateData에 name만 있어도 되도록 처리
    if (!updateData.name && !isPasswordChangeAttempt) {
      setError('업데이트할 정보가 없습니다.');
      setLoading(false);
      return;
    }

    try {
      const response = await apiUpdateProfile(updateData);
      setSuccessMessage(response.message);
      // 사용자 이름이 변경되었을 경우, AuthContext의 user 정보 업데이트
      if (response.data && response.data.name) {
          authLogin(response.data); // 업데이트된 사용자 정보로 로그인 상태 갱신
      }
      
      // 폼 초기화
      setCurrentPassword('');
      setNewPassword('');
      setNewPassword2('');

    } catch (err) {
      setError(err.message || '프로필 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="account-section">
      <h2>개인정보 업데이트</h2>
      <form className="change-password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            placeholder="이름"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="current-password">현재 비밀번호 (비밀번호 변경 시 필수)</label>
          <input
            type="password"
            id="current-password"
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="new-password">새 비밀번호 (선택 사항)</label>
          <input
            type="password"
            id="new-password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="new-password2">새 비밀번호 확인</label>
          <input
            type="password"
            id="new-password2"
            placeholder="새 비밀번호 확인"
            value={newPassword2}
            onChange={e => setNewPassword2(e.target.value)}
            disabled={loading}
          />
        </div>
        {error && <div style={{color:'#e53935', marginBottom:8}}>{error}</div>}
        {successMessage && <div style={{color:'#1976d2', marginTop:8}}>{successMessage}</div>}
        <button type="submit" disabled={loading}>
          {loading ? '업데이트 중...' : '정보 업데이트'}
        </button>
      </form>
    </section>
  );
}

function MyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab');

  const handleTabClick = (tabValue) => {
    if (!tabValue || tabValue === 'subscription') {
      navigate('/mypage');
    } else {
      navigate(`/mypage?tab=${tabValue}`);
    }
  };

  return (
    <div className="my-page side-layout">
      <div className="mypage-sidebar">
        <div className="mypage-tabs vertical">
          <button
            className={`mypage-tab${!tab || tab === 'subscription' ? ' active' : ''}`}
            onClick={() => handleTabClick('subscription')}
          >
            구독 정보
          </button>
          <button
            className={`mypage-tab${tab === 'profile' ? ' active' : ''}`}
            onClick={() => handleTabClick('profile')}
          >
            개인정보 업데이트
          </button>
          <button
            className={`mypage-tab${tab === 'withdraw' ? ' active' : ''}`}
            onClick={() => handleTabClick('withdraw')}
          >
            회원 탈퇴
          </button>
        </div>
      </div>
      <div className="mypage-main-row">
        <div className="mypage-content">
          {(!tab || tab === 'subscription') && (
            <section className="subscription-section">
              <h2>구독 정보</h2>
              <button className="subscribe-btn">구독하기</button>
              <button className="unsubscribe-btn">구독 취소</button>
            </section>
          )}
          {tab === 'profile' && (
            <ProfileUpdateForm />
          )}
          {tab === 'withdraw' && (
            <section className="withdraw-section">
              <h2>회원 탈퇴</h2>
              <button className="withdraw-btn">회원 탈퇴</button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyPage;