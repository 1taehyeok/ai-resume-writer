import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import CompanySelectPage from './pages/CompanySelectPage';
import AddExperiencePage from './pages/AddExperiencePage';
import MappingPage from './pages/MappingPage';
import PreviewPage from './pages/PreviewPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EssayQuestionInputPage from './pages/EssayQuestionInputPage';
import SubscriptionPage from './pages/SubscriptionPage';
import MyPage from './pages/MyPage';
import './styles/App.css';
import FixedStepNav from './components/FixedStepNav';


// 임시 클라이언트 ID (백엔드에서 실제 ID 제공 시 교체)
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'DUMMY_CLIENT_ID';


function App() {
  const location = useLocation();
  const navigate = useNavigate();
  // 로그인, 회원가입 페이지에서는 네비게이션 버튼 숨김
  const hideNav = location.pathname === '/login' || location.pathname === '/signup';

  // 단계별 경로 배열
  const steps = [
    '/add-experience',
    '/company-select',
    '/essay-question-input',
    '/mapping',
    '/preview'
  ];
  const currentIdx = steps.indexOf(location.pathname);
  const showPrev = currentIdx > 0;
  const showNext = currentIdx > -1 && currentIdx < steps.length - 1;

  const handlePrev = () => {
    if (showPrev) navigate(steps[currentIdx - 1]);
  };
  const handleNext = () => {
    if (showNext) navigate(steps[currentIdx + 1]);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route element={<PrivateRoute />}>
                <Route path="/add-experience" element={<AddExperiencePage />} />
                <Route path="/company-select" element={<CompanySelectPage />} />
                <Route path="/essay-question-input" element={<EssayQuestionInputPage />} />
                <Route path="/mapping" element={<MappingPage />} />
                <Route path="/preview" element={<PreviewPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route element={<PrivateRoute />}>
  <Route path="/mypage" element={<MyPage />} />
</Route>
            </Routes>
            {/* 로그인/회원가입이 아닐 때만 고정 네비게이션 버튼 보이기 */}
            {!hideNav && (
              <FixedStepNav 
                onPrev={handlePrev} 
                onNext={handleNext} 
                showPrev={showPrev}
                showNext={showNext}
              />
            )}
          </div>
        </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;