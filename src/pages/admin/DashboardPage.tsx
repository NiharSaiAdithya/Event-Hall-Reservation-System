import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  TrendingUp,
  Users,
} from 'lucide-react';
import { format } from 'date-fns';
import type { Appointment, Service } from '../../types/database';

interface Stats {
  upcoming: number;
  pending: number;
  completed: number;
  cancelled: number;
  activePackages: number;
  totalRevenue: number;
}

export function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ upcoming: 0, pending: 0, completed: 0, cancelled: 0, activePackages: 0, totalRevenue: 0 });
  const [recentReservations, setRecentReservations] = useState<(Appointment & { service?: Service })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    const today = format(new Date(), 'yyyy-MM-dd');

    const [appointmentsRes, servicesRes] = await Promise.all([
      supabase.from('appointments').select('*, services(*)').order('appointment_date', { ascending: false }),
      supabase.from('services').select('*'),
    ]);

    const appointments = (appointmentsRes.data ?? []) as (Appointment & { services?: Service })[];
    const services = servicesRes.data ?? [];

    const upcoming = appointments.filter(a => a.appointment_date >= today && a.status !== 'cancelled' && a.status !== 'completed').length;
    const pending = appointments.filter(a => a.status === 'pending').length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;
    const activePackages = services.filter(s => s.is_active).length;

    const completedAppointments = appointments.filter(a => a.status === 'completed');
    const totalRevenue = completedAppointments.reduce((sum, a) => {
      const svc = services.find(s => s.id === a.service_id);
      return sum + (svc?.price ?? 0);
    }, 0);

    setStats({ upcoming, pending, completed, cancelled, activePackages, totalRevenue });

    const recent = appointments.slice(0, 8).map(a => ({
      ...a,
      service: a.services ?? undefined,
    }));
    setRecentReservations(recent);
    setLoading(false);
  }

  if (loading) return <LoadingSpinner size="lg" />;

  const statCards = [
    { label: 'Upcoming', value: stats.upcoming, icon: CalendarCheck, color: 'text-blue-600 bg-blue-50' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'text-red-600 bg-red-50' },
    { label: 'Active Packages', value: stats.activePackages, icon: Package, color: 'text-purple-600 bg-purple-50' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-champagne-700 bg-champagne-50' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-charcoal-900">Dashboard Overview</h1>
        <p className="text-charcoal-500 mt-1">Welcome back to Grand Celebration Event Hall admin.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-6 border border-champagne-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-charcoal-500">{label}</p>
                <p className="text-2xl font-bold text-charcoal-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reservations */}
      <div className="bg-white rounded-xl border border-champagne-100">
        <div className="px-6 py-4 border-b border-champagne-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-champagne-600" />
          <h2 className="font-serif font-bold text-charcoal-900">Recent Reservations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-champagne-100 bg-ivory-50">
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-charcoal-500 font-medium">Customer</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-charcoal-500 font-medium">Package</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-charcoal-500 font-medium">Date</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-charcoal-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentReservations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-charcoal-400">No reservations yet.</td>
                </tr>
              ) : (
                recentReservations.map((apt) => (
                  <tr key={apt.id} className="border-b border-champagne-50 hover:bg-ivory-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-charcoal-900 text-sm">{apt.customer_name}</p>
                      <p className="text-xs text-charcoal-400">{apt.customer_email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal-700">{apt.service?.name ?? '—'}</td>
                    <td className="px-6 py-4 text-sm text-charcoal-700">
                      {format(new Date(apt.appointment_date + 'T00:00:00'), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={apt.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
