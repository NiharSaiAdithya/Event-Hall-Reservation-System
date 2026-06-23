import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import type { BusinessHours } from '../../types/database';
import { Clock, Save } from 'lucide-react';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function BusinessHoursPage() {
  const [hours, setHours] = useState<BusinessHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchHours();
  }, []);

  async function fetchHours() {
    const { data } = await supabase.from('business_hours').select('*').order('day_of_week');
    if (data && data.length > 0) {
      setHours(data);
    } else {
      setHours(
        dayNames.map((_, i) => ({
          id: '',
          day_of_week: i,
          open_time: '09:00:00',
          close_time: '22:00:00',
          is_open: i >= 1 && i <= 6,
        }))
      );
    }
    setLoading(false);
  }

  function updateHour(index: number, field: keyof BusinessHours, value: string | boolean) {
    const updated = [...hours];
    updated[index] = { ...updated[index], [field]: value };
    setHours(updated);
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);

    for (const hour of hours) {
      const data = {
        day_of_week: hour.day_of_week,
        open_time: hour.open_time,
        close_time: hour.close_time,
        is_open: hour.is_open,
      };

      if (hour.id) {
        await supabase.from('business_hours').update(data).eq('id', hour.id);
      } else {
        await supabase.from('business_hours').insert(data);
      }
    }

    setSaving(false);
    setSaved(true);
    fetchHours();
  }

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal-900">Business Hours</h1>
          <p className="text-charcoal-500 mt-1">Manage the operating schedule for reservations.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-champagne-600 to-champagne-700 text-white text-sm font-semibold rounded-lg hover:from-champagne-700 hover:to-champagne-800 transition-all shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Hours'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-champagne-100 overflow-hidden">
        <div className="space-y-0">
          {hours.map((hour, index) => (
            <div
              key={hour.day_of_week}
              className={`flex items-center gap-6 px-6 py-4 ${index < hours.length - 1 ? 'border-b border-champagne-50' : ''} ${
                hour.is_open ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div className="w-32 flex items-center gap-3">
                <Clock className={`w-4 h-4 ${hour.is_open ? 'text-champagne-600' : 'text-gray-300'}`} />
                <span className={`font-medium text-sm ${hour.is_open ? 'text-charcoal-900' : 'text-charcoal-400'}`}>
                  {dayNames[hour.day_of_week]}
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hour.is_open}
                  onChange={(e) => updateHour(index, 'is_open', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-champagne-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>

              {hour.is_open ? (
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={hour.open_time.substring(0, 5)}
                    onChange={(e) => updateHour(index, 'open_time', e.target.value + ':00')}
                    className="px-3 py-2 border border-champagne-200 rounded-lg text-sm focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 bg-ivory-50"
                  />
                  <span className="text-charcoal-400 text-sm">to</span>
                  <input
                    type="time"
                    value={hour.close_time.substring(0, 5)}
                    onChange={(e) => updateHour(index, 'close_time', e.target.value + ':00')}
                    className="px-3 py-2 border border-champagne-200 rounded-lg text-sm focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 bg-ivory-50"
                  />
                </div>
              ) : (
                <span className="text-sm text-charcoal-400 italic">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
