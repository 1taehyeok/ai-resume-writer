import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 5000,
    withCredentials: true, // CORS 요청 시 쿠키를 함께 보내기 위해 중요!
});

const AUTH_WHITELIST = [
    '/register/',
    '/token/',
    '/google-login/',
    '/token/refresh/', // 토큰 갱신은 백엔드에서 쿠키로 처리하므로 프론트에서 직접 호출할 일이 줄어들 수 있습니다.
    '/logout/',
];

// 요청 인터셉터: 더 이상 access_token을 localStorage에서 가져오지 않습니다.
// 브라우저가 HttpOnly 쿠키를 자동으로 요청 헤더에 포함합니다.
api.interceptors.request.use(
    (config) => {
        // 더 이상 Authorization 헤더를 수동으로 설정할 필요가 없습니다.
        // 브라우저가 자동으로 'access_token' HttpOnly 쿠키를 포함하여 보냅니다.
        // 따라서 이 부분은 주석 처리하거나 제거할 수 있습니다.
        // const isAuthFree = AUTH_WHITELIST.some((url) => config.url.endsWith(url));
        // if (!isAuthFree) {
        //     // const token = localStorage.getItem('access_token'); // 이 줄은 이제 필요 없습니다.
        //     // if (token) {
        //     // config.headers.Authorization = `Bearer ${token}`;
        //     // }
        // }
        return config;
    },
    (error) => Promise.reject(error)
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
        throw new Error(error.response?.data?.message || 'Network error');
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
        throw new Error(error.response?.data?.message || 'Network error');
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
        throw new Error(error.response?.data?.message || 'Google login failed');
    }
}

// 로그아웃
export async function logout() { // refresh_token 인자 제거
    try {
        // 백엔드에서 HttpOnly 쿠키의 refresh_token을 사용하여 블랙리스트 처리한다고 가정합니다.
        // 만약 백엔드 logout 엔드포인트가 refresh_token을 body에서 받는다면,
        // 이 함수에서 refresh_token을 HttpOnly 쿠키에서 읽어올 방법이 없으므로
        // 백엔드 로직을 변경하거나, refresh token을 HttpOnly가 아닌 일반 쿠키로 설정하는 것을 고려해야 합니다.
        // 현재는 refresh_token 없이 로그아웃을 요청하는 것으로 가정합니다.
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

// 토큰 갱신 (프론트엔드에서 직접 호출할 필요가 없습니다)
// 브라우저가 자동으로 HttpOnly refresh_token 쿠키를 포함하고,
// 백엔드 Simple JWT의 TokenRefreshView가 이를 처리하여 새로운 access_token 쿠키를 발급합니다.
// 따라서 이 함수는 더 이상 export하지 않거나, 호출 로직에서 제거해야 합니다.
// export async function refreshToken(refreshToken) { ... } 
// 이 함수는 주석 처리하거나 완전히 제거하세요.