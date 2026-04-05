import { useEffect } from 'react';

/**
 * Modal Component
 * Menampilkan modal dialog
 * @param {boolean} isOpen - Status modal terbuka/tutup
 * @param {function} onClose - Fungsi untuk menutup modal
 * @param {string} title - Judul modal
 * @param {ReactNode} children - Konten modal
 * @param {string} size - Ukuran modal: 'sm', 'md', 'lg', 'xl'
 */
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    // Prevent scroll when modal is open - HARUS dipanggil sebelum conditional return
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle ESC key - HARUS dipanggil sebelum conditional return
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Jika modal tidak terbuka, return null (setelah semua hooks)
    if (!isOpen) return null;

    // Handle click outside
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div className={`${sizeClasses[size]} bg-white rounded-lg shadow-xl w-full transform transition-all animate-fade-in`}>
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                    {children}
                </div>

                {/* Footer with close button */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;