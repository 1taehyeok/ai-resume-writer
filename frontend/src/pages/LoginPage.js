import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/auth';
import Button from '../components/Button';
import '../styles/LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();

  // 쿼리 파라미터에서 리다이렉트 경로 추출
  const query = new URLSearchParams(location.search);
  const redirectPath = query.get('redirect') || '/add-experience';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { access_token, user } = await login(email, password);
      authLogin(access_token, user);
      navigate(redirectPath); // 원래 경로 또는 기본 경로로 리다이렉트
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      window.location.href = 'http://localhost:8000/api/auth/google';
    } catch (err) {
      setError(err.message || 'Failed to login with Google');
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <h1>Login to CoverLetterGenie</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={toggleShowPassword}
              disabled={loading}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="form-buttons">
          <Button text="Login" type="submit" disabled={loading} />
          <Button
            text="Login with Google"
            variant="secondary"
            onClick={handleGoogleLogin}
            disabled={loading}
          />
        </div>
      </form>
      <p className="signup-link">
        Don't have an account?{' '}
        <a href="/signup" onClick={() => navigate('/signup')}>
          Sign up
        </a>
      </p>
    </div>
  );
}

export default LoginPage;