import { Crown, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBusinessSettings } from '../../hooks/useBusinessSettings';

export function Footer() {
  const { settings } = useBusinessSettings();

  return (
    <footer className="bg-charcoal-900 text-ivory-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-champagne-500 to-champagne-700 flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-serif font-bold text-white text-lg">Grand Celebration</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-champagne-400">Event Hall</p>
              </div>
            </div>
            <p className="text-sm text-ivory-400 leading-relaxed">
              A premium event space designed for life's most important celebrations.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/packages', label: 'Event Packages' },
                { to: '/about', label: 'About Venue' },
                { to: '/reservation', label: 'Reservation' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-ivory-400 hover:text-champagne-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-white mb-4">Event Types</h4>
            <ul className="space-y-2 text-sm text-ivory-400">
              <li>Wedding Receptions</li>
              <li>Birthday Celebrations</li>
              <li>Corporate Events</li>
              <li>Engagement Ceremonies</li>
              <li>Private Functions</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-ivory-400">
                <MapPin className="w-4 h-4 mt-0.5 text-champagne-400 flex-shrink-0" />
                {settings.business_address}
              </li>
              <li className="flex items-center gap-3 text-sm text-ivory-400">
                <Phone className="w-4 h-4 text-champagne-400 flex-shrink-0" />
                {settings.business_phone}
              </li>
              <li className="flex items-center gap-3 text-sm text-ivory-400">
                <Mail className="w-4 h-4 text-champagne-400 flex-shrink-0" />
                {settings.business_email}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-charcoal-700 text-center">
          <p className="text-sm text-ivory-500">
            &copy; {new Date().getFullYear()} {settings.business_name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
