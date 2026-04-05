/**
 * LoadingSpinner Component
 * Menampilkan animasi loading spinner
 * @param {string} size - Ukuran spinner: 'sm', 'md', 'lg'
 * @param {string} color - Warna spinner (menggunakan Tailwind color)
 * @param {string} text - Teks yang ditampilkan di bawah spinner
 */
const LoadingSpinner = ({ size = 'md', color = 'petrolab-primary', text = 'Loading...' }) => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    };

    return (
        <div className="min-h-[200px] flex items-center justify-center">
            <div className="text-center">
                <div
                    className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} border-${color}`}
                ></div>
                {text && <p className="mt-4 text-gray-600">{text}</p>}
            </div>
        </div>
    );
};

export default LoadingSpinner;