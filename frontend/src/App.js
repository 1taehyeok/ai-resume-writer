import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import AddExperiencePage from './pages/AddExperiencePage';
import MappingPage from './pages/MappingPage';
import PreviewPage from './pages/PreviewPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import './styles/App.css';

// 임시 클라이언트 ID (백엔드에서 실제 ID 제공 시 교체)
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'DUMMY_CLIENT_ID';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route element={<PrivateRoute />}>
                <Route path="/add-experience" element={<AddExperiencePage />} />
                <Route path="/mapping" element={<MappingPage />} />
                <Route path="/preview" element={<PreviewPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;