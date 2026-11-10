import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Project Reference
export const SUPABASE_PROJECT_REF = 'bgilsedsjmpsyfqaaemw';

// Helper to normalize Supabase URL (e.g., handles "db.bgilsedsjmpsyfqaaemw.supabase.co" -> "https://bgilsedsjmpsyfqaaemw.supabase.co")
export function normalizeSupabaseUrl(rawUrl?: string): string {
  if (!rawUrl || !rawUrl.trim()) {
    return `https://${SUPABASE_PROJECT_REF}.supabase.co`;
  }
  let cleaned = rawUrl.trim();
  // If user passed "db.bgilsedsjmpsyfqaaemw.supabase.co", convert to https API endpoint
  if (cleaned.startsWith('db.')) {
    cleaned = cleaned.replace(/^db\./, 'https://');
  } else if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`;
  }
  // Strip trailing slash
  return cleaned.replace(/\/+$/, '');
}

// Resolve environment variables
const rawEnvUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_PROJECT_URL ||
  import.meta.env.SUPABASE_URL;

export const SUPABASE_URL = normalizeSupabaseUrl(rawEnvUrl);

// Default verified project publishable key for project bgilsedsjmpsyfqaaemw
export const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_hy2VIfyMyzW6kkPx3nvDMg_8nftdCP2';

// Retrieve Publishable / Anon Key (never secret service_role key)
export function getSupabaseAnonKey(): string {
  // Check env first
  const envKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_KEY ||
    import.meta.env.SUPABASE_ANON_KEY;

  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
    return envKey.trim();
  }

  // Check localStorage as an optional runtime bridge
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('skillverse_supabase_anon_key') || localStorage.getItem('skilivo_supabase_anon_key');
    if (local && local.trim().length > 0) {
      return local.trim();
    }
  }

  // Fallback to verified project publishable key
  return DEFAULT_SUPABASE_PUBLISHABLE_KEY;
}

export const SUPABASE_ANON_KEY = getSupabaseAnonKey();

// Initialize the Supabase client
// When no key is configured yet, we supply a dummy placeholder to avoid initialization crash
// and flag it cleanly in connection testing
const activeKey = SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, activeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'skillverse_supabase_auth'
  }
});

// Dynamic client creator if key is provided at runtime
export function createCustomSupabaseClient(anonKey: string): SupabaseClient {
  return createClient(SUPABASE_URL, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'skillverse_supabase_auth'
    }
  });
}

export interface ConnectionTestResult {
  isConnected: boolean;
  status: 'connected' | 'missing_key' | 'invalid_key' | 'unreachable' | 'auth_ready_tables_pending';
  message: string;
  details: string;
  projectUrl: string;
  projectRef: string;
  hasKey: boolean;
  keyType: string;
  latencyMs?: number;
  tablesFound?: string[];
  tablesMissing?: string[];
  resolutionSteps: string[];
}

/**
 * Tests connection to the Supabase project
 */
export async function testSupabaseConnection(overrideKey?: string): Promise<ConnectionTestResult> {
  const key = overrideKey !== undefined ? overrideKey : getSupabaseAnonKey();
  const startTime = Date.now();

  const baseResult: ConnectionTestResult = {
    isConnected: false,
    status: 'unreachable',
    message: '',
    details: '',
    projectUrl: SUPABASE_URL,
    projectRef: SUPABASE_PROJECT_REF,
    hasKey: !!key && key.length > 20,
    keyType: key ? (key.startsWith('eyJ') ? 'JWT Anon Key' : 'API Key') : 'None',
    resolutionSteps: []
  };

  if (!key || key.length < 20) {
    return {
      ...baseResult,
      status: 'missing_key',
      message: 'Supabase Publishable Key (Anon Key) is not configured',
      details: `Project URL is configured as ${SUPABASE_URL}, but the client cannot authenticate requests without the public "anon" publishable key.`,
      resolutionSteps: [
        '1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/bgilsedsjmpsyfqaaemw',
        '2. Navigate to Project Settings -> API (or API Keys).',
        '3. Copy the "anon" public publishable key (starts with "eyJhbGci...").',
        '4. Add it to your environment variables as VITE_SUPABASE_ANON_KEY="your-anon-key", or paste it into the Supabase Settings panel.',
        '5. Note: NEVER use the "service_role" secret key in frontend client code.'
      ]
    };
  }

  try {
    const client = overrideKey ? createCustomSupabaseClient(overrideKey) : supabase;

    // Test 1: Check Auth service (GoTrue)
    const { data: authData, error: authError } = await client.auth.getSession();
    const latency = Date.now() - startTime;

    if (authError) {
      if (authError.message.includes('API key') || authError.message.includes('JWT') || authError.status === 401) {
        return {
          ...baseResult,
          status: 'invalid_key',
          latencyMs: latency,
          message: 'Invalid Supabase API Key',
          details: `Supabase returned authentication error: "${authError.message}". The key provided is either malformed, expired, or belongs to a different project.`,
          resolutionSteps: [
            '1. Go to https://supabase.com/dashboard/project/bgilsedsjmpsyfqaaemw/settings/api',
            '2. Confirm you are in project "bgilsedsjmpsyfqaaemw".',
            '3. Copy the fresh "anon" public key.',
            '4. Update VITE_SUPABASE_ANON_KEY and restart the application.'
          ]
        };
      }
    }

    // Test 2: Check database REST endpoint (PostgREST)
    // Check for core SKILLVERSE tables: profiles, courses, categories
    const expectedTables = ['profiles', 'courses', 'categories', 'enrollments'];
    const tablesFound: string[] = [];
    const tablesMissing: string[] = [];

    for (const table of expectedTables) {
      try {
        const { error: tblError } = await client.from(table).select('*', { count: 'exact', head: true });
        if (tblError) {
          if (tblError.code === '42P01' || tblError.message.includes('does not exist') || tblError.code === 'PGRST205') {
            tablesMissing.push(table);
          } else {
            // Table exists but maybe empty or RLS active (which is normal!)
            tablesFound.push(table);
          }
        } else {
          tablesFound.push(table);
        }
      } catch {
        tablesMissing.push(table);
      }
    }

    if (tablesMissing.length > 0) {
      return {
        ...baseResult,
        isConnected: true,
        status: 'auth_ready_tables_pending',
        latencyMs: latency,
        tablesFound,
        tablesMissing,
        message: 'Connected to Supabase! Database tables need schema initialization.',
        details: `Successfully reached Supabase project "${SUPABASE_PROJECT_REF}" (Latency: ${latency}ms). Auth is operational, but tables [${tablesMissing.join(', ')}] have not yet been migrated in PostgreSQL.`,
        resolutionSteps: [
          '1. Open the SQL Editor in your Supabase dashboard: https://supabase.com/dashboard/project/bgilsedsjmpsyfqaaemw/sql/new',
          '2. Copy the SKILLVERSE Schema SQL script provided in the Supabase Integration panel.',
          '3. Run the SQL script to create tables, foreign keys, and Row Level Security (RLS) policies.',
          '4. Click "Re-test Connection" to confirm all database entities are online.'
        ]
      };
    }

    return {
      ...baseResult,
      isConnected: true,
      status: 'connected',
      latencyMs: latency,
      tablesFound,
      tablesMissing: [],
      message: 'Supabase Connection Verified & Database Ready',
      details: `Project "${SUPABASE_PROJECT_REF}" is connected and responding within ${latency}ms. All schema tables and Auth services are active.`,
      resolutionSteps: ['Connection is healthy and operational. Ready for real-time production transactions.']
    };
  } catch (err: any) {
    const latency = Date.now() - startTime;
    return {
      ...baseResult,
      status: 'unreachable',
      latencyMs: latency,
      message: 'Failed to connect to Supabase endpoint',
      details: err?.message || 'Network request failed or CORS blocked.',
      resolutionSteps: [
        `1. Verify project status at https://supabase.com/dashboard/project/bgilsedsjmpsyfqaaemw (check if paused).`,
        '2. Verify that network access is unrestricted or that your browser is not blocking requests.',
        '3. Confirm project URL is https://bgilsedsjmpsyfqaaemw.supabase.co.'
      ]
    };
  }
}

