import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 5000,
    withCredentials: true, // CORS 요청 시 쿠키를 함께 보내기 위해 중요!
});

// 요청 인터셉터는 HttpOnly 쿠키를 사용할 경우 더 이상 Authorization 헤더를 수동으로 설정할 필요가 없습니다.
// 브라우저가 자동으로 'access_token' HttpOnly 쿠키를 포함하여 보냅니다.
// 따라서 아래 주석 처리된 코드는 제거하거나 주석 상태를 유지합니다.
/*
api.interceptors.request.use(
    (config) => {
        // const isAuthFree = AUTH_WHITELIST.some((url) => config.url.endsWith(url));
        // if (!isAuthFree) {
        //     // 브라우저가 HttpOnly 쿠키를 자동으로 보내므로, 여기에 토큰을 추가할 필요가 없습니다.
        // }
        return config;
    },
    (error) => Promise.reject(error)
);
*/

// 응답 인터셉터는 AuthContext.js에서 전역적으로 처리하므로, 여기서는 제거하거나 간소화합니다.
// 여기서는 기본 응답만 반환하도록 합니다.
api.interceptors.response.use(
  (response) => response,
  (error) => {
      // AuthContext에서 모든 401 에러를 처리하므로, 여기서는 단순히 에러를 던집니다.
      return Promise.reject(error);
  }
);

// 회원가입
export async function register(name, email, password) {
    try {
        const response = await api.post('/register/', { name, email, password });
        if (response.data.success) {
            // 백엔드 응답에서 access_token, refresh_token을 직접 받지 않으므로,
            // user 정보만 반환하도록 변경합니다.
            return { user: response.data.data.user }; 
        }
        throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
        // 에러 응답 구조에 따라 메시지 추출
        const message = error.response?.data?.message || JSON.stringify(error.response?.data?.errors) || 'Network error';
        throw new Error(message);
    }
}

// 일반 로그인
export async function login(email, password) {
    try {
        const response = await api.post('/token/', { email, password });
        if (response.data.success) {
            console.log('Login response:', response.data); 
            // 백엔드 응답에서 access_token, refresh_token을 직접 받지 않으므로,
            // user 정보만 반환하도록 변경합니다.
            return { user: response.data.data.user }; 
        }
        throw new Error(response.data.message || 'Login failed');
    } catch (error) {
        // 에러 응답 구조에 따라 메시지 추출
        const message = error.response?.data?.message || JSON.stringify(error.response?.data?.errors) || 'Network error';
        throw new Error(message);
    }
}

// Google 로그인/회원가입
export async function googleLogin(code) {
    try {
        const response = await api.post('/google-login/', { code });
        if (response.data.success) {
            // 백엔드 응답에서 access_token, refresh_token을 직접 받지 않으므로,
            // user 정보만 반환하도록 변경합니다.
            return { user: response.data.data.user }; 
        }
        throw new Error(response.data.message || 'Google login failed');
    } catch (error) {
        // 에러 응답 구조에 따라 메시지 추출
        const message = error.response?.data?.message || JSON.stringify(error.response?.data?.errors) || 'Google login failed';
        throw new Error(message);
    }
}

// 로그아웃
export async function logout() { // refresh_token 인자 제거
    try {
        // 백엔드에서 HttpOnly 쿠키의 refresh_token을 사용하여 블랙리스트 처리한다고 가정합니다.
        const response = await api.post('/logout/'); 
        if (response.data.success) {
            return response.data;
        }
        throw new Error(response.data.message || '로그아웃에 실패했습니다.');
    } catch (error) {
        const message = error.response?.status === 500
            ? '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            : error.response?.data?.message || '네트워크 오류가 발생했습니다.';
        throw new Error(message);
    }
}

// 프로필 업데이트
export async function updateProfile(userData) {
    try {
        const response = await api.put('/update-profile/', userData);
        if (response.data.success) {
            return response.data;
        }
        throw new Error(response.data?.detail || response.data?.message || '프로필 업데이트에 실패했습니다.');
    } catch (error) {
        const message = error.response?.data?.message || '네트워크 오류가 발생했습니다.';
        if (error.response?.status === 400 && error.response?.data?.errors) {
            const errors = JSON.stringify(error.response.data.errors);
            throw new Error(`${message} 오류: ${errors}`);
        } else if (error.response?.status === 401) {
            if (error.response?.data?.detail) {
                throw new Error(error.response.data.detail);
            }
            throw new Error(message || '인증 오류가 발생했습니다.');
        }
        throw new Error(message);
    }
}

// 토큰 갱신 함수는 HttpOnly 쿠키 방식에서는 프론트엔드에서 직접 호출할 필요가 없습니다.
// Axios 인터셉터가 401 에러를 잡으면 백엔드에 refresh 요청을 보내고, 백엔드가 Set-Cookie로 새 access token을 발행합니다.
// 따라서 이 함수는 제거하거나 export하지 않도록 합니다.
// export async function refreshToken(refreshToken) { ... }