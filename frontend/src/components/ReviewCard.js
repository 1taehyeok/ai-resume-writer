import '../styles/ReviewCard.css';

function ReviewCard({ rating, text, author }) {
  return (
    <div className="review-card">
      <div className="rating">{'★'.repeat(rating)}</div>
      <p>{text}</p>
      <p className="author">{author}</p>
    </div>
  );
}

export default ReviewCard;