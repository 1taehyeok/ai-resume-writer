import { useState } from 'react';

export default function useAlertModal() {
  const [modal, setModal] = useState({ open: false, company: null, onConfirm: null });

  const showModal = (company, onConfirm) => {
    setModal({ open: true, company, onConfirm });
  };
  const closeModal = () => setModal({ open: false, company: null, onConfirm: null });
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
