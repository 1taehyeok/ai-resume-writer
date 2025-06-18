// services/api.js

import axios from 'axios';

// ----------------------------------------------------
// !!! 중요: 이 파일은 AuthContext와 직접적으로 의존하면 안 됩니다.
// 따라서 로그아웃 로직을 직접 호출할 수 없습니다.
// 로그아웃은 AuthContext에서 담당하도록 유지하고,
// 여기서 refresh token 갱신마저 실패하면
// AuthContext가 401 에러를 최종적으로 받아 처리하게 합니다.
// ----------------------------------------------------

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // 백엔드 API 기본 URL
    timeout: 5000, // 요청 타임아웃 5초
    withCredentials: true, // CORS 요청 시 HttpOnly 쿠키를 함께 보내기 위해 필수!
});

// 응답 인터셉터: 401 Unauthorized 에러 발생 시 토큰 갱신 시도
api.interceptors.response.use(
    (response) => response, // 성공적인 응답은 그대로 반환
    async (error) => {
        const originalRequest = error.config;

        // 특정 인증 관련 경로 (로그인, 회원가입, 로그아웃, 토큰 갱신)는
        // 인터셉터에서 재시도를 시도하지 않고 바로 에러를 반환하여 무한 루프를 방지합니다.
        // 이 경로들은 자체적으로 인증 실패를 처리해야 합니다.
        const isAuthRelatedPath = [
            '/register/',
            '/token/',
            '/google-login/',
            '/logout/',
            '/token/refresh/',
        ].some(path => originalRequest.url.includes(path)); // includes로 변경하여 유연성 확보

        // 401 에러이고, 이미 재시도하지 않았으며, 인증 관련 경로가 아닌 경우
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRelatedPath) {
            originalRequest._retry = true; // 무한 재시도 방지를 위한 플래그 설정
            console.log('API 인터셉터: 401 Unauthorized 감지. 토큰 갱신 시도...');

            try {
                // HttpOnly refresh_token 쿠키를 사용하여 새로운 access_token을 요청합니다.
                // 백엔드에서 새로운 access_token을 HttpOnly 쿠키로 설정해 줄 것입니다.
                await api.post('/token/refresh/', {}, { withCredentials: true });

                // 토큰 갱신에 성공했으므로, 원래 요청을 재시도합니다.
                // 이 때 브라우저는 새로 받은 access_token 쿠키를 자동으로 포함할 것입니다.
                console.log('API 인터셉터: 토큰 갱신 성공, 원래 요청 재시도.');
                return api(originalRequest);
            } catch (refreshError) {
                // refresh token 갱신마저 실패한 경우 (refresh token도 만료되거나 유효하지 않음)
                console.error('API 인터셉터: Refresh Token 갱신 실패 (재로그인 필요):', refreshError);
                // 이 에러는 최종적으로 AuthContext의 Axios 인터셉터로 전달되어 로그아웃을 유발할 것입니다.
                // 여기서는 직접 로그아웃 처리를 하지 않습니다.
                return Promise.reject(refreshError);
            }
        }
        // 401 에러가 아니거나, 이미 재시도했거나, 인증 관련 경로인 경우
        // 또는 refresh token 갱신마저 실패한 경우, 원래 에러를 반환합니다.
        return Promise.reject(error);
    }
);

export default api; // Axios 인스턴스 내보내기