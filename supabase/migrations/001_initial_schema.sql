-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
-- Note: app.jwt_secret is set by Supabase automatically, no need to set it manually
-- ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Teams/Dojos table (created first to break circular dependency)
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  coach_id UUID NOT NULL, -- Foreign key added after users table exists
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'referee', 'coach')),
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint for teams.coach_id after users table exists
ALTER TABLE public.teams ADD CONSTRAINT teams_coach_id_fkey 
  FOREIGN KEY (coach_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Athletes table
CREATE TABLE public.athletes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
  belt_level TEXT NOT NULL,
  weight DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tournaments table
CREATE TABLE public.tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Local', 'District', 'Open')),
  events TEXT NOT NULL CHECK (events IN ('Kata', 'Kumite', 'Both')),
  team_championship_enabled BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('Kata', 'Kumite')),
  age_min INTEGER NOT NULL,
  age_max INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Mixed')),
  belt_level TEXT,
  weight_min DECIMAL(5,2),
  weight_max DECIMAL(5,2),
  is_locked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Category Participants (many-to-many relationship)
CREATE TABLE public.category_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, athlete_id)
);

-- Matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  round INTEGER NOT NULL,
  match_number INTEGER NOT NULL,
  athlete_ids UUID[] NOT NULL,
  kata_score_id UUID,
  kumite_match_id UUID,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'walkover', 'disqualified')),
  winner_id UUID REFERENCES public.athletes(id) ON DELETE SET NULL,
  result_status TEXT NOT NULL DEFAULT 'pending' CHECK (result_status IN ('pending', 'official', 'corrected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kata Scores table
CREATE TABLE public.kata_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  judge_scores JSONB NOT NULL, -- Array of {judge_id: string, score: number}
  final_score DECIMAL(5,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'official', 'corrected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key for matches.kata_score_id
ALTER TABLE public.matches ADD CONSTRAINT matches_kata_score_id_fkey 
  FOREIGN KEY (kata_score_id) REFERENCES public.kata_scores(id) ON DELETE SET NULL;

-- Kumite Matches table
CREATE TABLE public.kumite_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  athlete1_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  athlete2_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  athlete1_points TEXT[] NOT NULL DEFAULT '{}', -- Array of 'Yuko', 'Waza-ari', 'Ippon'
  athlete2_points TEXT[] NOT NULL DEFAULT '{}',
  athlete1_penalties INTEGER NOT NULL DEFAULT 0,
  athlete2_penalties INTEGER NOT NULL DEFAULT 0,
  match_duration INTEGER NOT NULL, -- in seconds
  elapsed_time INTEGER NOT NULL DEFAULT 0,
  winner_id UUID REFERENCES public.athletes(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'walkover', 'disqualified')),
  result_status TEXT NOT NULL DEFAULT 'pending' CHECK (result_status IN ('pending', 'official', 'corrected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key for matches.kumite_match_id
ALTER TABLE public.matches ADD CONSTRAINT matches_kumite_match_id_fkey 
  FOREIGN KEY (kumite_match_id) REFERENCES public.kumite_matches(id) ON DELETE SET NULL;

-- Official Results table (PRD Section 7: Single Source of Truth)
CREATE TABLE public.official_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  position INTEGER NOT NULL, -- 1 = Gold, 2 = Silver, 3 = Bronze
  medal TEXT CHECK (medal IN ('Gold', 'Silver', 'Bronze')),
  points INTEGER NOT NULL DEFAULT 0, -- For team scoring
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'official', 'corrected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, athlete_id)
);

-- Tournament Rules table
CREATE TABLE public.tournament_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL UNIQUE REFERENCES public.tournaments(id) ON DELETE CASCADE,
  kata_judges_count INTEGER NOT NULL DEFAULT 5 CHECK (kata_judges_count IN (5, 7)),
  kumite_match_duration JSONB NOT NULL, -- {age: duration_in_seconds}
  team_point_rules JSONB NOT NULL DEFAULT '{"gold": 3, "silver": 2, "bronze": 1}'::jsonb,
  senshu_enabled BOOLEAN NOT NULL DEFAULT false,
  tie_break_rule TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_teams_coach_id ON public.teams(coach_id);
CREATE INDEX idx_athletes_team_id ON public.athletes(team_id);
CREATE INDEX idx_categories_tournament_id ON public.categories(tournament_id);
CREATE INDEX idx_category_participants_category_id ON public.category_participants(category_id);
CREATE INDEX idx_category_participants_athlete_id ON public.category_participants(athlete_id);
CREATE INDEX idx_matches_category_id ON public.matches(category_id);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_kata_scores_match_id ON public.kata_scores(match_id);
CREATE INDEX idx_kumite_matches_category_id ON public.kumite_matches(category_id);
CREATE INDEX idx_official_results_category_id ON public.official_results(category_id);
CREATE INDEX idx_official_results_athlete_id ON public.official_results(athlete_id);
CREATE INDEX idx_official_results_status ON public.official_results(status);
CREATE INDEX idx_tournament_rules_tournament_id ON public.tournament_rules(tournament_id);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kata_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kumite_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.official_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_rules ENABLE ROW LEVEL SECURITY;

