import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <AuthProvider>
      <Router>
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
      </Router>
    </AuthProvider>
  );
}

export default App;