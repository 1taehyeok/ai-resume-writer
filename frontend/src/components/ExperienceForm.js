import { useState } from 'react';
import Button from './Button';
import '../styles/ExperienceForm.css';

function ExperienceForm({ onSubmit }) {
  const [experience, setExperience] = useState('');
  const [category, setCategory] = useState('Experience 1');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ category, experience });
  };

  return (
    <form className="experience-form" onSubmit={handleSubmit}>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Experience 1</option>
        <option>Experience 2</option>
      </select>
      <textarea
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        placeholder="Describe your experience"
      />
      <div className="form-buttons">
        <Button text="Add to drop" variant="secondary" />
        <Button text="Submit" type="submit" />
      </div>
    </form>
  );
}

export default ExperienceForm;