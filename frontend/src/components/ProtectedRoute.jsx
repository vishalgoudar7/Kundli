import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth(); const location = useLocation();
  if (loading) return <div className="page-status">Restoring your session...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}
