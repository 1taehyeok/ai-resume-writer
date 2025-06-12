import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../services/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  // accessToken과 refreshTokenValue는 이제 클라이언트에서 직접 관리하지 않습니다.
  // 대신, 백엔드 응답에서 사용자 정보만 받아서 설정합니다.
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 초기 인증 상태 로드 (쿠키는 백엔드에서 관리하므로, 사용자 정보만 확인)
  useEffect(() => {
      // 서버에서 사용자 정보를 가져오는 API를 호출하거나,
      // 로그인/회원가입 시 받은 user 정보를 기반으로 초기화할 수 있습니다.
      // 여기서는 localStorage에서 user 정보만 가져오는 기존 로직을 유지합니다.
      const storedUser = localStorage.getItem('user');

      let parsedUser = null;
      if (storedUser) {
          try {
              parsedUser = JSON.parse(storedUser);
              // HttpOnly 쿠키로 로그인 상태를 판단하므로,
              // user 정보가 있으면 일단 로그인된 것으로 간주할 수 있습니다.
              // 실제로는 백엔드에 토큰 유효성을 확인하는 엔드포인트가 있으면 더 안전합니다.
              setUser(parsedUser);
              setIsAuthenticated(true);
          } catch (error) {
              console.error('Invalid user data in localStorage:', error);
              localStorage.removeItem('user');
              setIsAuthenticated(false);
          }
      } else {
          setIsAuthenticated(false);
      }
      setLoading(false);
  }, []);

  // Axios 응답 인터셉터: 401 응답 시 처리
  // HttpOnly 쿠키는 JavaScript에서 직접 접근할 수 없으므로,
  // refresh token을 직접 갱신하는 대신, 401 에러를 받으면
  // 자동적으로 재로그인 또는 로그아웃 처리하도록 유도합니다.
  useEffect(() => {
      const interceptor = axios.interceptors.response.use(
          (response) => response,
          async (error) => {
              const originalRequest = error.config;
              // 401 에러가 발생하고, 로그인 또는 토큰 갱신 요청이 아닌 경우
              if (error.response?.status === 401 && !originalRequest._retry) {
                  originalRequest._retry = true; // 무한 재시도 방지

                  // HttpOnly 쿠키를 사용하므로, 토큰 갱신은 백엔드가 처리합니다.
                  // 만약 401이 발생했다면, access token이 만료되었거나 유효하지 않다는 의미입니다.
                  // 이때는 프론트엔드에서 할 수 있는 것이 거의 없습니다.
                  // 백엔드의 Simple JWT 설정에서 refresh token이 access token을 자동으로 갱신하도록 설정했다면,
                  // 이 401 에러는 refresh token까지 만료된 경우일 가능성이 높습니다.
                  
                  console.log('401 Unauthorized error detected. Attempting re-authentication or logging out.');
                  // 강제 로그아웃 처리
                  handleLogout(); 
                  return Promise.reject(error);
              }
              return Promise.reject(error);
          }
      );

      return () => axios.interceptors.response.eject(interceptor);
  }, []); // refreshTokenValue 의존성 제거

  const login = useCallback((userData) => {
      // 백엔드에서 HttpOnly 쿠키로 토큰을 설정하므로,
      // 여기서 access_token과 refresh_token을 저장할 필요가 없습니다.
      // 사용자 정보만 받아서 상태를 업데이트합니다.
      const { user } = userData; 
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(user)); // 사용자 정보만 localStorage에 저장
  }, []);

  const handleLogout = useCallback(async () => {
      try {
          // logout API 호출 (백엔드에서 refresh token을 쿠키에서 가져오거나,
          // body로 보내는 경우에 따라 인자가 필요할 수 있습니다.
          // 현재 백엔드 `logout` 함수는 `refresh_token`을 `request.data`에서 기대합니다.)
          // 따라서, 만약 refresh token을 백엔드에 보내야 한다면
          // 백엔드가 프론트엔드에 `refresh_token`을 쿠키가 아닌 body로 보내도록
          // 요청해야 할 수도 있습니다.
          // 여기서는 `refresh_token`을 보내지 않는 시나리오로 가정합니다.
          // (백엔드에서 HttpOnly 쿠키로 refresh_token을 읽어서 처리한다고 가정)
          await logout(); // refreshTokenValue 인자 제거 (백엔드에서 쿠키로 처리)
          
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('user'); // 사용자 정보만 제거
          navigate('/login');
          console.log('Successfully logged out.');
      } catch (error) {
          console.error('Logout failed:', error.message);
          // 로그아웃 실패 시에도 로컬 상태는 초기화하는 것이 좋습니다.
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('user');
          navigate('/login');
          // 사용자에게 에러 메시지 표시
      }
  }, [navigate]);

  return (
      <AuthContext.Provider
          value={{
              isAuthenticated,
              user,
              // accessToken은 더 이상 제공하지 않습니다.
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