import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import '../styles/Header.css';

function Header() {
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

  const getCurrentStep = () => {
    if (location.pathname === '/') return -1; // LandingPage에서는 active 없음
    const idx = steps.findIndex(step => location.pathname.startsWith(step.path));
    return idx === -1 ? 0 : idx;
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
              <Button text="Logout" onClick={handleLogout} variant="primary" />
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