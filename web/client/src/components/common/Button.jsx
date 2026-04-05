/**
 * Button Component
 * Reusable button dengan berbagai variasi
 * @param {string} variant - 'primary', 'secondary', 'success', 'danger', 'warning', 'outline'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {boolean} isLoading - Menampilkan loading state
 * @param {boolean} fullWidth - Membuat button full width
 * @param {function} onClick - Fungsi ketika button diklik
 * @param {ReactNode} children - Konten button
 */
const Button = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    onClick,
    children,
    type = 'button',
    disabled = false,
    className = '',
}) => {
    const variants = {
        primary: 'bg-petrolab-primary hover:bg-blue-700 focus:ring-blue-500 text-white',
        secondary: 'bg-petrolab-secondary hover:bg-blue-900 focus:ring-blue-800 text-white',
        success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white',
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
        warning: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400 text-white',
        outline: 'border-2 border-petrolab-primary text-petrolab-primary hover:bg-petrolab-primary hover:text-white',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';
    const widthClass = fullWidth ? 'w-full' : '';
    const variantClass = variants[variant] || variants.primary;
    const sizeClass = sizes[size] || sizes.md;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${baseClasses} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            {children}
        </button>
    );
};

export default Button;