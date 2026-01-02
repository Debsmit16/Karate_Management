import { create } from 'zustand';
import type {
  User,
  Tournament,
  Category,
  Athlete,
  Team,
  Match,
  KataScore,
  KumiteMatch,
  OfficialResult,
  TeamChampionship,
  TournamentRules,
} from '../types';

interface AppState {
  // Current user
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Tournaments
  tournaments: Tournament[];
  addTournament: (tournament: Tournament) => void;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Teams
  teams: Team[];
  addTeam: (team: Team) => void;

  // Athletes
  athletes: Athlete[];
  addAthlete: (athlete: Athlete) => void;
  updateAthlete: (id: string, updates: Partial<Athlete>) => void;

  // Matches
  matches: Match[];
  addMatch: (match: Match) => void;
  updateMatch: (id: string, updates: Partial<Match>) => void;

  // Kata Scores
  kataScores: KataScore[];
  addKataScore: (score: KataScore) => void;
  updateKataScore: (id: string, updates: Partial<KataScore>) => void;

  // Kumite Matches
  kumiteMatches: KumiteMatch[];
  addKumiteMatch: (match: KumiteMatch) => void;
  updateKumiteMatch: (id: string, updates: Partial<KumiteMatch>) => void;

  // Official Results - PRD Section 7 (Single Source of Truth)
  officialResults: OfficialResult[];
  addOfficialResult: (result: OfficialResult) => void;
  updateOfficialResult: (id: string, updates: Partial<OfficialResult>) => void;

  // Team Championship - PRD Section 8
  teamChampionships: TeamChampionship[];
  updateTeamChampionship: (tournamentId: string, championship: TeamChampionship) => void;

  // Tournament Rules - PRD Section 4.1, 5.1, 6.2
  tournamentRules: TournamentRules[];
  setTournamentRules: (rules: TournamentRules) => void;
}

export const useStore = create<AppState>((set) => ({
  // Current user
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  // Tournaments
  tournaments: [],
  addTournament: (tournament) =>
    set((state) => ({ tournaments: [...state.tournaments, tournament] })),
  updateTournament: (id, updates) =>
    set((state) => ({
      tournaments: state.tournaments.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),

  // Categories
  categories: [],
  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),
  updateCategory: (id, updates) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),

  // Teams
  teams: [],
  addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),

  // Athletes
  athletes: [],
  addAthlete: (athlete) =>
    set((state) => ({ athletes: [...state.athletes, athlete] })),
  updateAthlete: (id, updates) =>
    set((state) => ({
      athletes: state.athletes.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),

  // Matches
  matches: [],
  addMatch: (match) => set((state) => ({ matches: [...state.matches, match] })),
  updateMatch: (id, updates) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),

  // Kata Scores
  kataScores: [],
  addKataScore: (score) =>
    set((state) => ({ kataScores: [...state.kataScores, score] })),
  updateKataScore: (id, updates) =>
    set((state) => ({
      kataScores: state.kataScores.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),

  // Kumite Matches
  kumiteMatches: [],
  addKumiteMatch: (match) =>
    set((state) => ({ kumiteMatches: [...state.kumiteMatches, match] })),
  updateKumiteMatch: (id, updates) =>
    set((state) => ({
      kumiteMatches: state.kumiteMatches.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),

  // Official Results
  officialResults: [],
  addOfficialResult: (result) =>
    set((state) => ({
      officialResults: [...state.officialResults, result],
    })),
  updateOfficialResult: (id, updates) =>
    set((state) => ({
      officialResults: state.officialResults.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),

  // Team Championships
  teamChampionships: [],
  updateTeamChampionship: (tournamentId, championship) =>
    set((state) => ({
      teamChampionships: state.teamChampionships.filter(
        (tc) => tc.tournamentId !== tournamentId
      ).concat(championship),
    })),

  // Tournament Rules
  tournamentRules: [],
  setTournamentRules: (rules) =>
    set((state) => ({
      tournamentRules: state.tournamentRules.filter(
        (tr) => tr.tournamentId !== rules.tournamentId
      ).concat(rules),
    })),
}));

