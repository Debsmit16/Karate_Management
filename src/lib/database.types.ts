// Database types generated from Supabase schema
// These match the tables in the database

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'referee' | 'coach';
          team_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: 'admin' | 'referee' | 'coach';
          team_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'referee' | 'coach';
          team_id?: string | null;
          created_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          coach_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          coach_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          coach_id?: string;
          created_at?: string;
        };
      };
      athletes: {
        Row: {
          id: string;
          team_id: string;
          name: string;
          age: number;
          gender: 'Male' | 'Female';
          belt_level: string;
          weight: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          name: string;
          age: number;
          gender: 'Male' | 'Female';
          belt_level: string;
          weight?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          name?: string;
          age?: number;
          gender?: 'Male' | 'Female';
          belt_level?: string;
          weight?: number | null;
          created_at?: string;
        };
      };
      tournaments: {
        Row: {
          id: string;
          name: string;
          level: 'Local' | 'District' | 'Open';
          events: 'Kata' | 'Kumite' | 'Both';
          team_championship_enabled: boolean;
          status: 'draft' | 'active' | 'completed';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          level: 'Local' | 'District' | 'Open';
          events: 'Kata' | 'Kumite' | 'Both';
          team_championship_enabled: boolean;
          status?: 'draft' | 'active' | 'completed';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          level?: 'Local' | 'District' | 'Open';
          events?: 'Kata' | 'Kumite' | 'Both';
          team_championship_enabled?: boolean;
          status?: 'draft' | 'active' | 'completed';
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          tournament_id: string;
          name: string;
          event_type: 'Kata' | 'Kumite';
          age_min: number;
          age_max: number;
          gender: 'Male' | 'Female' | 'Mixed';
          belt_level: string | null;
          weight_min: number | null;
          weight_max: number | null;
          is_locked: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          name: string;
          event_type: 'Kata' | 'Kumite';
          age_min: number;
          age_max: number;
          gender: 'Male' | 'Female' | 'Mixed';
          belt_level?: string | null;
          weight_min?: number | null;
          weight_max?: number | null;
          is_locked?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          name?: string;
          event_type?: 'Kata' | 'Kumite';
          age_min?: number;
          age_max?: number;
          gender?: 'Male' | 'Female' | 'Mixed';
          belt_level?: string | null;
          weight_min?: number | null;
          weight_max?: number | null;
          is_locked?: boolean;
          created_at?: string;
        };
      };
      category_participants: {
        Row: {
          id: string;
          category_id: string;
          athlete_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          athlete_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          athlete_id?: string;
          created_at?: string;
        };
      };
      matches: {
        Row: {
          id: string;
          category_id: string;
          round: number;
          match_number: number;
          athlete_ids: string[];
          kata_score_id: string | null;
          kumite_match_id: string | null;
          status: 'pending' | 'in_progress' | 'completed' | 'walkover' | 'disqualified';
          winner_id: string | null;
          result_status: 'pending' | 'official' | 'corrected';
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          round: number;
          match_number: number;
          athlete_ids: string[];
          kata_score_id?: string | null;
          kumite_match_id?: string | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'walkover' | 'disqualified';
          winner_id?: string | null;
          result_status?: 'pending' | 'official' | 'corrected';
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          round?: number;
          match_number?: number;
          athlete_ids?: string[];
          kata_score_id?: string | null;
          kumite_match_id?: string | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'walkover' | 'disqualified';
          winner_id?: string | null;
          result_status?: 'pending' | 'official' | 'corrected';
          created_at?: string;
        };
      };
      kata_scores: {
        Row: {
          id: string;
          match_id: string;
          athlete_id: string;
          judge_scores: { judge_id: string; score: number }[];
          final_score: number;
          status: 'pending' | 'official' | 'corrected';
          created_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          athlete_id: string;
          judge_scores: { judge_id: string; score: number }[];
          final_score: number;
          status?: 'pending' | 'official' | 'corrected';
          created_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          athlete_id?: string;
          judge_scores?: { judge_id: string; score: number }[];
          final_score?: number;
          status?: 'pending' | 'official' | 'corrected';
          created_at?: string;
        };
      };
      kumite_matches: {
        Row: {
          id: string;
          category_id: string;
          athlete1_id: string;
          athlete2_id: string;
          athlete1_points: ('Yuko' | 'Waza-ari' | 'Ippon')[];
          athlete2_points: ('Yuko' | 'Waza-ari' | 'Ippon')[];
          athlete1_penalties: number;
          athlete2_penalties: number;
          match_duration: number;
          elapsed_time: number;
          winner_id: string | null;
          status: 'pending' | 'in_progress' | 'completed' | 'walkover' | 'disqualified';
          result_status: 'pending' | 'official' | 'corrected';
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          athlete1_id: string;
          athlete2_id: string;
          athlete1_points?: ('Yuko' | 'Waza-ari' | 'Ippon')[];
          athlete2_points?: ('Yuko' | 'Waza-ari' | 'Ippon')[];
          athlete1_penalties?: number;
          athlete2_penalties?: number;
          match_duration: number;
          elapsed_time?: number;
          winner_id?: string | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'walkover' | 'disqualified';
          result_status?: 'pending' | 'official' | 'corrected';
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          athlete1_id?: string;
          athlete2_id?: string;
          athlete1_points?: ('Yuko' | 'Waza-ari' | 'Ippon')[];
          athlete2_points?: ('Yuko' | 'Waza-ari' | 'Ippon')[];
          athlete1_penalties?: number;
          athlete2_penalties?: number;
          match_duration?: number;
          elapsed_time?: number;
          winner_id?: string | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'walkover' | 'disqualified';
          result_status?: 'pending' | 'official' | 'corrected';
          created_at?: string;
        };
      };
      official_results: {
        Row: {
          id: string;
          category_id: string;
          athlete_id: string;
          position: number;
          medal: 'Gold' | 'Silver' | 'Bronze' | null;
          points: number;
          status: 'pending' | 'official' | 'corrected';
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          athlete_id: string;
          position: number;
          medal?: 'Gold' | 'Silver' | 'Bronze' | null;
          points?: number;
          status?: 'pending' | 'official' | 'corrected';
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          athlete_id?: string;
          position?: number;
          medal?: 'Gold' | 'Silver' | 'Bronze' | null;
          points?: number;
          status?: 'pending' | 'official' | 'corrected';
          created_at?: string;
        };
      };
      tournament_rules: {
        Row: {
          id: string;
          tournament_id: string;
          kata_judges_count: 5 | 7;
          kumite_match_duration: Record<string, number>;
          team_point_rules: { gold: number; silver: number; bronze: number };
          senshu_enabled: boolean;
          tie_break_rule: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          kata_judges_count: 5 | 7;
          kumite_match_duration: Record<string, number>;
          team_point_rules: { gold: number; silver: number; bronze: number };
          senshu_enabled?: boolean;
          tie_break_rule?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          kata_judges_count?: 5 | 7;
          kumite_match_duration?: Record<string, number>;
          team_point_rules?: { gold: number; silver: number; bronze: number };
          senshu_enabled?: boolean;
          tie_break_rule?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

