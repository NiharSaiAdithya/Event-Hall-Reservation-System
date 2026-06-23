import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { BusinessHours, BusinessSettings, Appointment } from '../types/database';
import { format, addMinutes, parse, isBefore, addHours } from 'date-fns';

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export function useAvailability() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchAvailableSlots(date: string, serviceDuration: number) {
    setLoading(true);

    const dayOfWeek = new Date(date + 'T00:00:00').getDay();

    const [hoursRes, settingsRes, blockedRes, appointmentsRes] = await Promise.all([
      supabase
        .from('business_hours')
        .select('*')
        .eq('day_of_week', dayOfWeek)
        .eq('is_open', true)
        .maybeSingle(),
      supabase.from('business_settings').select('*').limit(1).maybeSingle(),
      supabase
        .from('blocked_dates')
        .select('*')
        .eq('blocked_date', date)
        .maybeSingle(),
      supabase
        .from('appointments')
        .select('*')
        .eq('appointment_date', date)
        .neq('status', 'cancelled'),
    ]);

    const hours: BusinessHours | null = hoursRes.data;
    const settings: BusinessSettings | null = settingsRes.data;
    const blocked = blockedRes.data;
    const existingAppointments: Appointment[] = appointmentsRes.error ? [] : (appointmentsRes.data ?? []);

    if (!hours || blocked) {
      setSlots([]);
      setLoading(false);
      return;
    }

    const slotInterval = settings?.slot_interval_minutes ?? 60;
    const bookingNotice = settings?.booking_notice_hours ?? 24;

    const now = new Date();
    const noticeThreshold = addHours(now, bookingNotice);

    const generatedSlots: TimeSlot[] = [];
    const openTime = parse(hours.open_time, 'HH:mm:ss', new Date(date));
    const closeTime = parse(hours.close_time, 'HH:mm:ss', new Date(date));

    let current = openTime;

    while (true) {
      const slotEnd = addMinutes(current, serviceDuration);
      if (slotEnd > closeTime) break;

      const slotStartStr = format(current, 'HH:mm:ss');
      const slotEndStr = format(slotEnd, 'HH:mm:ss');

      const slotDateTime = new Date(`${date}T${slotStartStr}`);
      const withinNotice = isBefore(slotDateTime, noticeThreshold);

      const hasOverlap = existingAppointments.some((apt) => {
        return slotStartStr < apt.end_time && slotEndStr > apt.start_time;
      });

      generatedSlots.push({
        start: slotStartStr,
        end: slotEndStr,
        available: !hasOverlap && !withinNotice,
      });

      current = addMinutes(current, slotInterval);
    }

    setSlots(generatedSlots);
    setLoading(false);
  }

  return { slots, loading, fetchAvailableSlots };
}
