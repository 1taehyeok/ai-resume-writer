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
          CoverLetterGenie
        </h1>
        <nav className="nav">
          <Button
            text="Add Experience"
            onClick={() => navigate('/add-experience')}
            variant="secondary"
          />
          <Button
            text="Mapping"
            onClick={() => navigate('/mapping')}
            variant="secondary"
          />
          <Button
            text="Preview"
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