import { forwardRef } from 'react';

/**
 * Select Component
 * Dropdown select dengan label dan error handling
 * @param {string} label - Label select
 * @param {array} options - Array of options { value, label }
 * @param {string} error - Pesan error
 * @param {boolean} required - Apakah select required
 */
const Select = forwardRef(({
    label,
    options = [],
    error,
    required = false,
    placeholder = 'Select an option',
    className = '',
    id,
    ...props
}, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <select
                ref={ref}
                id={selectId}
                className={`
          w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-petrolab-primary focus:border-transparent
          ${error ? 'border-red-500' : 'border-gray-300'}
          bg-white transition-colors duration-200
        `}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;