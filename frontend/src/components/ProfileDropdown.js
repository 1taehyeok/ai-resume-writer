import React, { useRef, useEffect } from 'react';
import '../styles/ProfileDropdown.css';

function ProfileDropdown({ onClose, onNavigate, onLogout = () => {} }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button onClick={() => onNavigate('/mypage')} className="profile-dropdown-item">마이페이지</button>
      <button onClick={() => onNavigate('/subscription')} className="profile-dropdown-item">구독하기</button>
      
      <button
        onClick={async () => {
          try {
            await onLogout();
            onClose();
          } catch (error) {
            console.error('Logout failed:', error.message);
            alert(error.message); // 실패 메시지
          }
        }}
        className="profile-dropdown-item danger"
      >
        로그아웃
      </button>
    </div>
  );
}

export default ProfileDropdown;
