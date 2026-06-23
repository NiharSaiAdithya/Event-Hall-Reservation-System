import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Crown } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/packages', label: 'Event Packages' },
  { to: '/about', label: 'About Venue' },
  { to: '/reservation', label: 'Reservation' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-champagne-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-champagne-500 to-champagne-700 flex items-center justify-center shadow-lg group-hover:shadow-champagne-300/50 transition-shadow">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-serif font-bold text-charcoal-900 leading-tight">Grand Celebration</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-champagne-600 font-medium">Event Hall</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.to
                    ? 'bg-champagne-100 text-champagne-800'
                    : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-ivory-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/reservation"
              className="ml-3 px-5 py-2.5 bg-gradient-to-r from-champagne-600 to-champagne-700 text-white text-sm font-semibold rounded-lg hover:from-champagne-700 hover:to-champagne-800 transition-all shadow-md hover:shadow-lg"
            >
              Reserve Your Date
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-charcoal-600 hover:bg-ivory-100"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-champagne-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.to
                    ? 'bg-champagne-100 text-champagne-800'
                    : 'text-charcoal-600 hover:bg-ivory-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/reservation"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center mt-3 px-5 py-3 bg-gradient-to-r from-champagne-600 to-champagne-700 text-white text-sm font-semibold rounded-lg"
            >
              Reserve Your Date
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
