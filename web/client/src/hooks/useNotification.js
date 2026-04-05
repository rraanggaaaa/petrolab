import { useState, useCallback } from "react";

/**
 * Custom hook for notification management
 * Mengelola notifikasi (toast/alert) dengan mudah
 *
 * @param {number} duration - Durasi notifikasi dalam ms (default: 5000)
 * @returns {Object} - Notification state and functions
 *
 * @example
 * const { notification, showSuccess, showError, hideNotification } = useNotification();
 *
 * showSuccess('Item created successfully!');
 * showError('Something went wrong!');
 */
export const useNotification = (duration = 5000) => {
  const [notification, setNotification] = useState({
    visible: false,
    type: "info",
    message: "",
  });

  const showNotification = useCallback(
    (type, message) => {
      setNotification({
        visible: true,
        type,
        message,
      });

      if (duration > 0) {
        setTimeout(() => {
          setNotification((prev) => ({ ...prev, visible: false }));
        }, duration);
      }
    },
    [duration],
  );

  const showSuccess = useCallback(
    (message) => {
      showNotification("success", message);
    },
    [showNotification],
  );

  const showError = useCallback(
    (message) => {
      showNotification("error", message);
    },
    [showNotification],
  );

  const showWarning = useCallback(
    (message) => {
      showNotification("warning", message);
    },
    [showNotification],
  );

  const showInfo = useCallback(
    (message) => {
      showNotification("info", message);
    },
    [showNotification],
  );

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, visible: false }));
  }, []);

  return {
    notification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
  };
};

export default useNotification;
