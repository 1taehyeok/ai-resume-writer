import React, { useState } from 'react';
import './CompanyCardSelect.css';

const initialCompanies = [
  { id: 1, name: '삼성전자' },
  { id: 2, name: 'LG전자' },
  { id: 3, name: '카카오' },
];

function CompanyCardSelect() {
  const [companies, setCompanies] = useState(initialCompanies);
  const [selectedId, setSelectedId] = useState(null);
  const [newCompany, setNewCompany] = useState('');
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const selectedCompany = companies.find(c => c.id === selectedId);

  const iconBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px 5px',
    fontSize: '1.1rem',
    marginLeft: 2,
    color: '#1976d2',
    outline: 'none'
  };

  const handleAddCompany = () => {
    const trimmed = newCompany.trim();
    if (!trimmed) return;
    if (companies.some(c => c.name === trimmed)) return;
    const nextId = companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 1;
    setCompanies([...companies, { id: nextId, name: trimmed }]);
    setNewCompany('');
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') handleAddCompany();
  };

  const handleEdit = (id, name) => {
    setEditId(id);
    setEditValue(name);
  };

  const handleEditSave = (id) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    if (companies.some(c => c.name === trimmed && c.id !== id)) return;
    setCompanies(companies.map(c => c.id === id ? { ...c, name: trimmed } : c));
    setEditId(null);
  };

  const handleDelete = (id) => {
    const company = companies.find(c => c.id === id);
    if (window.confirm(`'${company.name}' 기업을 삭제할까요?`)) {
      setCompanies(companies.filter(c => c.id !== id));
      if (selectedId === id) setSelectedId(null);
      if (editId === id) setEditId(null);
    }
  };

  return (
    <div className="company-card-select-container">
      <h3>기업을 선택하세요</h3>
      <div className="company-input-area">
        <input
          type="text"
          value={newCompany}
          onChange={e => setNewCompany(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="새 기업 이름 입력"
          style={{ padding: '0.5rem 1rem', borderRadius: 6, border: 'none', fontSize: '1rem', marginRight: 8, flex: 1, minWidth: 0 }}
        />
        <button
          onClick={handleAddCompany}
          style={{ padding: '0.5rem 1.2rem', borderRadius: 6, border: 'none', background: '#1976d2', color: 'white', fontWeight: 500, cursor: 'pointer', fontSize: '1rem' }}
        >
          추가
        </button>
      </div>
      <div className="company-list">
        {companies.map((company) => (
          <div
            key={company.id}
            className={`company-card${selectedId === company.id ? ' selected' : ''}`}
            style={{ position: 'relative', minWidth: 0 }}
            onClick={() => setSelectedId(company.id)}
          >
            <span className="company-name">
              {editId === company.id ? (
                <input
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onClick={e => e.stopPropagation()}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleEditSave(company.id);
                    if (e.key === 'Escape') setEditId(null);
                  }}
                  autoFocus
                  style={{ fontSize: '1.07rem', borderRadius: 6, border: '1.5px solid #b3e5fc', padding: '0.3rem 0.7rem', width: '90%' }}
                />
              ) : (
                company.name
              )}
            </span>
            <div className="company-card-actions" onClick={e => e.stopPropagation()}>
              {editId === company.id ? (
                <>
                  <button onClick={() => handleEditSave(company.id)} style={iconBtnStyle}>✔</button>
                  <button onClick={() => setEditId(null)} style={iconBtnStyle}>✖</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEdit(company.id, company.name)} style={iconBtnStyle}>✏️</button>
                  <button onClick={() => handleDelete(company.id)} style={iconBtnStyle}>🗑️</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedCompany && (
        <div className="selected-company-info">
          ✅ 선택된 기업: <span>{selectedCompany.name}</span>
        </div>
      )}
    </div>
  );
}

export default CompanyCardSelect;
