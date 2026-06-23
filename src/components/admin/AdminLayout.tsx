import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Package,
  Clock,
  CalendarOff,
  Settings,
  LogOut,
  Crown,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { useState } from 'react';

const sidebarLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
  { to: '/admin/reservations', icon: CalendarCheck, label: 'Reservations' },
  { to: '/admin/packages', icon: Package, label: 'Packages' },
  { to: '/admin/business-hours', icon: Clock, label: 'Business Hours' },
  { to: '/admin/blocked-dates', icon: CalendarOff, label: 'Blocked Dates' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminLayout() {
  const { signOut } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(to: string, exact?: boolean) {
    return exact ? location.pathname === to : location.pathname.startsWith(to);
  }

  return (
    <div className="min-h-screen flex bg-ivory-50">
      <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-charcoal-900 text-white flex flex-col transition-all duration-300 fixed inset-y-0 left-0 z-40`}>
        <div className="p-4 border-b border-charcoal-700 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-champagne-500 to-champagne-700 flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-serif font-bold text-sm leading-tight">Admin Panel</p>
                <p className="text-[9px] uppercase tracking-widest text-champagne-400">Grand Celebration</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-charcoal-700 text-ivory-400 transition-colors"
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {sidebarLinks.map(({ to, icon: Icon, label, exact }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(to, exact)
                  ? 'bg-champagne-600/20 text-champagne-400'
                  : 'text-ivory-400 hover:bg-charcoal-800 hover:text-white'
              }`}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-charcoal-700">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ivory-400 hover:bg-charcoal-800 hover:text-white transition-all mb-1"
            title={collapsed ? 'View Website' : undefined}
          >
            <ChevronLeft className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>View Website</span>}
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all w-full"
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <div className={`flex-1 ${collapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
