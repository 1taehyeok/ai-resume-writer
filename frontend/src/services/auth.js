import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 5000,
});

// 요청 인터셉터: 모든 요청에 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 회원가입
export async function register(name, email, password) {
  try {
    return {
      access_token: 'fake-token',
      refresh_token: 'fake-refresh-token',
      user: { id: Date.now(), name, email },
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Network error');
  }
}

// 일반 로그인
export async function login(email, password) {
  try {
    return {
      access_token: 'fake-token',
      refresh_token: 'fake-refresh-token',
      user: { id: 1, name: 'Test User', email },
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Network error');
  }
}

// Google 로그인/회원가입
export async function googleLogin(code) {
  try {
    return {
      access_token: 'fake-google-token',
      refresh_token: 'fake-google-refresh-token',
      user: {
        id: Date.now(),
        name: 'Google User',
        email: 'googleuser@example.com',
      },
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Google login failed');
  }
}

// 로그아웃
export async function logout(refreshToken) {
  try {
    // 백엔드 API 미구현: 더미 응답
    return true;
    // 실제 API 호출 (준비 시 활성화)
    /*
    const response = await api.post('/logout', { refresh_token: refreshToken });
    return response.data.success;
    */
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
}

// 토큰 갱신
export async function refreshToken(refreshToken) {
  try {
    // 백엔드 API 미구현: 더미 응답
    return {
      access_token: 'fake-new-token',
    };
    // 실제 API 호출 (준비 시 활성화)
    /*
    const response = await api.post('/refresh', { refresh_token: refreshToken });
    if (response.data.success) {
      return response.data.data; // { access_token }
    }
    throw new Error(response.data.message || 'Token refresh failed');
    */
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Token refresh failed');
  }
}