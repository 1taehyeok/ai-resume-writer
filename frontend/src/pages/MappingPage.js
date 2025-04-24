import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import '../styles/MappingPage.css';

// Mock 데이터 (실제 앱에서는 props/context/API 등으로 대체)
// @hello-pangea/dnd로 마이그레이션 완료
const mockExperiences = [
  { id: 'exp-1', title: '인턴십 경험', description: '2023년 여름, OO기업에서 프론트엔드 개발 인턴으로 근무하며 React 프로젝트를 수행함.' },
  { id: 'exp-2', title: '동아리 프로젝트', description: '교내 IT 동아리에서 팀장으로 웹 서비스 기획 및 개발을 주도함.' },
  { id: 'exp-3', title: '공모전 수상', description: '2022년 전국 대학생 해커톤에서 수상한 경험.' },
];
const mockQuestions = [
  { id: 'q-1', question: '지원 동기를 작성하세요.' },
  { id: 'q-2', question: '본인의 강점과 약점을 기술하세요.' },
  { id: 'q-3', question: '협업 경험을 예시와 함께 설명하세요.' },
];

function MappingPage() {
  // 경험, 문항, 매핑 상태
  const [experiences, setExperiences] = useState(mockExperiences);
  const [questions, setQuestions] = useState(mockQuestions);
  // { [questionId]: [experienceId, ...] }
  const [mapping, setMapping] = useState({});

  // 경험을 드래그해서 문항에 드롭할 때 호출
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    // 드롭존이 문항 영역일 때만 동작
    if (destination.droppableId.startsWith('question-')) {
      const questionId = destination.droppableId.replace('question-', '');
      setMapping(prev => {
        // 이미 매핑된 경우 중복 방지
        const prevList = prev[questionId] || [];
        if (prevList.includes(draggableId)) return prev;
        return { ...prev, [questionId]: [...prevList, draggableId] };
      });
    }
  };

  // 문항에서 경험 매핑 해제
  const removeMapping = (questionId, expId) => {
    setMapping(prev => ({
      ...prev,
      [questionId]: prev[questionId].filter(id => id !== expId)
    }));
  };

  return (
    <div className="mapping-page-root">
      <h1>경험 매핑 페이지</h1>
      <div className="mapping-layout">
        {/* 경험 리스트 (드래그 가능) */}
        <DragDropContext onDragEnd={onDragEnd}>
  {/* 경험 리스트 (Droppable 복구, 드롭은 막고 드래그만 허용) */}
  <Droppable droppableId="experience-list" isDropDisabled={true}>
    {(provided) => (
      <div className="experience-list-panel" ref={provided.innerRef} {...provided.droppableProps}>
        <h2>경험 목록</h2>
        {experiences.map((exp, idx) => (
          <Draggable key={exp.id} draggableId={exp.id} index={idx}>
            {(provided, snapshot) => (
              <div
                className={`experience-card${snapshot.isDragging ? ' dragging' : ''}`}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <strong>{exp.title}</strong>
                <div className="exp-desc">{exp.description}</div>
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>

          {/* 문항 리스트 (드롭존) */}
          <div className="question-list-panel">
            <h2>자소서 문항</h2>
            {questions.map((q, qidx) => (
              <Droppable droppableId={`question-${q.id}`} key={q.id} direction="horizontal">
                {(provided, snapshot) => (
                  <div
                    className={`question-dropzone${snapshot.isDraggingOver ? ' over' : ''}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="question-title">{q.question}</div>
                    <div className="mapped-experiences">
                      {(mapping[q.id] || []).length === 0 && <span className="no-mapping">(아직 매핑된 경험 없음)</span>}
                      {(mapping[q.id] || []).map((expId, idx) => {
                        const exp = experiences.find(e => e.id === expId);
                        if (!exp) return null;
                        return (
                          <div className="mapped-exp-chip" key={expId}>
                            <span>{exp.title}</span>
                            <button className="chip-remove" onClick={() => removeMapping(q.id, expId)} title="매핑 해제">×</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default MappingPage;