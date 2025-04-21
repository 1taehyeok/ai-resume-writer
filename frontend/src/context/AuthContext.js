import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logout, refreshToken } from '../services/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshTokenValue, setRefreshTokenValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 초기 인증 상태 로드
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    const storedRefreshToken = localStorage.getItem('refresh_token');

    if (token && storedUser) {
      setAccessToken(token);
      setUser(JSON.parse(storedUser));
      setRefreshTokenValue(storedRefreshToken);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Axios 응답 인터셉터: 401 응답 시 토큰 갱신
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          refreshTokenValue
        ) {
          originalRequest._retry = true;
          try {
            const { access_token } = await refreshToken(refreshTokenValue);
            setAccessToken(access_token);
            localStorage.setItem('access_token', access_token);
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return axios(originalRequest);
          } catch (refreshError) {
            // Refresh Token 실패 시 로그아웃
            handleLogout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [refreshTokenValue]);

  const login = useCallback((token, user, refreshToken) => {
    setAccessToken(token);
    setUser(user);
    setRefreshTokenValue(refreshToken);
    setIsAuthenticated(true);
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('refresh_token', refreshToken);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      if (refreshTokenValue) {
        await logout(refreshTokenValue);
      }
      setAccessToken(null);
      setUser(null);
      setRefreshTokenValue(null);
      setIsAuthenticated(false);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [navigate, refreshTokenValue]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        accessToken,
        login,
        logout: handleLogout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}