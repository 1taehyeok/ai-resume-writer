import { useState, useEffect } from 'react';
import ExperienceForm from '../components/ExperienceForm';
import Modal from '../components/Modal';
import AlertModal from '../components/AlertModal';
import '../styles/AddExperiencePage.css';
import '../styles/Modal.css';
import '../styles/AlertModal.css';

function AddExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExtractModal, setShowExtractModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [editingIdx, setEditingIdx] = useState(null); // 현재 수정 중인 경험 인덱스

  // 경험 리스트 및 상태 변수 (중복 선언 없이 한 번만)
  // 추가: 임시 경험 목록


  // 경험 직접 추가 - 제출하기 버튼
  const handleSubmit = (newExperience) => {
    setExperiences([...experiences, newExperience]);
    setShowAddModal(false);
    // window.location.href = '/mapping'; // 다음 페이지로 이동 (원한다면 유지)
  };

  // 경험 직접 추가 - 취소 버튼
  const handleCancelAdd = () => {
    setTempExperiences([]);
    setShowAddModal(false);
  };


  // 경험 리스트 불러오기 (마운트 시)
  useEffect(() => {
    setLoading(true);
    setError(null);
    // 임시 mock 데이터
    const mockData = [
      {
        title: '인턴십 경험',
        description: '2023년 여름, OO기업에서 프론트엔드 개발 인턴으로 근무하며 React 프로젝트를 수행함.'
      },
      {
        title: '동아리 프로젝트',
        description: '교내 IT 동아리에서 팀장으로 웹 서비스 기획 및 개발을 주도함.'
      }
    ];
    setTimeout(() => {
      setExperiences(mockData);
      setLoading(false);
    }, 700); // 0.7초 후 데이터 세팅
  }, []);


  // 자소서 추출 경험 추가
  const handleExtractedExperience = (extracted) => {
    setExperiences([...experiences, extracted]);
    setShowExtractModal(false);
  };

  // 경험 삭제 (커스텀 모달용)
  const handleDelete = (idx) => {
    setDeleteIdx(idx);
    setShowDeleteModal(true);
  };

  // 실제 삭제 실행
  const confirmDelete = () => {
    setExperiences(experiences.filter((_, i) => i !== deleteIdx));
    setShowDeleteModal(false);
    setDeleteIdx(null);
  };

  // 삭제 취소
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteIdx(null);
  };


  // 경험 수정 저장
  const handleSaveEdit = (idx, updated) => {
    setExperiences(experiences.map((exp, i) => (i === idx ? updated : exp)));
    setEditingIdx(null);
  };

  // 경험 수정 취소
  const handleCancelEdit = () => setEditingIdx(null);

  return (
    <div className="add-experience-page">
      <h1>Add your key experience</h1>
      <div className="experience-action-buttons">
        <button className="button button-add" onClick={() => setShowAddModal(true)}>
          <span className="icon">➕</span> 경험 직접 추가
        </button>
        <button className="button button-extract" onClick={() => setShowExtractModal(true)}>
          <span className="icon">📝</span> 자소서에서 경험 추출
        </button>
      </div>

      {/* 경험 리스트 표시 (항상 메인) */}
      <section>
        <h2>Saved Experiences</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <ExperienceList
            experiences={experiences}
            onDelete={handleDelete}
            onEdit={setEditingIdx}
            editingIdx={editingIdx}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
          />
        )}
      </section>

      {/* 경험 직접 추가 모달 */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
        <h2>경험 직접 추가</h2>
        <ExperienceForm 
  onSubmit={handleSubmit}
  onCancel={handleCancelAdd}
/>
      </Modal>

      {/* 자소서에서 경험 추출 모달 */}
      <Modal open={showExtractModal} onClose={() => setShowExtractModal(false)}>
        <h2>자소서에서 경험 추출</h2>
        <ExtractFromResumeForm onExtract={handleExtractedExperience} />
      </Modal>

      {/* 경험 삭제 확인 모달 (AlertModal 사용) */}
      <AlertModal
        open={showDeleteModal}
        title="경험 삭제"
        message="정말 이 경험을 삭제하시겠습니까?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="삭제"
        cancelText="취소"
      />
    </div>
  );
}

// 경험 리스트 컴포넌트
function ExperienceList({ experiences, onDelete, onEdit, editingIdx, onSaveEdit, onCancelEdit }) {
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // 수정 모드 진입 시 폼 값 세팅
  useEffect(() => {
    if (editingIdx !== null && experiences[editingIdx]) {
      setEditTitle(experiences[editingIdx].title || '');
      setEditDesc(experiences[editingIdx].description || '');
    }
  }, [editingIdx, experiences]);

  if (!experiences || experiences.length === 0) {
    return <p>저장된 경험이 없습니다.</p>;
  }
  return (
    <ul className="experience-list">
      {experiences.map((exp, idx) => (
        <li key={idx} className="experience-item">
          {editingIdx === idx ? (
            <form
              onSubmit={e => {
                e.preventDefault();
                onSaveEdit(idx, { ...exp, title: editTitle, description: editDesc });
              }}
              className="edit-experience-form"
            >
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                required
                style={{ marginBottom: 4 }}
              />
              <textarea
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                required
                style={{ marginBottom: 4 }}
              />
              <div className="button-group">
                <button className="button primary small" type="submit">저장</button>
                <button className="button secondary small" type="button" onClick={onCancelEdit} style={{ marginLeft: 4 }}>
                  취소
                </button>
              </div>
            </form>
          ) : (
            <div className="experience-item-row">
              <div>
                <strong>{exp.title || exp.company || '경험'}</strong>
                <div>{exp.description || exp.detail || ''}</div>
              </div>
              <div className="button-group">
                <button className="button secondary small" onClick={() => onEdit(idx)} style={{ marginRight: 4 }}>수정</button>
                <button className="button primary small" onClick={() => onDelete(idx)}>삭제</button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

// 자소서에서 경험 추출 폼
function ExtractFromResumeForm({ onExtract }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleExtract = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    // 임시 mock 추출 로직 (실제 LLM 연동 전용)
    setTimeout(() => {
      if (!question || !answer) {
        setError('문항과 답변을 모두 입력해 주세요.');
        setLoading(false);
        return;
      }
      // 간단한 mock 경험 객체 생성
      const extracted = {
        title: `자소서 기반 경험: ${question.slice(0, 10)}...`,
        description: answer.slice(0, 40) + (answer.length > 40 ? '...' : '')
      };
      onExtract(extracted);
      setSuccess('경험이 성공적으로 추출되었습니다!');
      setQuestion('');
      setAnswer('');
      setLoading(false);
    }, 1000); // 1초 후 결과 반환
  };

  return (
    <form className="extract-form" onSubmit={handleExtract}>
      <div>
        <label>자소서 문항</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </div>
      <div>
        <label>자소서 답변</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
          rows={10}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? '추출 중...' : '경험 추출'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
}

export default AddExperiencePage;