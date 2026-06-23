import { Link } from 'react-router-dom';
import { useServices } from '../../hooks/useServices';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Clock, ArrowRight, Heart, PartyPopper, Building2, GlassWater, Gem, Crown } from 'lucide-react';

const packageIcons = [Heart, PartyPopper, Building2, GlassWater, Gem, Crown];

export function PackagesPage() {
  const { services, loading } = useServices(true);

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-navy-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-72 h-72 bg-champagne-500/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-champagne-600/20 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-champagne-400 font-medium mb-3">Our Offerings</p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">Event Packages</h1>
          <p className="text-lg text-ivory-300 max-w-2xl mx-auto">
            Discover our premium event packages, thoughtfully designed for every celebration.
          </p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-20 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <LoadingSpinner />
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-charcoal-500 text-lg">No packages available at the moment.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, i) => {
                const Icon = packageIcons[i % packageIcons.length];
                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl overflow-hidden border border-champagne-100 hover:border-champagne-300 hover:shadow-xl transition-all group"
                  >
                    <div className="h-3 bg-gradient-to-r from-champagne-500 to-champagne-700" />
                    <div className="p-8">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-champagne-500 to-champagne-700 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-serif font-bold text-charcoal-900 text-xl mb-3">{service.name}</h3>
                      <p className="text-sm text-charcoal-500 leading-relaxed mb-6">{service.description}</p>

                      <div className="flex items-center gap-4 text-sm text-charcoal-400 mb-6">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {service.duration_minutes >= 60
                            ? `${Math.floor(service.duration_minutes / 60)}h${service.duration_minutes % 60 ? ` ${service.duration_minutes % 60}m` : ''}`
                            : `${service.duration_minutes}m`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-champagne-100">
                        <div>
                          <p className="text-3xl font-bold text-champagne-700">${service.price.toLocaleString()}</p>
                          <p className="text-xs text-charcoal-400 mt-0.5">per event</p>
                        </div>
                        <Link
                          to="/reservation"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-champagne-600 to-champagne-700 text-white text-sm font-semibold rounded-lg hover:from-champagne-700 hover:to-champagne-800 transition-all shadow-md"
                        >
                          Reserve
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
