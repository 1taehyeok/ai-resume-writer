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

// 회원가입 (더미 데이터)
export async function register(name, email, password) {
  try {
    // 백엔드 API 미구현: 더미 응답 반환
    return {
      access_token: 'fake-token',
      refresh_token: 'fake-refresh-token',
      user: { id: Date.now(), name, email },
    };
    // 실제 백엔드 API 호출 (준비 시 활성화)
    /*
    const response = await api.post('/register', { name, email, password });
    if (response.data.success) {
      return response.data.data; // { access_token, refresh_token, user }
    }
    throw new Error(response.data.message || 'Signup failed');
    */
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

// Google 로그인
export async function googleLogin(code) {
  try {
    throw new Error('Google login not implemented');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Network error');
  }
}

// 로그아웃
export async function logout(refreshToken) {
  try {
    return true; // 더미 응답
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Network error');
  }
}

// 토큰 갱신
export async function refreshToken(refreshToken) {
  try {
    throw new Error('Token refresh not implemented');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Network error');
  }
}