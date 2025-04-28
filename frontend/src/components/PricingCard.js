import React from 'react';
import '../styles/PricingCard.css';

function PricingCard({ plan, price, period, description, features, highlight, tag, onUpgrade }) {
  return (
    <div className={`pricing-card${highlight ? ' highlight' : ''}`}>
      {tag && <div className="pricing-tag">{tag}</div>}
      <h3 className="plan-title">{plan}</h3>
      <div className="plan-desc">{description}</div>
      <div className="plan-price">
        <span className="price">${price}</span>
        <span className="period">{period}</span>
      </div>
      <ul className="feature-list">
        {features.map((f, i) => (
          <li key={i}>✔ {f}</li>
        ))}
      </ul>
      <button className="upgrade-btn" onClick={onUpgrade}>Upgrade</button>
    </div>
  );
}

export default PricingCard;
