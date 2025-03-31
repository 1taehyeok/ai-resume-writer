import '../styles/Button.css';

function Button({ text, onClick, variant = 'primary' }) {
  return (
    <button className={`button ${variant}`} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;