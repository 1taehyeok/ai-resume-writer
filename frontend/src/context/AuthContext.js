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
    
    // storedUser가 유효한 JSON인지 확인
    let parsedUser = null;
    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser);
      } catch (error) {
        console.error('Invalid user data in localStorage:', error);
        // 잘못된 데이터가 있으면 localStorage에서 user 제거
        localStorage.removeItem('user');
      }
    }

    if (token && parsedUser) {
      setAccessToken(token);
      setUser(parsedUser);
      setRefreshTokenValue(storedRefreshToken);
      setIsAuthenticated(true);
    } else {
      // 유효하지 않은 데이터가 있으면 localStorage 초기화
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('refresh_token');
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

  const login = useCallback((data) => {
    const { access_token, refresh_token, user } = data;
    setAccessToken(access_token);
    setUser(user);
    setRefreshTokenValue(refresh_token);
    setIsAuthenticated(true);
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user)); // JSON.stringify로 안전하게 저장
    localStorage.setItem('refresh_token', refresh_token);
  }, []);

  // AuthContext.js
  const handleLogout = useCallback(async () => {
    try {
      await logout(refreshTokenValue); 
      setAccessToken(null);
      setUser(null);
      setRefreshTokenValue(null);
      setIsAuthenticated(false);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.message);
      // 사용자에게 에러 메시지 표시 (예: alert 또는 UI 컴포넌트)
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