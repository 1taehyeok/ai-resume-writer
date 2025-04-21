import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { register, googleLogin } from '../services/auth';
import Button from '../components/Button';
import '../styles/SignupPage.css';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { access_token, refresh_token, user } = await register(name, email, password);
      authLogin(access_token, user, refresh_token);
      navigate('/add-experience');
    } catch (err) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setError('');
      setLoading(true);
      try {
        const { access_token, refresh_token, user } = await googleLogin(codeResponse.code);
        authLogin(access_token, user, refresh_token);
        navigate('/add-experience');
      } catch (err) {
        setError(err.message || 'Failed to sign up with Google');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google signup failed');
      setLoading(false);
    },
    flow: 'auth-code',
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup-page">
      <h1>Sign Up for CoverLetterGenie</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            disabled={loading}
          />
        </div>
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
          <Button text="Sign Up" type="submit" disabled={loading} />
          <Button
            text="Sign Up with Google"
            variant="secondary"
            onClick={() => handleGoogleSignup()}
            disabled={loading}
          />
        </div>
      </form>
      <p className="login-link">
        Already have an account?{' '}
        <a href="/login" onClick={() => navigate('/login')}>
          Log in
        </a>
      </p>
    </div>
  );
}

export default SignupPage;