/**
 * Complete SQL Migration script for SKILLVERSE tables in Supabase
 */
export const SKILLVERSE_SUPABASE_SCHEMA_SQL = `-- SKILLVERSE PostgreSQL Schema for Supabase (Project: bgilsedsjmpsyfqaaemw)
-- Run this script in: https://supabase.com/dashboard/project/bgilsedsjmpsyfqaaemw/sql/new

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  country TEXT DEFAULT 'United States',
  country_code TEXT DEFAULT 'US',
  language TEXT DEFAULT 'English',
  title TEXT,
  headline TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  hourly_rate NUMERIC DEFAULT 0,
  rating NUMERIC DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  student_count INTEGER DEFAULT 0,
  verification_status TEXT DEFAULT 'not_submitted' CHECK (verification_status IN ('not_submitted', 'under_review', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Hardened Admin Verification Helper Function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon, service_role;

-- Privilege Protection Trigger: Prevents unauthorized modification of role and verification_status
CREATE OR REPLACE FUNCTION public.enforce_profile_privilege_protection()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_admin BOOLEAN;
BEGIN
  -- Determine whether executing context has admin privileges
  v_is_admin := public.is_admin();

  -- 1. Protect ROLE from unauthorized self-promotion (Student -> Instructor/Admin, Instructor -> Admin)
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT v_is_admin THEN
      RAISE EXCEPTION 'Access Denied: Ordinary users cannot modify their role (attempted to change from % to %).', OLD.role, NEW.role
        USING ERRCODE = '42501'; -- insufficient_privilege
    END IF;
  END IF;

  -- 2. Protect VERIFICATION_STATUS from unauthorized tampering
  IF NEW.verification_status IS DISTINCT FROM OLD.verification_status THEN
    IF NOT v_is_admin THEN
      RAISE EXCEPTION 'Access Denied: Ordinary users cannot modify verification_status (attempted to change from % to %).', OLD.verification_status, NEW.verification_status
        USING ERRCODE = '42501';
    END IF;
  END IF;

  -- 3. Protect platform metrics from direct client manipulation
  IF NEW.rating IS DISTINCT FROM OLD.rating THEN
    IF NOT v_is_admin THEN
      NEW.rating := OLD.rating;
    END IF;
  END IF;

  IF NEW.review_count IS DISTINCT FROM OLD.review_count THEN
    IF NOT v_is_admin THEN
      NEW.review_count := OLD.review_count;
    END IF;
  END IF;

  IF NEW.student_count IS DISTINCT FROM OLD.student_count THEN
    IF NOT v_is_admin THEN
      NEW.student_count := OLD.student_count;
    END IF;
  END IF;

  -- Automatically update timestamp
  NEW.updated_at := NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_privileges ON public.profiles;
CREATE TRIGGER trg_protect_profile_privileges
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_profile_privilege_protection();

-- Idempotent RLS Policies for Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles" 
  ON public.profiles FOR ALL 
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_name TEXT NOT NULL,
  course_count INTEGER DEFAULT 0,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Categories manageable by admins" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES public.profiles(id),
  category_id TEXT REFERENCES public.categories(id),
  level TEXT DEFAULT 'All Levels',
  language TEXT DEFAULT 'English',
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC,
  duration_hours NUMERIC DEFAULT 0,
  thumbnail TEXT NOT NULL,
  intro_video_url TEXT,
  learning_objectives TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'under_review' CHECK (status IN ('draft', 'under_review', 'published', 'rejected')),
  rating NUMERIC DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  student_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published courses viewable by all" ON public.courses FOR SELECT 
  USING (status = 'published' OR instructor_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Instructors can insert courses" ON public.courses FOR INSERT 
  WITH CHECK (auth.uid() = instructor_id);
CREATE POLICY "Instructors can update own courses" ON public.courses FOR UPDATE 
  USING (auth.uid() = instructor_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 5. Course Sections & Lessons
CREATE TABLE IF NOT EXISTS public.course_sections (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  "order" INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  section_id TEXT REFERENCES public.course_sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 15,
  type TEXT DEFAULT 'video' CHECK (type IN ('video', 'text', 'resource')),
  video_url TEXT,
  content TEXT,
  is_free_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id TEXT PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_lesson_ids TEXT[] DEFAULT '{}',
  progress_percent INTEGER DEFAULT 0,
  last_accessed_lesson_id TEXT,
  certificate_id TEXT,
  notes JSONB DEFAULT '{}',
  UNIQUE(student_id, course_id)
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own enrollments" ON public.enrollments FOR SELECT 
  USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Students can insert own enrollments" ON public.enrollments FOR INSERT 
  WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students can update own progress" ON public.enrollments FOR UPDATE 
  USING (student_id = auth.uid());

-- 7. Orders & Financial Ledger Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id),
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  item_type TEXT NOT NULL,
  item_id TEXT NOT NULL,
  item_title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT NOT NULL,
  transaction_ref TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed')),
  platform_commission_rate NUMERIC DEFAULT 0.15,
  platform_commission NUMERIC NOT NULL,
  instructor_earnings NUMERIC NOT NULL,
  instructor_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT 
  USING (student_id = auth.uid() OR instructor_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 8. Auto-create Profile on Auth Signup Trigger (Hardened)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    name,
    role,
    country,
    country_code,
    language,
    avatar,
    verification_status,
    rating,
    review_count,
    student_count
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''), split_part(NEW.email, '@', 1)),
    -- SECURITY: Never permit 'admin' role via client metadata during self-registration
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' = 'instructor' THEN 'instructor'
      ELSE 'student'
    END,
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'country'), ''), 'Global'),
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'country_code'), ''), 'US'),
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'language'), ''), 'English'),
    COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
    'not_submitted',
    0.0,
    0,
    0
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
`;

export const SKILIVO_SUPABASE_SCHEMA_SQL = SKILLVERSE_SUPABASE_SCHEMA_SQL;
