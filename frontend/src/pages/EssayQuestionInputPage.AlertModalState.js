import { useState } from 'react';

export default function useAlertModal() {
  const [modal, setModal] = useState({ open: false, idx: null, question: '', onConfirm: null });

  const showModal = (idx, question, onConfirm) => {
    setModal({ open: true, idx, question, onConfirm });
  };
  const closeModal = () => setModal({ open: false, idx: null, question: '', onConfirm: null });
  const confirmModal = () => {
    if (modal.onConfirm) modal.onConfirm();
    closeModal();
  };

  return {
    modal,
    showModal,
    closeModal,
    confirmModal,
  };
}
