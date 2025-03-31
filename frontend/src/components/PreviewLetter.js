import Button from './Button';
import '../styles/PreviewLetter.css';

function PreviewLetter({ letter, onCopy, onEdit }) {
  return (
    <div className="preview-letter">
      <p>{letter}</p>
      <div className="preview-buttons">
        <Button text="Copy" onClick={onCopy} />
        <Button text="Edit" onClick={onEdit} variant="secondary" />
      </div>
    </div>
  );
}

export default PreviewLetter;