import React from 'react';
import '../styles/AlertModal.css';

function AlertModal({ open, title, message, onConfirm, onCancel, confirmText = '확인', cancelText = '취소' }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="alert-modal-content" onClick={e => e.stopPropagation()}>
        <h2 style={{ marginBottom: 18 }}>{title}</h2>
        <p>{message}</p>
        <div className="alert-modal-actions">
          <button className="button secondary" onClick={onCancel}>{cancelText}</button>
          <button className="button button-add" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;
