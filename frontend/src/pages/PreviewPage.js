import PreviewLetter from '../components/PreviewLetter';
import '../styles/PreviewPage.css';

import React, { useState, useRef } from 'react';
import '../styles/PreviewPage.css';

function getCaretCoordinates(textarea, selectionEnd) {
  // textarea 내부에서 selectionEnd의 상대 좌표 계산 (scroll, padding, border, line-height 등 보정)
  const rect = textarea.getBoundingClientRect();
  const style = window.getComputedStyle(textarea);
  // 임시 div 생성 및 스타일 복사
  const div = document.createElement('div');
  for (const prop of style) {
    div.style[prop] = style[prop];
  }
  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.whiteSpace = 'pre-wrap';
  div.style.wordWrap = 'break-word';
  div.style.overflow = 'auto';
  div.style.width = rect.width + 'px';
  div.style.height = rect.height + 'px';
  div.style.padding = style.padding;
  div.style.border = style.border;
  div.style.font = style.font;
  div.style.lineHeight = style.lineHeight;
  div.style.boxSizing = style.boxSizing;
  div.style.tabSize = style.tabSize;
  // textarea의 스크롤 위치 보정
  div.scrollTop = textarea.scrollTop;
  div.scrollLeft = textarea.scrollLeft;

  // 줄바꿈 변환 (textarea는 \n, div는 <br>)
  const before = textarea.value.substring(0, selectionEnd).replace(/\n/g, '\n\u200b');
  const after = textarea.value.substring(selectionEnd) || '.';
  div.textContent = before;
  const span = document.createElement('span');
  span.textContent = after;
  div.appendChild(span);
  document.body.appendChild(div);
  // span의 좌표 (임시 div 내부 상대좌표)
  const spanRect = span.getBoundingClientRect();
  const divRect = div.getBoundingClientRect();
  // textarea 내부에서의 좌표 (스크롤 보정)
  const relLeft = spanRect.left - divRect.left - textarea.scrollLeft;
  const relTop = spanRect.top - divRect.top - textarea.scrollTop;
  document.body.removeChild(div);
  return { left: relLeft, top: relTop };
}

function PreviewPage() {
  // mock: 실제로는 context/store/API에서 받아와야 함
  const questions = [
    { id: 'q-1', question: '지원 동기를 작성하세요.' },
    { id: 'q-2', question: '본인의 강점과 약점을 기술하세요.' },
    { id: 'q-3', question: '협업 경험을 예시와 함께 설명하세요.' }
  ];
  const [answers, setAnswers] = useState([
    '저는 귀사의 혁신적인 문화와 성장 가능성에 매력을 느껴 지원하게 되었습니다... (예시 답변)',
    '저의 강점은 문제 해결력과 협업 능력입니다. 약점은 가끔 완벽주의적 경향이 있다는 점입니다... (예시 답변)',
    '동아리 프로젝트에서 팀장으로 다양한 팀원들과 협업하며 목표를 달성한 경험이 있습니다... (예시 답변)'
  ]);

  // 보조 메뉴 상태
  const [menu, setMenu] = useState({
    visible: false,
    idx: null,
    selectedText: '',
    coords: { left: 0, top: 0 },
    selectionStart: 0,
    selectionEnd: 0,
    showPrompt: false,
  });
  const [prompt, setPrompt] = useState('');
  const textareaRefs = useRef([]);

  const handleAnswerChange = (idx, value) => {
    setAnswers(prev => prev.map((a, i) => (i === idx ? value : a)));
  };

  // 텍스트 선택 감지
  const handleSelect = (idx, e) => {
    const textarea = textareaRefs.current[idx];
    const { selectionStart, selectionEnd } = textarea;
    if (selectionStart !== selectionEnd) {
      const selectedText = textarea.value.substring(selectionStart, selectionEnd);
      // 팝업 위치 계산 (textarea 부모 기준 상대좌표)
      let coords = { left: 20, top: 10 };
      try {
        coords = getCaretCoordinates(textarea, selectionEnd);
      } catch {}
      setMenu({
        visible: true,
        idx,
        selectedText,
        coords,
        selectionStart,
        selectionEnd,
      });
    } else {
      setMenu(m => m.visible ? { ...m, visible: false } : m);
    }
  };

  // 메뉴 바깥 클릭 시 닫기 (프롬프트 입력 중에는 닫히지 않음)
  React.useEffect(() => {
    if (!menu.visible || menu.showPrompt) return;
    const handleClick = e => {
      if (!e.target.classList.contains('selection-menu-btn')) {
        setMenu(m => ({ ...m, visible: false }));
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [menu.visible, menu.showPrompt]);

  // 메뉴에서 LLM 요청 (현재는 mock)
  const handleRequestEdit = () => {
    setMenu(m => ({ ...m, showPrompt: !m.showPrompt }));
  };

  // 프롬프트 전송 mock
  const handlePromptSend = () => {
    alert(`프롬프트: "${prompt}"
선택 텍스트: "${menu.selectedText}" (문항 ${menu.idx + 1})`);
    setPrompt('');
    setMenu(m => ({ ...m, visible: false, showPrompt: false }));
  };

  return (
    <div className="preview-page">
      <h1>자소서 미리보기</h1>
      <div className="preview-list">
        {questions.map((q, idx) => (
          <div key={q.id} className="preview-question-block" style={{ position: 'relative' }}>
            <h3 className="preview-question">{q.question}</h3>
            <textarea
              className="preview-answer-textarea"
              ref={el => (textareaRefs.current[idx] = el)}
              value={answers[idx] || ''}
              onChange={e => handleAnswerChange(idx, e.target.value)}
              onSelect={e => handleSelect(idx, e)}
              rows={8}
              style={{ width: '100%', resize: 'vertical', marginTop: 8 }}
            />
            {/* 보조 메뉴 */}
            {menu.visible && menu.idx === idx && (
              <div
                className="selection-menu"
                style={{
                  position: 'absolute',
                  left:
                    textareaRefs.current[idx]
                      ? textareaRefs.current[idx].offsetWidth + 16
                      : menu.coords.left + 120,
                  top: menu.coords.top - 8,
                  zIndex: 2000
                }}
              >
                {menu.showPrompt ? (
                  <div className="selection-prompt-box">
                    <textarea
                      className="selection-prompt-textarea"
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      placeholder="프롬프트를 입력하세요 (예: 더 간결하게, 예시 추가 등)"
                      rows={4}
                      style={{ width: 220, minHeight: 64, marginTop: 10, fontSize: '1.04em', resize: 'vertical' }}
                    />
                    <div className="selection-prompt-btn-row">
                      <button
                        className="selection-prompt-send-btn"
                        onClick={handlePromptSend}
                        disabled={!prompt.trim()}
                      >
                        전송
                      </button>
                      <button
                        className="selection-prompt-cancel-btn"
                        onClick={() => setMenu(m => ({ ...m, showPrompt: false }))}
                        style={{ marginLeft: 7 }}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <button className="selection-menu-btn" onClick={handleRequestEdit}>
                    ✨ 수정
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreviewPage;