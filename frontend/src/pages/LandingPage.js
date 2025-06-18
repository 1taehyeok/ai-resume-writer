import Button from '../components/Button';
import Magnet from '../components/Magnet';
import CardSwap, { Card } from '../components/CardSwap'
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
          
          <Magnet
            padding={20} // 마우스가 얼마나 가까이 왔을 때 자석 효과가 시작될지 설정 (기본값 100)
            magnetStrength={3} // 자석 효과의 강도 (기본값 2)
          >
            <Button text="Get Started" onClick={() => window.location.href = '/add-experience'} />
          </Magnet>
          <Button text="Pricing" variant="secondary" onClick={() => window.location.href = '/subscription'} />
          <Button text="Learn More" variant="secondary" onClick={scrollToHowItWorks} />
        </div>
      </header>
      <section className="landing-image-section">
      
        <div className="card-swap-text-container"> {/* 텍스트를 위한 컨테이너 추가 */}
              <h2>논스톱 AI 자소서 생성기</h2>
              <p>Just look at it go!</p>
          </div>
          <CardSwap width={500} height={400} cardDistance={60} verticalDistance={70} delay={5000} pauseOnHover={true} skewAmount={6} easing="elastic">
            <Card customClass="styled-card first-card">
              <span className="card-number">1</span> {/* 스크린샷의 숫자 1 */}
              {/* 여기에 다른 내용도 추가할 수 있습니다. */}
            </Card>
            <Card customClass="styled-card">
              {/* 아이콘을 위한 div 또는 span */}
              <div className="card-icon">
                <img src="/images/1.svg" alt="Person at desk" className="landing-image" />
              </div>
              <h3>Customizable</h3>
            </Card>
            <Card customClass="styled-card">
              <div className="card-icon">
                  {/* <i className="fas fa-wrench"></i> */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                  </svg>
              </div>
              <h3>Reliable</h3>
            </Card>
            <Card customClass="styled-card">
              <div className="card-icon">
                  {/* <i className="fas fa-bezier-curve"></i> */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M11.077 4.167a.75.75 0 0 1 .198 1.125l-3.09 3.09a.75.75 0 0 1-1.124-.198l-3.09-3.09a.75.75 0 0 1 1.124-1.124l3.09 3.09 3.09-3.09a.75.75 0 0 1 1.125.198ZM21.722 8.354a.75.75 0 0 0-.198-1.125l-3.09-3.09a.75.75 0 0 0-1.124.198l-3.09 3.09a.75.75 0 0 0 1.124 1.124l3.09-3.09 3.09 3.09a.75.75 0 0 0 .198-1.125ZM6.596 16.596a.75.75 0 0 1 1.06 0l4.75 4.75a.75.75 0 0 1-1.06 1.06l-4.75-4.75a.75.75 0 0 1 0-1.06Zm10.81-4.25a.75.75 0 0 1-.198-1.125l-3.09-3.09a.75.75 0 0 1 1.124-.198l3.09 3.09a.75.75 0 0 1-1.124 1.124l-3.09-3.09-3.09 3.09a.75.75 0 0 1-.198-1.125Z" clipRule="evenodd" />
                  </svg>
              </div>
              <h3>Smooth</h3>
            </Card>
          </CardSwap>
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