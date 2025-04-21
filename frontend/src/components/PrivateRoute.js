import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 보호할 경로 목록 (유동적 변경 가능)
const protectedRoutes = ['/add-experience', '/mapping', '/preview'];

function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();
  const currentPath = window.location.pathname;

  // 초기 로딩 중에는 렌더링 지연
  if (loading) {
    return <div>Loading...</div>;
  }

  // 인증 여부 및 경로 보호 여부 확인
  if (!isAuthenticated && protectedRoutes.includes(currentPath)) {
    // 원래 경로를 쿼리 파라미터로 저장
    return <Navigate to={`/login?redirect=${encodeURIComponent(currentPath)}`} replace />;
  }

  // 인증된 경우 또는 비보호 경로
  return <Outlet />;
}

export default PrivateRoute;