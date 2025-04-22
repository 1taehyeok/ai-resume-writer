import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import '../styles/Header.css';

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

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
          <Button
            text="경헝 생성"
            onClick={() => navigate('/add-experience')}
            variant="secondary"
          />
          <Button
            text="경험 매핑"
            onClick={() => navigate('/mapping')}
            variant="secondary"
          />
          <Button
            text="자소서 생성"
            onClick={() => navigate('/preview')}
            variant="secondary"
          />
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