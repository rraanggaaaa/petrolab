/**
 * Card Component
 * Container dengan styling card
 * @param {ReactNode} children - Konten card
 * @param {string} className - Additional CSS classes
 * @param {boolean} hoverable - Efek hover
 * @param {boolean} bordered - Border card
 */
const Card = ({ children, className = '', hoverable = false, bordered = true }) => {
    const baseClasses = 'bg-white rounded-lg shadow-sm overflow-hidden';
    const hoverClasses = hoverable ? 'hover:shadow-lg transition-shadow duration-300 cursor-pointer' : '';
    const borderClasses = bordered ? 'border border-gray-200' : '';

    return (
        <div className={`${baseClasses} ${hoverClasses} ${borderClasses} ${className}`}>
            {children}
        </div>
    );
};

// Subcomponent untuk Card Header
Card.Header = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
        {children}
    </div>
);

// Subcomponent untuk Card Body
Card.Body = ({ children, className = '' }) => (
    <div className={`px-6 py-4 ${className}`}>
        {children}
    </div>
);

// Subcomponent untuk Card Footer
Card.Footer = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`}>
        {children}
    </div>
);

export default Card;