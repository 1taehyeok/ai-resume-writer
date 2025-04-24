import React, { useState } from 'react';

function EssayQuestionForm({ onSubmit, onCancel, initial }) {
  const [question, setQuestion] = useState(initial?.question || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit({ question });
      setQuestion('');
    }
  };


  return (
    <form className="essay-question-form center-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>질문</label>
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          required
        />
      </div>
      <div className="form-actions">
        <button className="button primary" type="submit">저장</button>
        {onCancel && (
          <button className="button secondary" type="button" onClick={onCancel} style={{marginLeft:8}}>취소</button>
        )}
      </div>
    </form>
  );
}

export default EssayQuestionForm;
