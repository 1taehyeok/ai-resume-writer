import MappingCard from '../components/MappingCard';
import '../styles/MappingPage.css';

function MappingPage() {
  const cards = [
    { title: 'Beach Retreat', image: '/images/beach-retreat.jpg' },
    { title: 'City Lights', image: '/images/city-lights.jpg' },
    { title: 'Mountain Escape', image: '/images/mountain-escape.jpg' },
  ];

  return (
    <div className="mapping-page">
      <h1>What to include in your cover letter?</h1>
      <div className="card-list">
        {cards.map((card, index) => (
          <MappingCard key={index} title={card.title} image={card.image} />
        ))}
      </div>
    </div>
  );
}

export default MappingPage;