import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">CoverLetterGenie</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/add-experience">Experience</Link>
        <Link to="/mapping">Mapping</Link>
        <Link to="/preview">Results</Link>
      </nav>
    </header>
  );
}

export default Header;