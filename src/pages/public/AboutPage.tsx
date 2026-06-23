import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Sparkles,
  Star,
  ChefHat,
  Music,
  Camera,
  Armchair,
  Calendar,
  ArrowRight,
} from 'lucide-react';

const highlights = [
  { icon: Building2, title: 'Grand Ballrooms', desc: 'Multiple spacious halls with soaring ceilings and elegant chandeliers, accommodating 50 to 500 guests.' },
  { icon: Sparkles, title: 'Elegant Interiors', desc: 'Luxurious décor with marble finishes, crystal lighting, and rich fabrics that create a breathtaking atmosphere.' },
  { icon: Armchair, title: 'Flexible Layouts', desc: 'Customizable seating arrangements from theater-style to banquet rounds, tailored to your event needs.' },
  { icon: Users, title: 'Expert Event Team', desc: 'Professional event coordinators dedicated to ensuring every detail of your celebration is flawless.' },
  { icon: ChefHat, title: 'Gourmet Catering', desc: 'In-house catering with diverse menus featuring international cuisine crafted by award-winning chefs.' },
  { icon: Music, title: 'Premium AV System', desc: 'State-of-the-art sound and lighting systems with dedicated technical support for every event.' },
  { icon: Camera, title: 'Photo-Ready Spaces', desc: 'Stunning backdrops and gardens perfect for capturing your most memorable moments.' },
  { icon: Star, title: 'VIP Experience', desc: 'Exclusive bridal suites, VIP lounges, and private areas for a truly premium guest experience.' },
];

export function AboutPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-navy-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-72 h-72 bg-champagne-500/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-champagne-600/20 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-champagne-400 font-medium mb-3">About Us</p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">Our Venue</h1>
          <p className="text-lg text-ivory-300 max-w-2xl mx-auto">
            Where elegance meets excellence — discover the venue that transforms every event into an unforgettable experience.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-charcoal-900 mb-6">
              A Legacy of Celebration
            </h2>
            <p className="text-charcoal-600 leading-relaxed mb-6">
              For over fifteen years, Grand Celebration Event Hall has been the premier destination for
              life's most treasured moments. From intimate engagement ceremonies to grand wedding
              receptions, from milestone birthday celebrations to prestigious corporate events —
              our venue has been the backdrop for thousands of unforgettable memories.
            </p>
            <p className="text-charcoal-600 leading-relaxed">
              Our commitment to excellence, attention to detail, and passion for creating extraordinary
              experiences has earned us the trust of families and businesses throughout the community.
              Every event at Grand Celebration is treated with the care and dedication it deserves,
              ensuring that each celebration is as unique as the people we serve.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="py-20 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-[0.2em] text-champagne-600 font-medium mb-3">Our Features</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-900">
              What Makes Us Special
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-champagne-100 hover:border-champagne-300 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-champagne-100 to-champagne-200 flex items-center justify-center mb-4 group-hover:from-champagne-200 group-hover:to-champagne-300 transition-all">
                  <Icon className="w-6 h-6 text-champagne-700" />
                </div>
                <h3 className="font-serif font-bold text-charcoal-900 mb-2">{title}</h3>
                <p className="text-sm text-charcoal-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-champagne-500/20 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-5">
            Experience the Grand Celebration Difference
          </h2>
          <p className="text-lg text-ivory-300 mb-10 max-w-2xl mx-auto">
            Schedule a visit or reserve your date today. Let us help you create a celebration that exceeds every expectation.
          </p>
          <Link
            to="/reservation"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-champagne-500 to-champagne-600 text-charcoal-900 font-semibold rounded-xl hover:from-champagne-400 hover:to-champagne-500 transition-all shadow-lg"
          >
            <Calendar className="w-5 h-5" />
            Reserve Your Date
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
