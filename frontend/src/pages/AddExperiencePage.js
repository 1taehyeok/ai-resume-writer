import { useState } from 'react';
import ExperienceForm from '../components/ExperienceForm';
import '../styles/AddExperiencePage.css';

function AddExperiencePage() {
  const [experiences, setExperiences] = useState([]);

  const handleSubmit = (newExperience) => {
    setExperiences([...experiences, newExperience]);
    window.location.href = '/mapping'; // 다음 페이지로 이동
  };

  return (
    <div className="add-experience-page">
      <h1>Add your key experience</h1>
      <ExperienceForm onSubmit={handleSubmit} />
    </div>
  );
}

export default AddExperiencePage;