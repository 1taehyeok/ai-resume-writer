import Button from '../components/Button';
import ReviewCard from '../components/ReviewCard';
import '../styles/LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <h1>Craft Winning Letters</h1>
      <p>AI-powered cover letters tailored for every opportunity</p>
      <div className="buttons">
        <Button text="Get Started" onClick={() => window.location.href = '/add-experience'} />
        <Button text="Learn More" variant="secondary" />
      </div>
      <img src="/images/person-at-desk.jpg" alt="Person at desk" />
      <h2>Key Benefits</h2>
      <ReviewCard
        rating={5}
        text="CoverLetterGenie transformed my job application. I landed interviews on top companies!"
        author="Emily Johnson"
      />
    </div>
  );
}

export default LandingPage;