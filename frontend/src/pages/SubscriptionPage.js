import React from 'react';
import PricingCard from '../components/PricingCard';
import '../styles/SubscriptionPage.css';

function SubscriptionPage() {
  const plans = [
    {
      plan: 'Pro Month Plan',
      price: '19.9',
      period: '/month',
      description: 'For beginner to try',
      features: [
        'Create 25 slides per month',
        'Generate up to 33 pages of PowerPoint slides',
        'Convert file to PowerPoint',
        'Export presentation as PPTX',
        'PowerPoint editing online',
        '500 Standard questions per month',
        '200 ChatGPT-4o/4 questions per month',
        '200 AI generated images per month',
        'Customer Support',
      ],
      highlight: false,
      tag: null,
    },
    {
      plan: 'Pro Quarter Plan',
      price: '16.6',
      period: '/month',
      description: 'For explorers who often need to make slides',
      features: [
        'Create 90 slides per quarter',
        'Generate up to 33 pages of PowerPoint slides',
        'Convert file to PowerPoint',
        'Export presentation as PPTX',
        'PowerPoint editing online',
        '1700 Standard questions per quarter',
        '700 ChatGPT-4o/4 questions per quarter',
        '700 AI generated images per quarter',
        'Customer Support',
      ],
      highlight: false,
      tag: null,
    },
    {
      plan: 'Pro Year Plan',
      price: '12.5',
      period: '/month',
      description: 'For workers or students who often need to use slides',
      features: [
        'Create 500 slides per year',
        'Generate up to 33 pages of PowerPoint slides',
        'Convert file to PowerPoint',
        'Export presentation as PPTX',
        'PowerPoint editing online',
        '7500 Standard questions per year',
        '3000 ChatGPT-4o/4 questions per year',
        '3000 AI generated images per year',
        'Customer Support',
      ],
      highlight: true,
      tag: 'Save 37%, 25% more uses',
    },
    {
      plan: 'Lifetime Plan',
      price: '< 0.01',
      period: '/day',
      description: 'For experts who want to use AI in their daily work and life',
      features: [
        'Create 9999+ slides in a lifetime',
        'Generate up to 33 pages of PowerPoint slides',
        'Convert file to PowerPoint',
        'Export presentation as PPTX',
        'PowerPoint editing online',
        'No limited Standard questions',
        'No limited ChatGPT-4o/4 questions',
        'No limited AI generated images',
        'Customer support',
      ],
      highlight: true,
      tag: 'The Best Plan for You',
    },
  ];

  return (
    <div className="subscription-page">
      <h1 className="pricing-title">Pricing</h1>
      <p className="pricing-subtitle">Use your first AI tool & Save money</p>
      <div className="pricing-card-list">
        {plans.map((plan, idx) => (
          <PricingCard key={idx} {...plan} onUpgrade={() => alert(`Upgrade to ${plan.plan}`)} />
        ))}
      </div>
    </div>
  );
}

export default SubscriptionPage;
