// web/src/components/common/Layout.jsx
// Main layout with sidebar (desktop) and bottom nav (mobile)

import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: 'डॅशबोर्ड', icon: '🏠', exact: true },
  { to: '/groups', label: 'गट', icon: '🏘️' },
  { to: '/profile', label: 'प्रोफाइल', icon: '👤' },
];

export default function Layout() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-green-700 text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏦</span>
          <span className="font-bold text-lg">बचत गट</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-green-200 text-sm">{profile?.name}</span>
          <button
            onClick={handleLogout}
            className="text-green-200 hover:text-white text-sm border border-green-500 px-3 py-1 rounded-lg"
          >
            बाहेर
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation (mobile-first) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-50">
        {NAV_ITEMS.map(({ to, label, icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition ${
                isActive ? 'text-green-700' : 'text-gray-400'
              }`
            }
          >
            <span className="text-xl">{icon}</span>
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}