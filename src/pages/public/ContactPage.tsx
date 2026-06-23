import { useState } from 'react';
import { useBusinessSettings } from '../../hooks/useBusinessSettings';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

export function ContactPage() {
  const { settings } = useBusinessSettings();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-navy-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-72 h-72 bg-champagne-500/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-champagne-600/20 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-champagne-400 font-medium mb-3">Get In Touch</p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">Contact Us</h1>
          <p className="text-lg text-ivory-300 max-w-2xl mx-auto">
            We'd love to hear about your upcoming event. Reach out and let's start planning your celebration.
          </p>
        </div>
      </section>

      <section className="py-20 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-6">Venue Information</h2>
              </div>

              {[
                { icon: MapPin, label: 'Address', value: settings.business_address },
                { icon: Phone, label: 'Phone', value: settings.business_phone },
                { icon: Mail, label: 'Email', value: settings.business_email },
                { icon: Clock, label: 'Booking Notice', value: `${settings.booking_notice_hours} hours advance booking required` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-champagne-100">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-champagne-100 to-champagne-200 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-champagne-700" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-charcoal-400 font-medium">{label}</p>
                    <p className="text-charcoal-700 font-medium mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 border border-champagne-100 shadow-sm">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-charcoal-900 mb-2">Message Sent!</h3>
                    <p className="text-charcoal-500">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }}
                      className="mt-6 px-6 py-2.5 text-sm font-medium text-champagne-700 border border-champagne-300 rounded-lg hover:bg-champagne-50 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-serif font-bold text-charcoal-900 mb-6">Send Us a Message</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Full Name</label>
                          <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-3 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 transition-colors bg-ivory-50"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Email</label>
                          <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-3 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 transition-colors bg-ivory-50"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Phone</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 transition-colors bg-ivory-50"
                          placeholder="(555) 000-0000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Message</label>
                        <textarea
                          required
                          rows={5}
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className="w-full px-4 py-3 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 transition-colors bg-ivory-50 resize-none"
                          placeholder="Tell us about your upcoming event..."
                        />
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-champagne-600 to-champagne-700 text-white font-semibold rounded-lg hover:from-champagne-700 hover:to-champagne-800 transition-all shadow-md"
                      >
                        <Send className="w-4 h-4" />
                        Send Message
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
