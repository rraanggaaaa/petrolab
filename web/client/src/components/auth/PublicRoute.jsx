import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * PublicRoute Component
 * Untuk halaman yang hanya bisa diakses oleh user YANG BELUM LOGIN
 * Contoh: halaman login, register
 * Jika sudah login, redirect ke dashboard
 */
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Tampilkan loading spinner sambil mengecek auth status
    if (loading) {
        return <LoadingSpinner />;
    }

    // Jika sudah login, redirect ke dashboard
    // Jika belum login, tampilkan children (halaman login/register)
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;