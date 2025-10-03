
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yagnywmdjckfrbiewnxd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhZ255d21kamNrZnJiaWV3bnhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0Nzg5MTMsImV4cCI6MjA3NTA1NDkxM30._5KtthHpvTjQi40O-d__J1owgVTu719p_I_0qvpu_BQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  business_name: string;
  rnc: string;
  cedula: string;
  address: string;
  phone: string;
  role: 'doctor' | 'admin' | 'staff';
  avatar_url?: string;
  is_active: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}
