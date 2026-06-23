import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicLayout } from './components/public/PublicLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

import { HomePage } from './pages/public/HomePage';
import { PackagesPage } from './pages/public/PackagesPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { ReservationPage } from './pages/public/ReservationPage';

import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ReservationsPage } from './pages/admin/ReservationsPage';
import { PackagesPage as AdminPackagesPage } from './pages/admin/PackagesPage';
import { BusinessHoursPage } from './pages/admin/BusinessHoursPage';
import { BlockedDatesPage } from './pages/admin/BlockedDatesPage';
import { SettingsPage } from './pages/admin/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/reservation" element={<ReservationPage />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="packages" element={<AdminPackagesPage />} />
            <Route path="business-hours" element={<BusinessHoursPage />} />
            <Route path="blocked-dates" element={<BlockedDatesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
