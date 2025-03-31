import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import AddExperiencePage from './pages/AddExperiencePage';
import MappingPage from './pages/MappingPage';
import PreviewPage from './pages/PreviewPage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/add-experience" element={<AddExperiencePage />} />
          <Route path="/mapping" element={<MappingPage />} />
          <Route path="/preview" element={<PreviewPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;