import { useState } from 'react';
import { useServices } from '../../hooks/useServices';
import { useAvailability, type TimeSlot } from '../../hooks/useAvailability';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import type { Service } from '../../types/database';
import {
  Package,
  Calendar,
  Clock,
  User,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Heart,
  PartyPopper,
  Building2,
  GlassWater,
  Gem,
  Crown,
} from 'lucide-react';
import { format, addDays } from 'date-fns';

const packageIcons = [Heart, PartyPopper, Building2, GlassWater, Gem, Crown];

const steps = [
  { num: 1, label: 'Select Package', icon: Package },
  { num: 2, label: 'Choose Date', icon: Calendar },
  { num: 3, label: 'Select Time', icon: Clock },
  { num: 4, label: 'Your Details', icon: User },
  { num: 5, label: 'Confirmation', icon: CheckCircle },
];

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export function ReservationPage() {
  const [step, setStep] = useState(1);
  const { services, loading: servicesLoading } = useServices(true);
  const { slots, loading: slotsLoading, fetchAvailableSlots } = useAvailability();

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [customer, setCustomer] = useState<CustomerForm>({ name: '', email: '', phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  const minDate = format(addDays(new Date(), 1), 'yyyy-MM-dd');

  function handleSelectService(service: Service) {
    setSelectedService(service);
    setSelectedDate('');
    setSelectedSlot(null);
    setStep(2);
  }

  function handleSelectDate(date: string) {
    setSelectedDate(date);
    setSelectedSlot(null);
    if (selectedService) {
      fetchAvailableSlots(date, selectedService.duration_minutes);
    }
    setStep(3);
  }

  function handleSelectSlot(slot: TimeSlot) {
    if (!slot.available) return;
    setSelectedSlot(slot);
    setStep(4);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedSlot) return;

    setSubmitting(true);
    setError('');

    const { error: insertError } = await supabase.from('appointments').insert({
      service_id: selectedService.id,
      appointment_date: selectedDate,
      start_time: selectedSlot.start,
      end_time: selectedSlot.end,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      notes: customer.notes || null,
      status: 'pending',
    });

    if (insertError) {
      setError('Failed to create reservation. Please try again.');
      setSubmitting(false);
      return;
    }

    setConfirmed(true);
    setStep(5);
    setSubmitting(false);
  }

  function formatTime(time: string) {
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${h12}:${m} ${ampm}`;
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-navy-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-72 h-72 bg-champagne-500/30 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-champagne-400 font-medium mb-3">Venue Booking</p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">Event Reservation</h1>
          <p className="text-lg text-ivory-300">Reserve your date in just a few simple steps.</p>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="bg-white border-b border-champagne-100 sticky top-20 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map(({ num, label, icon: Icon }) => (
              <div key={num} className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= num
                    ? 'bg-gradient-to-br from-champagne-500 to-champagne-700 text-white shadow-md'
                    : 'bg-ivory-100 text-charcoal-400'
                }`}>
                  {step > num ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`hidden sm:inline text-sm font-medium ${
                  step >= num ? 'text-champagne-700' : 'text-charcoal-400'
                }`}>
                  {label}
                </span>
                {num < 5 && <div className={`hidden sm:block w-8 lg:w-16 h-0.5 ${step > num ? 'bg-champagne-400' : 'bg-ivory-200'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-12 bg-ivory-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Step 1: Select Package */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-2">Select Your Event Package</h2>
              <p className="text-charcoal-500 mb-8">Choose the package that best fits your celebration.</p>
              {servicesLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {services.map((service, i) => {
                    const Icon = packageIcons[i % packageIcons.length];
                    return (
                      <button
                        key={service.id}
                        onClick={() => handleSelectService(service)}
                        className="text-left bg-white rounded-xl p-6 border-2 border-champagne-100 hover:border-champagne-400 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-champagne-500 to-champagne-700 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-serif font-bold text-charcoal-900 text-lg">{service.name}</h3>
                            <p className="text-sm text-charcoal-500 mt-1 line-clamp-2">{service.description}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <span className="text-lg font-bold text-champagne-700">${service.price.toLocaleString()}</span>
                              <span className="text-xs text-charcoal-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {service.duration_minutes >= 60
                                  ? `${Math.floor(service.duration_minutes / 60)}h${service.duration_minutes % 60 ? ` ${service.duration_minutes % 60}m` : ''}`
                                  : `${service.duration_minutes}m`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Choose Date */}
          {step === 2 && (
            <div>
              <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-champagne-700 hover:text-champagne-800 mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Packages
              </button>
              <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-2">Choose Your Date</h2>
              <p className="text-charcoal-500 mb-8">
                Select the date for your <span className="font-medium text-champagne-700">{selectedService?.name}</span>.
              </p>
              <div className="bg-white rounded-xl p-8 border border-champagne-100 max-w-md">
                <label className="block text-sm font-medium text-charcoal-700 mb-2">Event Date</label>
                <input
                  type="date"
                  min={minDate}
                  value={selectedDate}
                  onChange={(e) => handleSelectDate(e.target.value)}
                  className="w-full px-4 py-3 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 transition-colors bg-ivory-50 text-lg"
                />
              </div>
            </div>
          )}

          {/* Step 3: Select Time */}
          {step === 3 && (
            <div>
              <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-champagne-700 hover:text-champagne-800 mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Date
              </button>
              <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-2">Select Available Time Slot</h2>
              <p className="text-charcoal-500 mb-8">
                Available times for <span className="font-medium text-champagne-700">{format(new Date(selectedDate + 'T00:00:00'), 'MMMM d, yyyy')}</span>.
              </p>
              {slotsLoading ? (
                <LoadingSpinner />
              ) : slots.length === 0 ? (
                <div className="bg-white rounded-xl p-8 border border-champagne-100 text-center">
                  <p className="text-charcoal-500">No available time slots for this date. Please choose a different date.</p>
                  <button
                    onClick={() => setStep(2)}
                    className="mt-4 px-5 py-2.5 text-sm font-medium text-champagne-700 border border-champagne-300 rounded-lg hover:bg-champagne-50 transition-colors"
                  >
                    Choose Another Date
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {slots.map((slot) => (
                    <button
                      key={slot.start}
                      onClick={() => handleSelectSlot(slot)}
                      disabled={!slot.available}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        slot.available
                          ? selectedSlot?.start === slot.start
                            ? 'border-champagne-500 bg-champagne-50 shadow-md'
                            : 'border-champagne-100 bg-white hover:border-champagne-400 hover:shadow-md'
                          : 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <p className={`font-semibold ${slot.available ? 'text-charcoal-900' : 'text-gray-300'}`}>
                        {formatTime(slot.start)}
                      </p>
                      <p className={`text-xs mt-1 ${slot.available ? 'text-charcoal-400' : 'text-gray-300'}`}>
                        to {formatTime(slot.end)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Customer Details */}
          {step === 4 && (
            <div>
              <button onClick={() => setStep(3)} className="flex items-center gap-1 text-sm text-champagne-700 hover:text-champagne-800 mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Time Selection
              </button>
              <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-2">Your Details</h2>
              <p className="text-charcoal-500 mb-8">Please provide your contact information to complete the reservation.</p>

              <div className="bg-white rounded-xl p-8 border border-champagne-100">
                {/* Summary */}
                <div className="mb-8 p-5 bg-ivory-50 rounded-lg border border-champagne-100">
                  <h3 className="font-serif font-bold text-charcoal-900 mb-3">Reservation Summary</h3>
                  <div className="grid sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-charcoal-400">Package</p>
                      <p className="font-medium text-charcoal-900">{selectedService?.name}</p>
                    </div>
                    <div>
                      <p className="text-charcoal-400">Date</p>
                      <p className="font-medium text-charcoal-900">{selectedDate && format(new Date(selectedDate + 'T00:00:00'), 'MMMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-charcoal-400">Time</p>
                      <p className="font-medium text-charcoal-900">
                        {selectedSlot && `${formatTime(selectedSlot.start)} - ${formatTime(selectedSlot.end)}`}
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        className="w-full px-4 py-3 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 transition-colors bg-ivory-50"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Email *</label>
                      <input
                        type="email"
                        required
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        className="w-full px-4 py-3 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 transition-colors bg-ivory-50"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 transition-colors bg-ivory-50"
                      placeholder="(555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Notes (Optional)</label>
                    <textarea
                      rows={4}
                      value={customer.notes}
                      onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                      className="w-full px-4 py-3 border border-champagne-200 rounded-lg focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-400 transition-colors bg-ivory-50 resize-none"
                      placeholder="Special requests, dietary requirements, setup preferences..."
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-champagne-600 to-champagne-700 text-white font-semibold rounded-lg hover:from-champagne-700 hover:to-champagne-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Confirm Reservation'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && confirmed && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-10 border border-champagne-100 shadow-sm text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-charcoal-900 mb-2">Reservation Confirmed!</h2>
                <p className="text-charcoal-500 mb-8">Your event reservation has been submitted successfully. We'll be in touch shortly.</p>

                <div className="bg-ivory-50 rounded-xl p-6 border border-champagne-100 text-left space-y-4 mb-8">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-charcoal-400 font-medium">Event Package</p>
                      <p className="font-medium text-charcoal-900 mt-0.5">{selectedService?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-charcoal-400 font-medium">Price</p>
                      <p className="font-medium text-champagne-700 mt-0.5">${selectedService?.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-charcoal-400 font-medium">Date</p>
                      <p className="font-medium text-charcoal-900 mt-0.5">{selectedDate && format(new Date(selectedDate + 'T00:00:00'), 'MMMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-charcoal-400 font-medium">Time</p>
                      <p className="font-medium text-charcoal-900 mt-0.5">
                        {selectedSlot && `${formatTime(selectedSlot.start)} - ${formatTime(selectedSlot.end)}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-charcoal-400 font-medium">Guest Name</p>
                      <p className="font-medium text-charcoal-900 mt-0.5">{customer.name}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-charcoal-400 font-medium">Email</p>
                      <p className="font-medium text-charcoal-900 mt-0.5">{customer.email}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-charcoal-400 font-medium">Phone</p>
                      <p className="font-medium text-charcoal-900 mt-0.5">{customer.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-charcoal-400 font-medium">Status</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 mt-0.5">
                        Pending
                      </span>
                    </div>
                  </div>
                  {customer.notes && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-charcoal-400 font-medium">Notes</p>
                      <p className="font-medium text-charcoal-900 mt-0.5">{customer.notes}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setStep(1);
                    setSelectedService(null);
                    setSelectedDate('');
                    setSelectedSlot(null);
                    setCustomer({ name: '', email: '', phone: '', notes: '' });
                    setConfirmed(false);
                  }}
                  className="px-6 py-3 text-sm font-medium text-champagne-700 border border-champagne-300 rounded-lg hover:bg-champagne-50 transition-colors"
                >
                  Make Another Reservation
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
