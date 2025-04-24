import { useState } from 'react';
import Button from './Button';
import '../styles/ExperienceForm.css';

function ExperienceForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <form className="experience-form">
      <div>
        <label>제목</label>
        <input
          type="text"
          className="experience-title-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          required
        />
      </div>
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="내용을 입력하세요"
        required
        rows={6}
        style={{ marginBottom: 8 }}
      />
      <div className="form-buttons">
        <Button text="추가하기" type="submit" onClick={handleSubmit} />
        <Button text="취소" variant="secondary" onClick={onCancel} type="button" />
      </div>
    </form>
  );
}

export default ExperienceForm;