import { useState } from 'react';
import { useServices } from '../../hooks/useServices';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Package, Plus, Pencil, X, Check } from 'lucide-react';

interface PackageForm {
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
}

const emptyForm: PackageForm = { name: '', description: '', duration_minutes: 60, price: 0, is_active: true };

export function PackagesPage() {
  const { services, loading, refetch } = useServices();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PackageForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(service: typeof services[0]) {
    setForm({
      name: service.name,
      description: service.description,
      duration_minutes: service.duration_minutes,
      price: service.price,
      is_active: service.is_active,
    });
    setEditingId(service.id);
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (editingId) {
      await supabase.from('services').update(form).eq('id', editingId);
    } else {
      await supabase.from('services').insert(form);
    }

    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    refetch();
  }

  async function toggleActive(id: string, currentActive: boolean) {
    await supabase.from('services').update({ is_active: !currentActive }).eq('id', id);
    refetch();
  }

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal-900">Event Packages</h1>
          <p className="text-charcoal-500 mt-1">Manage your venue's event packages.</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-champagne-600 to-champagne-700 text-white text-sm font-semibold rounded-lg hover:from-champagne-700 hover:to-champagne-800 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Package
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service) => (
          <div key={service.id} className={`bg-white rounded-xl p-6 border ${service.is_active ? 'border-champagne-100' : 'border-gray-200 opacity-60'} hover:shadow-md transition-all`}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-champagne-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-champagne-700" />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(service)}
                  className="p-2 rounded-lg text-charcoal-400 hover:text-champagne-700 hover:bg-champagne-50 transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-serif font-bold text-charcoal-900 mb-1">{service.name}</h3>
            <p className="text-sm text-charcoal-500 line-clamp-2 mb-4">{service.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-champagne-50">
              <div>
                <p className="text-lg font-bold text-champagne-700">${service.price.toLocaleString()}</p>
                <p className="text-xs text-charcoal-400">{service.duration_minutes} min</p>
              </div>
              <button
                onClick={() => toggleActive(service.id, service.is_active)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  service.is_active
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {service.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-champagne-100">
          <Package className="w-12 h-12 mx-auto mb-4 text-charcoal-300" />
          <p className="text-charcoal-500">No packages yet. Add your first event package to get started.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-champagne-100 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-serif font-bold text-charcoal-900">
                {editingId ? 'Edit Package' : 'Add Package'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-ivory-100">
                <X className="w-5 h-5 text-charcoal-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Package Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 bg-ivory-50"
                  placeholder="e.g., Wedding Hall Package"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 bg-ivory-50 resize-none"
                  placeholder="Describe the event package..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Duration (minutes)</label>
                  <input
                    type="number"
                    required
                    min={30}
                    value={form.duration_minutes}
                    onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 bg-ivory-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Price ($)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 bg-ivory-50"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-champagne-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
                <span className="text-sm text-charcoal-700">Active</span>
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
                  {saving ? 'Saving...' : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
