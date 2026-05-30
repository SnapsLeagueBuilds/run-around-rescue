import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

export default function ProtectedRoute({ fallback = <DefaultFallback />, unauthenticatedElement, adminOnly = false }) {
  const { isAuthenticated, isLoadingAuth, authChecked, user } = useAuth();

  // Still loading — show spinner
  if (isLoadingAuth || !authChecked) {
    return fallback;
  }

  // Not logged in — redirect to login
  if (!isAuthenticated) {
    return unauthenticatedElement;
  }

  // Logged in but not admin — redirect to home
  if (adminOnly && user?.user_metadata?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}