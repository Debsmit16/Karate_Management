// User Roles - PRD Section 3
export type UserRole = 'admin' | 'referee' | 'coach';

// Tournament Level - PRD Section 4.1
export type TournamentLevel = 'Local' | 'District' | 'Open';

// Events - PRD Section 4.1
export type EventType = 'Kata' | 'Kumite' | 'Both';

// Medal Types - PRD Section 7.1
export type MedalType = 'Gold' | 'Silver' | 'Bronze';

// Match Status
export type MatchStatus = 'pending' | 'in_progress' | 'completed' | 'walkover' | 'disqualified';

// Result Status - PRD Section 12
export type ResultStatus = 'pending' | 'official' | 'corrected';

// User - PRD Section 3
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string; // For coaches
}

// Team/Dojo - PRD Section 8.1
export interface Team {
  id: string;
  name: string;
  coachId: string;
  createdAt: string;
}

// Athlete - PRD Section 3.3
export interface Athlete {
  id: string;
  name: string;
  teamId: string;
  age: number;
  gender: 'Male' | 'Female';
  beltLevel: string;
  weight?: number; // For Kumite
}

// Tournament - PRD Section 4.1
export interface Tournament {
  id: string;
  name: string;
  level: TournamentLevel;
  events: EventType;
  teamChampionshipEnabled: boolean;
  createdAt: string;
  status: 'draft' | 'active' | 'completed';
}

// Category - PRD Section 4.2
export interface Category {
  id: string;
  tournamentId: string;
  name: string;
  eventType: 'Kata' | 'Kumite';
  ageRange: { min: number; max: number };
  gender: 'Male' | 'Female' | 'Mixed';
  beltLevel?: string;
  weightRange?: { min: number; max: number }; // For Kumite
  isLocked: boolean;
  participantIds: string[];
}

// Kata Scoring - PRD Section 5
export interface KataScore {
  id: string;
  matchId: string;
  athleteId: string;
  judgeScores: { judgeId: string; score: number }[];
  finalScore: number; // Auto-calculated: sum of middle scores
  status: ResultStatus;
}

// Kumite Points - PRD Section 6.1
export type KumitePoint = 'Yuko' | 'Waza-ari' | 'Ippon';

// Kumite Match - PRD Section 6
export interface KumiteMatch {
  id: string;
  categoryId: string;
  athlete1Id: string;
  athlete2Id: string;
  athlete1Points: KumitePoint[];
  athlete2Points: KumitePoint[];
  athlete1Penalties: number;
  athlete2Penalties: number;
  matchDuration: number; // in seconds
  elapsedTime: number;
  winnerId?: string;
  status: MatchStatus;
  resultStatus: ResultStatus;
}

// Match (Generic)
export interface Match {
  id: string;
  categoryId: string;
  round: number;
  matchNumber: number;
  athleteIds: string[];
  kataScoreId?: string;
  kumiteMatchId?: string;
  status: MatchStatus;
  winnerId?: string;
  resultStatus: ResultStatus;
}

// Official Result - PRD Section 7.1
export interface OfficialResult {
  id: string;
  categoryId: string;
  athleteId: string;
  position: number; // 1 = Gold, 2 = Silver, 3 = Bronze
  medal?: MedalType;
  points: number; // For team scoring
  status: ResultStatus;
}

// Team Championship - PRD Section 8
export interface TeamChampionship {
  tournamentId: string;
  teamPoints: {
    teamId: string;
    gold: number;
    silver: number;
    bronze: number;
    totalPoints: number;
  }[];
  pointRules: {
    gold: number; // Default: 3
    silver: number; // Default: 2
    bronze: number; // Default: 1
  };
  enabled: boolean;
}

// Tournament Rules Configuration - PRD Section 4.1, 5.1, 6.2
export interface TournamentRules {
  tournamentId: string;
  kataJudgesCount: 5 | 7; // PRD Section 5.1
  kumiteMatchDuration: Record<string, number>; // Age-based duration
  teamPointRules: {
    gold: number;
    silver: number;
    bronze: number;
  };
  senshuEnabled: boolean; // PRD Section 6.2
  tieBreakRule?: string;
}

