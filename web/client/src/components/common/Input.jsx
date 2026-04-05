import { forwardRef } from 'react';

/**
 * Input Component
 * Form input dengan label dan error handling
 * @param {string} label - Label input
 * @param {string} type - Tipe input (text, email, password, number, etc)
 * @param {string} error - Pesan error
 * @param {boolean} required - Apakah input required
 * @param {string} placeholder - Placeholder text
 */
const Input = forwardRef(({
    label,
    type = 'text',
    error,
    required = false,
    placeholder,
    className = '',
    id,
    ...props
}, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                ref={ref}
                id={inputId}
                type={type}
                placeholder={placeholder}
                className={`
          w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-petrolab-primary focus:border-transparent
          ${error ? 'border-red-500' : 'border-gray-300'}
          transition-colors duration-200
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;