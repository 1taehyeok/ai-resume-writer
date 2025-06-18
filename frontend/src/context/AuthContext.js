import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logout as authServiceLogout } from '../services/auth'; // logout 함수 이름 변경 충돌 방지

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 초기 인증 상태 로드
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    let parsedUser = null;
    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        // 서버에 HttpOnly 쿠키 기반의 로그인 상태 유효성을 확인하는 엔드포인트가 있다면
        // 여기에 해당 호출을 추가하여 로그인 상태를 더욱 확실하게 검증할 수 있습니다.
        // 예: checkAuthStatus();
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
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        // 401 에러가 발생하고, 로그인, 회원가입, 로그아웃, 토큰 갱신 요청이 아닌 경우
        // (이러한 요청들은 스스로 인증 로직을 가지고 있으므로 무한 루프 방지)
        const isAuthRelatedPath = [
          '/api/register/',
          '/api/token/',
          '/api/google-login/',
          '/api/logout/',
          '/api/token/refresh/',
        ].some(path => originalRequest.url.endsWith(path));

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRelatedPath) {
          originalRequest._retry = true; // 무한 재시도 방지

          console.log('401 Unauthorized error detected. Attempting to refresh token via backend or logging out.');
          // HttpOnly 쿠키를 사용하므로, refresh token 갱신은 백엔드가 자동으로 처리합니다.
          // 여기서 401이 발생했다는 것은 access token이 만료되었거나 유효하지 않다는 의미입니다.
          // 백엔드의 Simple JWT 설정 (ROTATE_REFRESH_TOKENS, BLACKLIST_AFTER_ROTATION)에 따라
          // refresh token으로 access token을 재발급 시도하고, 성공하면 원래 요청을 재시도합니다.
          // 만약 refresh token도 만료되었다면, 백엔드에서 401 또는 다른 에러를 보낼 것이고,
          // 그 경우 프론트엔드는 사용자를 강제로 로그아웃시켜야 합니다.

          try {
            // 백엔드 /api/token/refresh/ 엔드포인트에 요청하여 HttpOnly refresh_token 쿠키로
            // 새로운 HttpOnly access_token 쿠키를 받도록 시도합니다.
            await axios.post('http://localhost:8000/api/token/refresh/', {}, { withCredentials: true });
            
            // 토큰 갱신 성공 시, 원래 요청 재시도
            return axios(originalRequest);
          } catch (refreshError) {
            console.error('Refresh Token 갱신 실패 (재로그인 필요):', refreshError);
            // refresh token도 만료되었거나 유효하지 않은 경우
            alert('세션이 만료되었습니다. 다시 로그인해주세요.');
            handleLogout(); // 강제 로그아웃 처리
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate]); // navigate 추가

  const login = useCallback((userData) => {
    // 백엔드에서 HttpOnly 쿠키로 토큰을 설정하므로,
    // 여기서 토큰 값을 직접 저장할 필요 없이 사용자 정보만 저장합니다.
    const { user } = userData; 
    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(user)); // 사용자 정보만 localStorage에 저장
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      // 백엔드의 logout API를 호출하여 HttpOnly refresh token을 블랙리스트 처리
      await authServiceLogout(); // 인자 없이 호출
      
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
      navigate('/login'); // 실패해도 로그인 페이지로 리다이렉트하여 로그인되지 않은 상태임을 명확히 합니다.
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
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