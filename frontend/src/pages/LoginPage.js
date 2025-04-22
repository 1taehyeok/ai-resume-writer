import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { login, googleLogin } from '../services/auth';
import Button from '../components/Button';
import '../styles/LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      const { access_token, refresh_token, user } = await login(email, password);
      authLogin(access_token, user, refresh_token);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setError('');
      setLoading(true);
      try {
        const { access_token, refresh_token, user } = await googleLogin(codeResponse.code);
        authLogin(access_token, user, refresh_token);
        navigate(redirectPath);
      } catch (err) {
        setError(err.message || 'Failed to login with Google');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google login failed');
      setLoading(false);
    },
    flow: 'auth-code',
  });

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
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="form-buttons">
          <Button text="Login" type="submit" disabled={loading} />
          <Button
            text="Login with Google"
            variant="secondary"
            onClick={() => handleGoogleLogin()}
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