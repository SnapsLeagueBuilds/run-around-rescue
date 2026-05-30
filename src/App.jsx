import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

import PublicLayout from '@/components/public/PublicLayout';
import Home from '@/pages/Home';
import Dogs from '@/pages/Dogs';
import DogDetail from '@/pages/DogDetail';
import Events from '@/pages/Events';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Donate from '@/pages/Donate';
import MemorialWall from '@/pages/MemorialWall';

import AdminLayout from '@/components/admin/AdminLayout';
import ManageDogs from '@/pages/admin/ManageDogs';
import Inquiries from '@/pages/admin/Inquiries';
import ManageEvents from '@/pages/admin/ManageEvents';
import SeoSettings from '@/pages/admin/SeoSettings';
import UserManagement from '@/pages/admin/UserManagement';
import SeoHead from '@/components/SeoHead';

const AuthenticatedApp = () => {
  const { isLoadingAuth } = useAuth();

  // Show spinner while checking if user is logged in
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dogs" element={<Dogs />} />
        <Route path="/dogs/:id" element={<DogDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/memorial" element={<MemorialWall />} />
      </Route>

      {/* Admin routes - protected, admin role only */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} adminOnly />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<ManageDogs />} />
          <Route path="/admin/inquiries" element={<Inquiries />} />
          <Route path="/admin/events" element={<ManageEvents />} />
          <Route path="/admin/seo" element={<SeoSettings />} />
          <Route path="/admin/users" element={<UserManagement />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <SeoHead />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App