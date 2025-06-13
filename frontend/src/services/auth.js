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

// // 요청 인터셉터: 더 이상 access_token을 localStorage에서 가져오지 않습니다.
// // 브라우저가 HttpOnly 쿠키를 자동으로 요청 헤더에 포함합니다.
// api.interceptors.request.use(
//     (config) => {
//         // 더 이상 Authorization 헤더를 수동으로 설정할 필요가 없습니다.
//         // 브라우저가 자동으로 'access_token' HttpOnly 쿠키를 포함하여 보냅니다.
//         // 따라서 이 부분은 주석 처리하거나 제거할 수 있습니다.
//         // const isAuthFree = AUTH_WHITELIST.some((url) => config.url.endsWith(url));
//         // if (!isAuthFree) {
//         //     // const token = localStorage.getItem('access_token'); // 이 줄은 이제 필요 없습니다.
//         //     // if (token) {
//         //     // config.headers.Authorization = `Bearer ${token}`;
//         //     // }
//         // }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// 응답 인터셉터: Access Token 만료 및 갱신 처리
api.interceptors.response.use(
  (response) => response, // 성공적인 응답은 그대로 반환
  async (error) => {
      const originalRequest = error.config;

      // 401 에러이고, 이전에 토큰 갱신을 시도하지 않았으며,
      // 토큰 갱신 경로가 아닌 경우에만 토큰 갱신 시도
      if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/token/refresh/') {
          originalRequest._retry = true; // 재시도 플래그 설정

          try {
              // Refresh Token으로 Access Token 갱신 요청
              // HttpOnly 쿠키 덕분에 브라우저가 자동으로 refresh_token을 포함하여 보냅니다.
              const refreshResponse = await api.post('/token/refresh/');

              // 백엔드에서 새로운 access_token을 Set-Cookie 헤더로 보냈을 것입니다.
              // 프론트엔드에서는 새로 받은 access_token의 값을 직접 저장할 필요가 없습니다.
              // 브라우저가 자동으로 새 access_token 쿠키를 저장합니다.

              // 기존 요청의 Authorization 헤더를 업데이트 (선택 사항, HttpOnly라서 불필요할 수도 있음)
              // 하지만 백엔드가 응답 본문에 새로운 Access Token을 포함하여 보낸다면
              // 이 곳에서 새로운 Access Token을 가져와 수동으로 설정할 수 있습니다.
              // 예를 들어, refreshResponse.data.access_token이 있다면:
              // originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`;

              // 만약 백엔드가 오직 Set-Cookie로만 새로운 Access Token을 준다면,
              // 이 부분을 주석 처리하고 단순히 원래 요청을 재시도하면 브라우저가 새 쿠키를 사용할 것입니다.
              
              // 중요한 점: 백엔드에서 새로운 Access Token을 Set-Cookie로 보내면,
              // 이 시점에서 브라우저가 자동으로 해당 쿠키를 갱신합니다.
              // 따라서 originalRequest.headers.Authorization을 명시적으로 업데이트할 필요가 없습니다.
              // 그냥 원래 요청을 재시도하면 브라우저가 새로 갱신된 HttpOnly access_token 쿠키를 보낼 것입니다.

              return api(originalRequest); // 원래 요청 재시도
          } catch (refreshError) {
              console.error('Access Token 갱신 실패:', refreshError);
              // Refresh Token 마저 만료되었거나 유효하지 않은 경우
              // 사용자에게 로그아웃을 요청하거나 자동으로 로그아웃 처리
              // (예: localStorage의 사용자 정보 삭제, 로그인 페이지로 리다이렉트)
              // 실제 로그아웃 API 호출을 통해 서버 측 세션도 정리
              try {
                  await logout(); // 정의된 logout 함수 호출
              } catch (e) {
                  console.error('로그아웃 처리 중 오류 발생:', e);
              }
              alert('세션이 만료되었습니다. 다시 로그인해주세요.');
              window.location.href = '/login'; // 로그인 페이지로 리다이렉트
              return Promise.reject(refreshError);
          }
      }

      // 401 에러가 아니거나, 이미 재시도했거나, 토큰 갱신 경로인 경우
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



// 프로필 업데이트
export async function updateProfile(userData) {
    try {
        const response = await api.put('/update-profile/', userData);
        if (response.data.success) {
            return response.data;
        }
        throw new Error(error.response?.data?.detail || error.response?.data?.message || '프로필 업데이트에 실패했습니다.');
    } catch (error) {
        const message = error.response?.data?.message || '네트워크 오류가 발생했습니다.';
        if (error.response?.status === 400 && error.response?.data?.errors) {
            const errors = JSON.stringify(error.response.data.errors);
            throw new Error(`${message} 오류: ${errors}`);
        } else if (error.response?.status === 401) {
            // 백엔드에서 401 Unauthorized 에러와 함께 구체적인 메시지를 보내는 경우
            if (error.response?.data?.detail) {
                throw new Error(error.response.data.detail); // "현재 비밀번호가 일치하지 않습니다." 등
            }
            throw new Error(message || '인증 오류가 발생했습니다.');
        }
        throw new Error(message);
    }
}

// 토큰 갱신 (프론트엔드에서 직접 호출할 필요가 없습니다)
// 브라우저가 자동으로 HttpOnly refresh_token 쿠키를 포함하고,
// 백엔드 Simple JWT의 TokenRefreshView가 이를 처리하여 새로운 access_token 쿠키를 발급합니다.
// 따라서 이 함수는 더 이상 export하지 않거나, 호출 로직에서 제거해야 합니다.
// export async function refreshToken(refreshToken) { ... } 
// 이 함수는 주석 처리하거나 완전히 제거하세요.