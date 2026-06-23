import { useState } from 'react';
import { useBusinessSettings } from '../../hooks/useBusinessSettings';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Settings, Save, CheckCircle } from 'lucide-react';

export function SettingsPage() {
  const { settings, loading, refetch } = useBusinessSettings();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [initialized, setInitialized] = useState(false);

  if (!initialized && !loading) {
    setForm(settings);
    setInitialized(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const data = {
      business_name: form.business_name,
      business_email: form.business_email,
      business_phone: form.business_phone,
      business_address: form.business_address,
      slot_interval_minutes: form.slot_interval_minutes,
      booking_notice_hours: form.booking_notice_hours,
    };

    if (settings.id) {
      await supabase.from('business_settings').update(data).eq('id', settings.id);
    } else {
      await supabase.from('business_settings').insert(data);
    }

    setSaving(false);
    setSaved(true);
    refetch();
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <LoadingSpinner size="lg" />;

  const fields = [
    { key: 'business_name', label: 'Hall Name', type: 'text', placeholder: 'Grand Celebration Event Hall' },
    { key: 'business_email', label: 'Email', type: 'email', placeholder: 'info@grandcelebration.com' },
    { key: 'business_phone', label: 'Phone', type: 'tel', placeholder: '(555) 123-4567' },
    { key: 'business_address', label: 'Address', type: 'text', placeholder: '123 Celebration Avenue' },
  ] as const;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal-900">Business Settings</h1>
          <p className="text-charcoal-500 mt-1">Manage your venue's core information and booking rules.</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Venue Information */}
          <div className="bg-white rounded-xl p-6 border border-champagne-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-champagne-100 flex items-center justify-center">
                <Settings className="w-5 h-5 text-champagne-700" />
              </div>
              <h2 className="font-serif font-bold text-charcoal-900 text-lg">Venue Information</h2>
            </div>

            <div className="space-y-4">
              {fields.map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5">{label}</label>
                  <input
                    type={type}
                    required
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-4 py-2.5 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 bg-ivory-50"
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Booking Rules */}
          <div className="bg-white rounded-xl p-6 border border-champagne-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-champagne-100 flex items-center justify-center">
                <Settings className="w-5 h-5 text-champagne-700" />
              </div>
              <h2 className="font-serif font-bold text-charcoal-900 text-lg">Booking Rules</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Slot Interval (minutes)</label>
                <input
                  type="number"
                  required
                  min={15}
                  value={form.slot_interval_minutes}
                  onChange={(e) => setForm({ ...form, slot_interval_minutes: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 bg-ivory-50"
                />
                <p className="text-xs text-charcoal-400 mt-1">How often time slots are generated (e.g., every 60 minutes).</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Booking Notice (hours)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.booking_notice_hours}
                  onChange={(e) => setForm({ ...form, booking_notice_hours: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 bg-ivory-50"
                />
                <p className="text-xs text-charcoal-400 mt-1">Minimum hours before an event that a reservation can be made.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-champagne-600 to-champagne-700 text-white font-semibold rounded-lg hover:from-champagne-700 hover:to-champagne-800 transition-all shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
              <CheckCircle className="w-4 h-4" />
              Settings saved successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
