import { Link } from 'react-router-dom';
import { useServices } from '../../hooks/useServices';
import { useBusinessSettings } from '../../hooks/useBusinessSettings';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import {
  Crown,
  Star,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  Heart,
  Building2,
  PartyPopper,
  GlassWater,
  Gem,
} from 'lucide-react';

const features = [
  { icon: Building2, title: 'Spacious Halls', desc: 'Elegant venues up to 500 guests with flexible layouts' },
  { icon: Sparkles, title: 'Premium Interiors', desc: 'Luxury décor and ambient lighting throughout' },
  { icon: Users, title: 'Professional Support', desc: 'Dedicated event coordinators for every occasion' },
  { icon: Star, title: 'Modern Facilities', desc: 'State-of-the-art sound, lighting, and catering' },
];

const stats = [
  { value: '500+', label: 'Events Hosted' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '15+', label: 'Years of Excellence' },
  { value: '50K+', label: 'Happy Guests' },
];

const packageIcons = [Heart, PartyPopper, Building2, GlassWater, Gem, Crown];

export function HomePage() {
  const { services, loading } = useServices(true);
  const { settings } = useBusinessSettings();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-navy-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-champagne-500/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-champagne-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-champagne-400/10 rounded-full blur-[150px]" />
        </div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212,175,55,0.08) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-champagne-500/10 border border-champagne-500/20 mb-8">
              <Crown className="w-4 h-4 text-champagne-400" />
              <span className="text-sm text-champagne-300 font-medium">Premium Event Venue</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6">
              Reserve the Perfect Venue for Life's Most Important{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-champagne-400 to-champagne-600">
                Celebrations
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-ivory-300 leading-relaxed mb-10 max-w-2xl">
              Host weddings, receptions, birthdays, corporate events, and private functions
              in a premium event space designed for unforgettable experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/reservation"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-champagne-500 to-champagne-600 text-charcoal-900 font-semibold rounded-xl hover:from-champagne-400 hover:to-champagne-500 transition-all shadow-lg shadow-champagne-500/25 hover:shadow-champagne-500/40 text-base"
              >
                Reserve Your Date
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/packages"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-champagne-500/30 text-champagne-300 font-semibold rounded-xl hover:bg-champagne-500/10 hover:border-champagne-500/50 transition-all text-base"
              >
                View Packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-y border-champagne-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-serif font-bold text-champagne-700">{stat.value}</p>
                <p className="text-sm text-charcoal-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-[0.2em] text-champagne-600 font-medium mb-3">Why Choose Us</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-900">
              A Venue Like No Other
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-8 border border-champagne-100 hover:border-champagne-300 hover:shadow-lg hover:shadow-champagne-100/50 transition-all group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-champagne-100 to-champagne-200 flex items-center justify-center mb-5 group-hover:from-champagne-200 group-hover:to-champagne-300 transition-all">
                  <Icon className="w-7 h-7 text-champagne-700" />
                </div>
                <h3 className="font-serif font-bold text-charcoal-900 text-lg mb-2">{title}</h3>
                <p className="text-sm text-charcoal-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Packages */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-[0.2em] text-champagne-600 font-medium mb-3">Our Offerings</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-900">
              Event Packages
            </h2>
            <p className="text-charcoal-500 mt-3 max-w-2xl mx-auto">
              Choose from our curated selection of event packages, each designed to create memorable celebrations.
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 6).map((service, i) => {
                const Icon = packageIcons[i % packageIcons.length];
                return (
                  <div key={service.id} className="bg-ivory-50 rounded-2xl p-8 border border-champagne-100 hover:border-champagne-300 hover:shadow-xl transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-champagne-500 to-champagne-700 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-serif font-bold text-charcoal-900 text-xl mb-2">{service.name}</h3>
                    <p className="text-sm text-charcoal-500 leading-relaxed mb-5">{service.description}</p>
                    <div className="flex items-center justify-between pt-5 border-t border-champagne-100">
                      <div>
                        <p className="text-2xl font-bold text-champagne-700">${service.price.toLocaleString()}</p>
                        <p className="text-xs text-charcoal-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {service.duration_minutes >= 60
                            ? `${Math.floor(service.duration_minutes / 60)}h${service.duration_minutes % 60 ? ` ${service.duration_minutes % 60}m` : ''}`
                            : `${service.duration_minutes}m`}
                        </p>
                      </div>
                      <Link
                        to="/reservation"
                        className="px-5 py-2.5 bg-gradient-to-r from-champagne-600 to-champagne-700 text-white text-sm font-semibold rounded-lg hover:from-champagne-700 hover:to-champagne-800 transition-all shadow-md"
                      >
                        Reserve
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {services.length > 6 && (
            <div className="text-center mt-10">
              <Link to="/packages" className="inline-flex items-center gap-2 text-champagne-700 font-semibold hover:text-champagne-800 transition-colors">
                View All Packages <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-champagne-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-champagne-600/15 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-5">
            Ready to Create Unforgettable Memories?
          </h2>
          <p className="text-lg text-ivory-300 mb-10 max-w-2xl mx-auto">
            Book {settings.business_name} for your next celebration. Our team is ready to help you plan the perfect event.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/reservation"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-champagne-500 to-champagne-600 text-charcoal-900 font-semibold rounded-xl hover:from-champagne-400 hover:to-champagne-500 transition-all shadow-lg shadow-champagne-500/25"
            >
              <Calendar className="w-5 h-5" />
              Reserve Your Date
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-champagne-500/30 text-champagne-300 font-semibold rounded-xl hover:bg-champagne-500/10 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
