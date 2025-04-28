import React from "react";
import '../styles/FixedStepNav.css';

export default function FixedStepNav({ onPrev, onNext, showPrev = true, showNext = true }) {
  return (
    <>
      {showPrev && (
        <button className="fixed-nav-btn prev-btn" onClick={onPrev}>
          &lt; 이전단계
        </button>
      )}
      {showNext && (
        <button className="fixed-nav-btn next-btn" onClick={onNext}>
          다음단계  &gt;
        </button>
      )}
    </>
  );
}
