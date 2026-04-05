import { useState, useCallback } from "react";

/**
 * Custom hook for form management
 * Mengelola state form, validasi, dan submission dengan mudah
 *
 * @param {Object} initialValues - Nilai awal form
 * @param {Object} validationRules - Rules validasi (optional)
 * @param {Function} onSubmit - Fungsi submit (optional)
 * @returns {Object} - Form state and functions
 *
 * @example
 * const { values, errors, handleChange, handleSubmit } = useForm(
 *   { name: '', email: '' },
 *   { name: (v) => v ? null : 'Name is required' }
 * );
 */
export const useForm = (
  initialValues = {},
  validationRules = {},
  onSubmit = null,
) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // Validate a single field
  const validateField = useCallback(
    (name, value) => {
      if (validationRules[name]) {
        const error = validationRules[name](value, values);
        setErrors((prev) => ({ ...prev, [name]: error }));
        return error;
      }
      return null;
    },
    [validationRules, values],
  );

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((key) => {
      const error = validationRules[key](values[key], values);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationRules, values]);

  // Handle input change
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;

      setValues((prev) => ({ ...prev, [name]: newValue }));

      // Validate on change if field was touched
      if (touched[name]) {
        validateField(name, newValue);
      }
    },
    [touched, validateField],
  );

  // Handle input blur
  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      validateField(name, values[name]);
    },
    [validateField, values],
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      // Mark all fields as touched
      const allTouched = {};
      Object.keys(values).forEach((key) => {
        allTouched[key] = true;
      });
      setTouched(allTouched);

      // Validate form
      const isValid = validateForm();

      if (!isValid) {
        return;
      }

      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [validateForm, values, onSubmit],
  );

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set field value manually
  const setFieldValue = useCallback(
    (name, value) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      if (touched[name]) {
        validateField(name, value);
      }
    },
    [touched, validateField],
  );

  // Set field error manually
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    validateForm,
  };
};

export default useForm;
