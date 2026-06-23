export interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  service_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
}

export interface BusinessHours {
  id: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_open: boolean;
}

export interface BlockedDate {
  id: string;
  blocked_date: string;
  reason: string | null;
  created_at: string;
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  business_address: string;
  slot_interval_minutes: number;
  booking_notice_hours: number;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  created_at: string;
}
