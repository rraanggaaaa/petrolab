/**
 * Badge Component
 * Label status dengan berbagai warna
 * @param {string} variant - 'primary', 'success', 'warning', 'danger', 'info'
 * @param {ReactNode} children - Konten badge
 * @param {boolean} rounded - Membuat badge rounded penuh
 */
const Badge = ({ variant = 'primary', children, rounded = true, className = '' }) => {
    const variants = {
        primary: 'bg-blue-100 text-blue-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-gray-100 text-gray-800',
    };

    const roundedClass = rounded ? 'rounded-full' : 'rounded';
    const variantClass = variants[variant] || variants.primary;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${roundedClass} ${variantClass} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;