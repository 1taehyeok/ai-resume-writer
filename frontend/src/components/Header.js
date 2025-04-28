import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import ProfileDropdown from './ProfileDropdown';
import '../styles/Header.css';

import React, { useState } from 'react';

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  // 경로에 따라 현재 단계를 결정
  const steps = [
    { label: '경험<br />생성', path: '/add-experience' },
    { label: '기업<br />선택', path: '/company-select' },
    { label: '자소서<br />문항입력', path: '/essay-question-input' },
    { label: '경험<br />매핑', path: '/mapping' },
    { label: '자소서<br />생성', path: '/preview' },
  ];

  const stepPages = [
    '/add-experience',
    '/company-select',
    '/essay-question-input',
    '/mapping',
    '/preview'
  ];
  const getCurrentStep = () => {
    if (!stepPages.some(path => location.pathname.startsWith(path))) return -1;
    const idx = steps.findIndex(step => location.pathname.startsWith(step.path));
    return idx;
  };

  const currentStep = getCurrentStep();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1
          className="logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          Ai-Resume-Writer
        </h1>
        <nav className="nav">
          <div className="stepper">
            {steps.map((step, idx) => (
              <div
                key={step.label}
                className={`step${currentStep === idx && currentStep !== -1 ? ' active' : ''}${currentStep > idx ? ' completed' : ''}`}
                onClick={() => navigate(step.path)}
                style={{ cursor: 'pointer' }}
              >
                <span className="step-index">{idx + 1}</span> <span dangerouslySetInnerHTML={{ __html: step.label }} />
                {idx < steps.length - 1 && <span className="arrow">→</span>}
              </div>
            ))}
          </div>
          {isAuthenticated ? (
            <>
              <span className="user-greeting">Hello, {user?.name || 'User'}</span>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={user?.profileImage || 'https://www.gravatar.com/avatar/?d=mp&s=40'}
                  alt="마이페이지"
                  className="mypage-avatar"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    marginLeft: 12,
                    cursor: 'pointer',
                    border: '2px solid #1976d2',
                    objectFit: 'cover',
                  }}
                  onClick={() => setDropdownOpen((open) => !open)}
                />
                {dropdownOpen && (
                  <ProfileDropdown
                    onClose={() => setDropdownOpen(false)}
                    onNavigate={(path) => {
                      setDropdownOpen(false);
                      navigate(path);
                    }}
                    onLogout={async () => {
                      setDropdownOpen(false);
                      await handleLogout();
                    }}
                  />
                )}
              </div>
            </>
          ) : (
            <Button
              text="Login"
              onClick={() => navigate('/login')}
              variant="primary"
            />
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;