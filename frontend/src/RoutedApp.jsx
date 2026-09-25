import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import CreateKundli from './pages/CreateKundli.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EditKundli from './pages/EditKundli.jsx';
import KundliView from './pages/KundliView.jsx';
import Login from './pages/HoroscopeLogin.jsx';
import Register from './pages/Register.jsx';

function HomeRedirect() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="page-status">Restoring your session...</div>;
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}
function PublicOnly({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="page-status">Restoring your session...</div>;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}
export default function RoutedApp() {
  return <AuthProvider><div className="app-shell"><Navbar /><Routes>
    <Route path="/" element={<HomeRedirect />} />
    <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
    <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/kundli/new" element={<CreateKundli />} />
      <Route path="/kundli/:id" element={<KundliView />} />
      <Route path="/kundli/:id/edit" element={<EditKundli />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></div></AuthProvider>;
}
