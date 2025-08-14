import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  name: string;
  email: string;
  grade: number;
  github_username: string;
  bio: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export type AuthUser = {
  id: string;
  email: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  github_link: string;
  demo_link: string | null;
  thumbnail_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  submitted_by: string;
  created_at: string;
};