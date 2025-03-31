import Button from './Button';
import '../styles/MappingCard.css';

function MappingCard({ title, image }) {
  return (
    <div className="mapping-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <Button text="Add to cover letter" variant="secondary" />
    </div>
  );
}

export default MappingCard;