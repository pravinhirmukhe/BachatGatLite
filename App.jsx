// web/src/App.jsx
// Root component with routing and auth guard

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './context/AuthContext';
import '../src/i18n';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import GroupsPage from './pages/GroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import MembersPage from './pages/MembersPage';
import SavingsPage from './pages/SavingsPage';
import LoansPage from './pages/LoansPage';
import ProfilePage from './pages/ProfilePage';

// Layout
import Layout from './components/common/Layout';

// Route guard: redirect to login if not authenticated
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">लोड होत आहे...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

// Redirect to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route
        path="/"
        element={<PrivateRoute><Layout /></PrivateRoute>}
      >
        <Route index element={<DashboardPage />} />
        <Route path="groups" element={<GroupsPage />} />
        <Route path="groups/:groupId" element={<GroupDetailPage />} />
        <Route path="groups/:groupId/members" element={<MembersPage />} />
        <Route path="groups/:groupId/savings" element={<SavingsPage />} />
        <Route path="groups/:groupId/loans" element={<LoansPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}