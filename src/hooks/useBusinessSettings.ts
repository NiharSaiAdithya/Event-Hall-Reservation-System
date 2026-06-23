import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { BusinessSettings } from '../types/database';

const DEFAULT_SETTINGS: BusinessSettings = {
  id: '',
  business_name: 'Grand Celebration Event Hall',
  business_email: 'info@grandcelebration.com',
  business_phone: '(555) 123-4567',
  business_address: '123 Celebration Avenue, Elegance City',
  slot_interval_minutes: 60,
  booking_notice_hours: 24,
  updated_at: '',
};

export function useBusinessSettings() {
  const [settings, setSettings] = useState<BusinessSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  async function fetchSettings() {
    setLoading(true);
    const { data } = await supabase
      .from('business_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (data) setSettings(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, loading, refetch: fetchSettings };
}
