import { useState, useCallback } from "react";

/**
 * Custom hook for modal management
 * Mengelola state modal (open/close) dengan mudah
 *
 * @param {boolean} initialState - State awal modal (default: false)
 * @returns {Object} - Modal state and functions
 *
 * @example
 * const { isOpen, openModal, closeModal, toggleModal } = useModal();
 *
 * return (
 *   <>
 *     <button onClick={openModal}>Open Modal</button>
 *     <Modal isOpen={isOpen} onClose={closeModal}>
 *       Modal Content
 *     </Modal>
 *   </>
 * );
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState(null);

  const openModal = useCallback((modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (isOpen) {
      setData(null);
    }
  }, [isOpen]);

  return {
    isOpen,
    data,
    openModal,
    closeModal,
    toggleModal,
  };
};

export default useModal;
