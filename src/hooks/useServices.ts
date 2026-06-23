import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Service } from '../types/database';

export function useServices(activeOnly = false) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchServices() {
    setLoading(true);
    let query = supabase.from('services').select('*').order('name');
    if (activeOnly) query = query.eq('is_active', true);
    const { data } = await query;
    setServices(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchServices();
  }, [activeOnly]);

  return { services, loading, refetch: fetchServices };
}
