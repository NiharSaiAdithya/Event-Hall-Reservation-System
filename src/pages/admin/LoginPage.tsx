import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Crown, LogIn } from 'lucide-react';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);
    if (error) {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
      return;
    }

    navigate('/admin');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-navy-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-champagne-500/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-champagne-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-champagne-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-champagne-500 to-champagne-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-charcoal-900">Admin Portal</h1>
            <p className="text-sm text-charcoal-500 mt-1">Grand Celebration Event Hall</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 transition-colors bg-ivory-50"
                placeholder="admin@grandcelebration.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 transition-colors bg-ivory-50"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-champagne-600 to-champagne-700 text-white font-semibold rounded-lg hover:from-champagne-700 hover:to-champagne-800 transition-all shadow-md disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
