import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import type { BlockedDate } from '../../types/database';
import { format } from 'date-fns';
import { CalendarOff, Plus, Trash2, X, Check } from 'lucide-react';

export function BlockedDatesPage() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newReason, setNewReason] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  async function fetchBlockedDates() {
    setLoading(true);
    const { data } = await supabase
      .from('blocked_dates')
      .select('*')
      .order('blocked_date', { ascending: true });
    setBlockedDates(data ?? []);
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from('blocked_dates').insert({
      blocked_date: newDate,
      reason: newReason || null,
    });
    setSaving(false);
    setShowForm(false);
    setNewDate('');
    setNewReason('');
    fetchBlockedDates();
  }

  async function handleRemove(id: string) {
    await supabase.from('blocked_dates').delete().eq('id', id);
    fetchBlockedDates();
  }

  if (loading) return <LoadingSpinner size="lg" />;

  const reasonSuggestions = ['Maintenance Day', 'Private Event', 'Holiday', 'Venue Closure', 'Renovation'];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal-900">Blocked Dates</h1>
          <p className="text-charcoal-500 mt-1">Block dates when the venue is unavailable for reservations.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-champagne-600 to-champagne-700 text-white text-sm font-semibold rounded-lg hover:from-champagne-700 hover:to-champagne-800 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Block Date
        </button>
      </div>

      {/* Blocked Dates List */}
      <div className="bg-white rounded-xl border border-champagne-100 overflow-hidden">
        {blockedDates.length === 0 ? (
          <div className="text-center py-16">
            <CalendarOff className="w-12 h-12 mx-auto mb-4 text-charcoal-300" />
            <p className="text-charcoal-500">No blocked dates. All dates are available for reservations.</p>
          </div>
        ) : (
          <div className="divide-y divide-champagne-50">
            {blockedDates.map((bd) => (
              <div key={bd.id} className="flex items-center justify-between px-6 py-4 hover:bg-ivory-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <CalendarOff className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium text-charcoal-900">
                      {format(new Date(bd.blocked_date + 'T00:00:00'), 'EEEE, MMMM d, yyyy')}
                    </p>
                    {bd.reason && <p className="text-sm text-charcoal-400 mt-0.5">{bd.reason}</p>}
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(bd.id)}
                  className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-champagne-100 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-serif font-bold text-charcoal-900">Block a Date</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-ivory-100">
                <X className="w-5 h-5 text-charcoal-400" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 bg-ivory-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Reason (Optional)</label>
                <input
                  type="text"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full px-4 py-2.5 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 bg-ivory-50"
                  placeholder="e.g., Maintenance Day"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {reasonSuggestions.map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setNewReason(reason)}
                      className="px-3 py-1 text-xs rounded-full border border-champagne-200 text-charcoal-500 hover:bg-champagne-50 hover:text-champagne-700 transition-colors"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-charcoal-700 border border-champagne-200 rounded-lg hover:bg-ivory-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-champagne-600 to-champagne-700 text-white text-sm font-semibold rounded-lg hover:from-champagne-700 hover:to-champagne-800 transition-all disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Block Date'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
