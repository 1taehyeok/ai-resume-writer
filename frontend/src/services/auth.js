import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 5000,
});

const AUTH_WHITELIST = [
  '/register/',
  '/token/',
  '/google-login/',
  '/token/refresh/',
  '/logout/',
];

api.interceptors.request.use(
  (config) => {
    const isAuthFree = AUTH_WHITELIST.some((url) => config.url.endsWith(url));
    if (!isAuthFree) {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 회원가입
export async function register(name, email, password) {
  try {
    const response = await api.post('/register/', { name, email, password });
    if (response.data.success) {
      return response.data.data; // { access_token, refresh_token, user }
    }
    throw new Error(response.data.message || 'Registration failed');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Network error');
  }
}

// 일반 로그인
export async function login(email, password) {
  try {
    const response = await api.post('/token/', { email, password });
    if (response.data.success) {
      console.log('Login response:', response.data); // 응답 확인
      return response.data.data; // { access_token, refresh_token, user }
    }
    throw new Error(response.data.message || 'Login failed');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Network error');
  }
}

// Google 로그인/회원가입
export async function googleLogin(code) {
  try {
    const response = await api.post('/google-login/', { code });
    if (response.data.success) {
      return response.data.data; // { access_token, refresh_token, user }
    }
    throw new Error(response.data.message || 'Google login failed');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Google login failed');
  }
}

// 로그아웃
export async function logout(refreshToken) {
  try {
    const response = await api.post('/logout/', { refresh_token: refreshToken });
    if (response.data.success) {
      return response.data; // { success: true, message: "로그아웃되었습니다." }
    }
    throw new Error(response.data.message || '로그아웃에 실패했습니다.');
  } catch (error) {
    const message = error.response?.status === 500
      ? '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      : error.response?.data?.message || '네트워크 오류가 발생했습니다.';
    throw new Error(message);
  }
}

// 토큰 갱신
export async function refreshToken(refreshToken) {
  try {
    const response = await api.post('/token/refresh/', { refresh: refreshToken });
    return { access_token: response.data.access }; // { access_token }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Token refresh failed');
  }
}