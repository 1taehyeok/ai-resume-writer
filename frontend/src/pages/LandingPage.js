import Button from '../components/Button';
import ReviewCard from '../components/ReviewCard';
import '../styles/LandingPage.css';

function scrollToHowItWorks() {
  const el = document.getElementById('how-it-works');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>논스톱 AI 자소서 생성기</h1>
        <p>AI로 쉽고 빠르게 나만의 커버레터를 완성하세요!</p>
        <div className="buttons">
          <Button text="Get Started" onClick={() => window.location.href = '/add-experience'} />
          <Button text="기업 선택하기" variant="secondary" onClick={() => window.location.href = '/company-select'} />
          <Button text="Learn More" variant="secondary" onClick={scrollToHowItWorks} />
        </div>
      </header>
      <section className="landing-image-section">
        <img src="/images/person-at-desk.svg" alt="Person at desk" className="landing-image" />
      </section>
      <section className="key-benefits">
        <h2>Key Benefits</h2>
        <ul className="benefit-list">
          <li>맞춤형 AI 커버레터 자동 생성</li>
          <li>간편한 경험 입력, 빠른 결과</li>
          <li>무료 미리보기 및 다운로드</li>
        </ul>
      </section>
      <section className="reviews">
        <h2>What Our Users Say</h2>
        <div className="review-list">
          <ReviewCard
            rating={5}
            text="CoverLetterGenie transformed my job application. I landed interviews at top companies!"
            author="Emily Johnson"
          />
          <ReviewCard
            rating={5}
            text="정말 간편하게 커버레터를 만들 수 있었어요. 덕분에 합격했습니다!"
            author="박지은"
          />
          <ReviewCard
            rating={4}
            text="AI가 제 경험을 잘 정리해줘서 큰 도움이 됐어요. 추천합니다."
            author="김민수"
          />
        </div>
      </section>
      <section className="how-it-works" id="how-it-works">
        <h2>How It Works</h2>
        <ol className="how-list">
          <li>회원가입 또는 로그인</li>
          <li>경험 입력</li>
          <li>AI 추천 커버레터 생성</li>
          <li>미리보기 및 다운로드</li>
        </ol>
      </section>
      <footer className="landing-footer">
        <p> 2025 CoverLetterGenie | </p>
      </footer>
    </div>
  );
}

export default LandingPage;