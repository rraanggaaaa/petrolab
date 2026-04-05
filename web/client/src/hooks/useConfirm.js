import { useState, useCallback } from "react";

/**
 * Custom hook for confirm dialog management
 * Mengelola state confirm dialog dengan mudah
 *
 * @returns {Object} - Confirm dialog state and functions
 *
 * @example
 * const { confirm, confirmDialog } = useConfirm();
 *
 * const handleDelete = async () => {
 *   const confirmed = await confirm({
 *     title: 'Delete Item',
 *     message: 'Are you sure?',
 *     type: 'danger'
 *   });
 *
 *   if (confirmed) {
 *     await deleteItem(id);
 *   }
 * };
 *
 * return <ConfirmDialog {...confirmDialog} />;
 */
export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "Confirm Action",
    message: "Are you sure?",
    confirmText: "Confirm",
    cancelText: "Cancel",
    type: "danger",
    onConfirm: null,
  });

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title: options.title || "Confirm Action",
        message: options.message || "Are you sure?",
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
        type: options.type || "danger",
        onConfirm: () => {
          resolve(true);
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        },
        onCancel: () => {
          resolve(false);
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        },
      });
    });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
    if (confirmState.onCancel) {
      confirmState.onCancel();
    }
  }, [confirmState]);

  const handleConfirm = useCallback(() => {
    if (confirmState.onConfirm) {
      confirmState.onConfirm();
    }
  }, [confirmState]);

  const confirmDialog = {
    isOpen: confirmState.isOpen,
    title: confirmState.title,
    message: confirmState.message,
    confirmText: confirmState.confirmText,
    cancelText: confirmState.cancelText,
    type: confirmState.type,
    onConfirm: handleConfirm,
    onClose: closeConfirm,
  };

  return { confirm, confirmDialog };
};

export default useConfirm;
