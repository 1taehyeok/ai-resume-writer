import PreviewLetter from '../components/PreviewLetter';
import '../styles/PreviewPage.css';

function PreviewPage() {
  const letter = "Dear Hiring Manager,\n\nI am excited to apply for the position at your company...";

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    alert('Copied to clipboard!');
  };

  const handleEdit = () => {
    window.location.href = '/add-experience';
  };

  return (
    <div className="preview-page">
      <h1>Preview</h1>
      <PreviewLetter letter={letter} onCopy={handleCopy} onEdit={handleEdit} />
    </div>
  );
}

export default PreviewPage;