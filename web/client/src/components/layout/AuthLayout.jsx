/**
 * AuthLayout Component
 * Layout untuk halaman autentikasi (login/register)
 * Tanpa header dan footer, hanya menampilkan children (form login/register)
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
};

export default AuthLayout;