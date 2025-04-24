import React, { useState } from 'react';
import EssayQuestionForm from '../components/EssayQuestionForm';
import Modal from '../components/Modal';
import '../styles/EssayQuestionInputPage.css';

function EssayQuestionInputPage() {
  const [questions, setQuestions] = useState([
    // 예시 mock 데이터
    // { question: '지원 동기를 작성하세요.', description: '회사에 지원한 이유를 구체적으로...' }
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);

  const handleAdd = (item) => {
    setQuestions([...questions, { question: item.question }]);
    setShowAdd(false);
  };

  const handleEdit = (idx) => setEditingIdx(idx);
  const handleSaveEdit = (idx, updated) => {
    setQuestions(questions.map((q, i) => (i === idx ? { question: updated.question } : q)));
    setEditingIdx(null);
  };
  const handleDelete = (idx) => setQuestions(questions.filter((_, i) => i !== idx));

  return (
    <div className="essay-question-input-page">

      {showAdd && (
        <Modal open={showAdd} onClose={() => setShowAdd(false)}>
          <h3>자소서 문항 추가</h3>
          <EssayQuestionForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
        </Modal>
      )}
      <section className="question-section">
        <div className="question-section-header">
          <h3>저장된 자소서 문항</h3>
          <button
            className="button add-question-green"
            aria-label="문항 추가"
            onClick={() => setShowAdd(true)}
          >
            <span className="icon">➕</span> 문항 추가
          </button>
        </div>
        {questions.length === 0 ? (
          <p>저장된 문항이 없습니다.</p>
        ) : (
          <div className="question-list">
            {questions.map((q, idx) => (
              <div key={idx} className="question-card">
                {editingIdx === idx ? (
                  <EssayQuestionForm
                    initial={q}
                    onSubmit={updated => handleSaveEdit(idx, updated)}
                    onCancel={() => setEditingIdx(null)}
                  />
                ) : (
                  <div className="question-card-row">
                    <div className="question-main">
                      <div className="question-title">{q.question}</div>
                    </div>
                    <div className="question-actions">
                      <button className="button secondary small" onClick={() => handleEdit(idx)} style={{ marginRight: 6 }}>수정</button>
                      <button className="button primary small" onClick={() => handleDelete(idx)}>삭제</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default EssayQuestionInputPage;
