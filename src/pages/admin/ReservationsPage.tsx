import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import type { Appointment, Service } from '../../types/database';
import { format } from 'date-fns';
import { CalendarCheck, Filter, Eye, X } from 'lucide-react';

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed';

export function ReservationsPage() {
  const [appointments, setAppointments] = useState<(Appointment & { services?: Service })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [selectedApt, setSelectedApt] = useState<(Appointment & { services?: Service }) | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    setLoading(true);
    const { data } = await supabase
      .from('appointments')
      .select('*, services(*)')
      .order('appointment_date', { ascending: false });
    setAppointments((data ?? []) as (Appointment & { services?: Service })[]);
    setLoading(false);
  }

  async function updateStatus(id: string, status: Appointment['status']) {
    await supabase.from('appointments').update({ status }).eq('id', id);
    fetchAppointments();
    if (selectedApt?.id === id) setSelectedApt(null);
  }

  function formatTime(time: string) {
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${h12}:${m} ${ampm}`;
  }

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal-900">Reservations</h1>
          <p className="text-charcoal-500 mt-1">Manage all event reservations.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-charcoal-400" />
        {(['all', 'pending', 'confirmed', 'cancelled', 'completed'] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === s
                ? 'bg-champagne-100 text-champagne-800 border border-champagne-300'
                : 'text-charcoal-500 hover:bg-ivory-100 border border-transparent'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className="ml-1.5 text-xs">
              ({s === 'all' ? appointments.length : appointments.filter(a => a.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-champagne-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-champagne-100 bg-ivory-50">
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-charcoal-500 font-medium">Customer</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-charcoal-500 font-medium">Package</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-charcoal-500 font-medium">Date & Time</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-charcoal-500 font-medium">Contact</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-charcoal-500 font-medium">Status</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-charcoal-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-charcoal-400">
                    <CalendarCheck className="w-10 h-10 mx-auto mb-3 text-charcoal-300" />
                    No reservations found.
                  </td>
                </tr>
              ) : (
                filtered.map((apt) => (
                  <tr key={apt.id} className="border-b border-champagne-50 hover:bg-ivory-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-charcoal-900 text-sm">{apt.customer_name}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal-700">{apt.services?.name ?? '—'}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-charcoal-900">{format(new Date(apt.appointment_date + 'T00:00:00'), 'MMM d, yyyy')}</p>
                      <p className="text-xs text-charcoal-400">{formatTime(apt.start_time)} - {formatTime(apt.end_time)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-charcoal-700">{apt.customer_email}</p>
                      <p className="text-xs text-charcoal-400">{apt.customer_phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedApt(apt)}
                          className="p-2 rounded-lg text-charcoal-400 hover:text-champagne-700 hover:bg-champagne-50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {apt.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(apt.id, 'confirmed')}
                              className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => updateStatus(apt.id, 'cancelled')}
                              className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => updateStatus(apt.id, 'completed')}
                            className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-champagne-100 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-serif font-bold text-charcoal-900">Reservation Details</h3>
              <button onClick={() => setSelectedApt(null)} className="p-1 rounded-lg hover:bg-ivory-100">
                <X className="w-5 h-5 text-charcoal-400" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Customer', value: selectedApt.customer_name },
                { label: 'Package', value: selectedApt.services?.name ?? '—' },
                { label: 'Date', value: format(new Date(selectedApt.appointment_date + 'T00:00:00'), 'MMMM d, yyyy') },
                { label: 'Time', value: `${formatTime(selectedApt.start_time)} - ${formatTime(selectedApt.end_time)}` },
                { label: 'Email', value: selectedApt.customer_email },
                { label: 'Phone', value: selectedApt.customer_phone },
                { label: 'Notes', value: selectedApt.notes || 'No notes' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-sm text-charcoal-400">{label}</span>
                  <span className="text-sm font-medium text-charcoal-900 text-right max-w-[60%]">{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <span className="text-sm text-charcoal-400">Status</span>
                <StatusBadge status={selectedApt.status} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
