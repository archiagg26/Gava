-- GharSetu - AI Rural Housing Navigator Database Schema
-- Production-minded Supabase PostgreSQL schema with Row Level Security (RLS)
-- Designed for secure storage of rural family profiles, assessment metadata, and milestone progress.

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    block TEXT,
    village TEXT,
    is_rural BOOLEAN DEFAULT TRUE,
    household_size INTEGER DEFAULT 4,
    social_category TEXT,
    is_woman_head BOOLEAN DEFAULT FALSE,
    is_differently_abled BOOLEAN DEFAULT FALSE,
    current_house_type TEXT CHECK (current_house_type IN ('kutcha', 'semiPucca', 'pucca', 'homeless')),
    land_ownership TEXT CHECK (land_ownership IN ('self', 'ancestral', 'patta', 'none')),
    land_area TEXT,
    annual_income TEXT,
    ration_card_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert/update their own profile"
    ON public.profiles FOR ALL
    USING (auth.uid() = id);


-- 2. Create Eligibility Assessments Table
CREATE TABLE IF NOT EXISTS public.eligibility_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('eligible', 'potentially_eligible', 'ineligible', 'insufficient')),
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    summary_text TEXT NOT NULL,
    total_estimated_assistance TEXT,
    reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
    matched_schemes JSONB NOT NULL DEFAULT '[]'::jsonb,
    action_plan JSONB NOT NULL DEFAULT '[]'::jsonb,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on eligibility assessments
ALTER TABLE public.eligibility_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own assessments"
    ON public.eligibility_assessments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments"
    ON public.eligibility_assessments FOR INSERT
    WITH CHECK (auth.uid() = user_id);


-- 3. Create Documents Metadata Table
-- SECURITY NOTE: Stores file metadata & automated verification notes ONLY.
-- Raw identity documents must be stored in private Supabase Storage buckets with strict signed URL expiration.
CREATE TABLE IF NOT EXISTS public.documents_meta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL, -- e.g. aadhaar, land_record, bank_passbook, mgnrega_jobcard
    file_name TEXT NOT NULL,
    file_size TEXT NOT NULL,
    file_type TEXT NOT NULL,
    storage_path TEXT, -- private bucket path
    status TEXT NOT NULL CHECK (status IN ('ready', 'review', 'missing')),
    extracted_info JSONB DEFAULT '{}'::jsonb,
    verification_notes TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on documents metadata
ALTER TABLE public.documents_meta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own document metadata"
    ON public.documents_meta FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own document metadata"
    ON public.documents_meta FOR ALL
    USING (auth.uid() = user_id);


-- 4. Create Application Progress Milestones Table
CREATE TABLE IF NOT EXISTS public.application_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    milestone_id INTEGER NOT NULL CHECK (milestone_id BETWEEN 1 AND 6),
    status TEXT NOT NULL CHECK (status IN ('completed', 'in_progress', 'pending')),
    completed_at TIMESTAMPTZ,
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, milestone_id)
);

-- Enable RLS on progress milestones
ALTER TABLE public.application_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own milestones"
    ON public.application_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones"
    ON public.application_progress FOR ALL
    USING (auth.uid() = user_id);


-- 5. Storage Security Bucket & Policy (Private)
-- In Supabase dashboard:
-- Create private bucket: 'family-housing-docs'
-- Storage RLS policy:
-- CREATE POLICY "User Documents Access" ON storage.objects
--   FOR ALL TO authenticated
--   USING (bucket_id = 'family-housing-docs' AND (storage.foldername(name))[1] = auth.uid()::text);
