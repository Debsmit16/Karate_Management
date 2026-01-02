import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type {
  Tournament,
  Category,
  Athlete,
  Team,
  Match,
  KataScore,
  KumiteMatch,
  OfficialResult,
  TournamentRules,
} from '../types';

interface SupabaseState {
  // Tournaments
  tournaments: Tournament[];
  loadingTournaments: boolean;
  fetchTournaments: () => Promise<void>;
  addTournament: (tournament: Omit<Tournament, 'id' | 'createdAt'>) => Promise<void>;
  updateTournament: (id: string, updates: Partial<Tournament>) => Promise<void>;

  // Categories
  categories: Category[];
  loadingCategories: boolean;
  fetchCategories: (tournamentId?: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Teams
  teams: Team[];
  loadingTeams: boolean;
  fetchTeams: () => Promise<void>;
  addTeam: (team: Omit<Team, 'id' | 'createdAt'>) => Promise<void>;

  // Athletes
  athletes: Athlete[];
  loadingAthletes: boolean;
  fetchAthletes: (teamId?: string) => Promise<void>;
  addAthlete: (athlete: Omit<Athlete, 'id'>) => Promise<void>;
  updateAthlete: (id: string, updates: Partial<Athlete>) => Promise<void>;

  // Matches
  matches: Match[];
  loadingMatches: boolean;
  fetchMatches: (categoryId?: string) => Promise<void>;
  addMatch: (match: Omit<Match, 'id'>) => Promise<void>;
  updateMatch: (id: string, updates: Partial<Match>) => Promise<void>;

  // Kata Scores
  kataScores: KataScore[];
  loadingKataScores: boolean;
  fetchKataScores: (matchId?: string) => Promise<void>;
  addKataScore: (score: Omit<KataScore, 'id'>) => Promise<void>;
  updateKataScore: (id: string, updates: Partial<KataScore>) => Promise<void>;

  // Kumite Matches
  kumiteMatches: KumiteMatch[];
  loadingKumiteMatches: boolean;
  fetchKumiteMatches: (categoryId?: string) => Promise<void>;
  addKumiteMatch: (match: Omit<KumiteMatch, 'id'>) => Promise<void>;
  updateKumiteMatch: (id: string, updates: Partial<KumiteMatch>) => Promise<void>;

  // Official Results
  officialResults: OfficialResult[];
  loadingOfficialResults: boolean;
  fetchOfficialResults: (categoryId?: string) => Promise<void>;
  addOfficialResult: (result: Omit<OfficialResult, 'id'>) => Promise<void>;
  updateOfficialResult: (id: string, updates: Partial<OfficialResult>) => Promise<void>;

  // Tournament Rules
  tournamentRules: TournamentRules[];
  loadingTournamentRules: boolean;
  fetchTournamentRules: (tournamentId?: string) => Promise<void>;
  setTournamentRules: (rules: Omit<TournamentRules, 'id'>) => Promise<void>;
}

export const useSupabaseStore = create<SupabaseState>((set, get) => ({
  // Tournaments
  tournaments: [],
  loadingTournaments: false,
  fetchTournaments: async () => {
    set({ loadingTournaments: true });
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tournaments:', error);
      set({ loadingTournaments: false });
      return;
    }

    const tournaments: Tournament[] = (data || []).map((t) => ({
      id: t.id,
      name: t.name,
      level: t.level,
      events: t.events,
      teamChampionshipEnabled: t.team_championship_enabled,
      createdAt: t.created_at,
      status: t.status,
    }));

    set({ tournaments, loadingTournaments: false });
  },
  addTournament: async (tournament) => {
    const { error } = await supabase
      .from('tournaments')
      .insert({
        name: tournament.name,
        level: tournament.level,
        events: tournament.events,
        team_championship_enabled: tournament.teamChampionshipEnabled,
        status: tournament.status || 'draft',
      })
      .select()
      .single();

    if (error) throw error;
    await get().fetchTournaments();
  },
  updateTournament: async (id, updates) => {
    const { error } = await supabase
      .from('tournaments')
      .update({
        name: updates.name,
        level: updates.level,
        events: updates.events,
        team_championship_enabled: updates.teamChampionshipEnabled,
        status: updates.status,
      })
      .eq('id', id);

    if (error) throw error;
    await get().fetchTournaments();
  },

  // Categories
  categories: [],
  loadingCategories: false,
  fetchCategories: async (tournamentId) => {
    set({ loadingCategories: true });
    let query = supabase.from('categories').select('*');

    if (tournamentId) {
      query = query.eq('tournament_id', tournamentId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching categories:', error);
      set({ loadingCategories: false });
      return;
    }

    // Also fetch participants for each category
    const categoriesWithParticipants = await Promise.all(
      (data || []).map(async (cat) => {
        const { data: participants } = await supabase
          .from('category_participants')
          .select('athlete_id')
          .eq('category_id', cat.id);

        return {
          id: cat.id,
          tournamentId: cat.tournament_id,
          name: cat.name,
          eventType: cat.event_type,
          ageRange: { min: cat.age_min, max: cat.age_max },
          gender: cat.gender,
          beltLevel: cat.belt_level || undefined,
          weightRange:
            cat.weight_min && cat.weight_max
              ? { min: cat.weight_min, max: cat.weight_max }
              : undefined,
          isLocked: cat.is_locked,
          participantIds: (participants || []).map((p) => p.athlete_id),
        };
      })
    );

    set({ categories: categoriesWithParticipants, loadingCategories: false });
  },
  addCategory: async (category) => {
    const { data: categoryData, error } = await supabase
      .from('categories')
      .insert({
        tournament_id: category.tournamentId,
        name: category.name,
        event_type: category.eventType,
        age_min: category.ageRange.min,
        age_max: category.ageRange.max,
        gender: category.gender,
        belt_level: category.beltLevel || null,
        weight_min: category.weightRange?.min || null,
        weight_max: category.weightRange?.max || null,
        is_locked: category.isLocked,
      })
      .select()
      .single();

    if (error) throw error;

    // Add participants
    if (category.participantIds.length > 0 && categoryData) {
      await supabase.from('category_participants').insert(
        category.participantIds.map((athleteId) => ({
          category_id: categoryData.id,
          athlete_id: athleteId,
        }))
      );
    }

    await get().fetchCategories();
  },
  updateCategory: async (id, updates) => {
    const { error } = await supabase
      .from('categories')
      .update({
        name: updates.name,
        event_type: updates.eventType,
        age_min: updates.ageRange?.min,
        age_max: updates.ageRange?.max,
        gender: updates.gender,
        belt_level: updates.beltLevel || null,
        weight_min: updates.weightRange?.min || null,
        weight_max: updates.weightRange?.max || null,
        is_locked: updates.isLocked,
      })
      .eq('id', id);

    if (error) throw error;
    await get().fetchCategories();
  },
  deleteCategory: async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    await get().fetchCategories();
  },

  // Teams
  teams: [],
  loadingTeams: false,
  fetchTeams: async () => {
    set({ loadingTeams: true });
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching teams:', error);
      set({ loadingTeams: false });
      return;
    }

    const teams: Team[] = (data || []).map((t) => ({
      id: t.id,
      name: t.name,
      coachId: t.coach_id,
      createdAt: t.created_at,
    }));

    set({ teams, loadingTeams: false });
  },
  addTeam: async (team) => {
    const { error } = await supabase
      .from('teams')
      .insert({
        name: team.name,
        coach_id: team.coachId,
      })
      .select()
      .single();

    if (error) throw error;
    await get().fetchTeams();
  },

  // Athletes
  athletes: [],
  loadingAthletes: false,
  fetchAthletes: async (teamId) => {
    set({ loadingAthletes: true });
    let query = supabase.from('athletes').select('*');

    if (teamId) {
      query = query.eq('team_id', teamId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching athletes:', error);
      set({ loadingAthletes: false });
      return;
    }

    const athletes: Athlete[] = (data || []).map((a) => ({
      id: a.id,
      name: a.name,
      teamId: a.team_id,
      age: a.age,
      gender: a.gender,
      beltLevel: a.belt_level,
      weight: a.weight || undefined,
    }));

    set({ athletes, loadingAthletes: false });
  },
  addAthlete: async (athlete) => {
    const { error } = await supabase
      .from('athletes')
      .insert({
        team_id: athlete.teamId,
        name: athlete.name,
        age: athlete.age,
        gender: athlete.gender,
        belt_level: athlete.beltLevel,
        weight: athlete.weight || null,
      })
      .select()
      .single();

    if (error) throw error;
    await get().fetchAthletes();
  },
  updateAthlete: async (id, updates) => {
    const { error } = await supabase
      .from('athletes')
      .update({
        name: updates.name,
        age: updates.age,
        gender: updates.gender,
        belt_level: updates.beltLevel,
        weight: updates.weight || null,
      })
      .eq('id', id);

    if (error) throw error;
    await get().fetchAthletes();
  },

  // Matches
  matches: [],
  loadingMatches: false,
  fetchMatches: async (categoryId) => {
    set({ loadingMatches: true });
    let query = supabase.from('matches').select('*');

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching matches:', error);
      set({ loadingMatches: false });
      return;
    }

    const matches: Match[] = (data || []).map((m) => ({
      id: m.id,
      categoryId: m.category_id,
      round: m.round,
      matchNumber: m.match_number,
      athleteIds: m.athlete_ids,
      kataScoreId: m.kata_score_id || undefined,
      kumiteMatchId: m.kumite_match_id || undefined,
      status: m.status,
      winnerId: m.winner_id || undefined,
      resultStatus: m.result_status,
    }));

    set({ matches, loadingMatches: false });
  },
  addMatch: async (match) => {
    const { error } = await supabase
      .from('matches')
      .insert({
        category_id: match.categoryId,
        round: match.round,
        match_number: match.matchNumber,
        athlete_ids: match.athleteIds,
        kata_score_id: match.kataScoreId || null,
        kumite_match_id: match.kumiteMatchId || null,
        status: match.status,
        winner_id: match.winnerId || null,
        result_status: match.resultStatus,
      })
      .select()
      .single();

    if (error) throw error;
    await get().fetchMatches();
  },
  updateMatch: async (id, updates) => {
    const { error } = await supabase
      .from('matches')
      .update({
        category_id: updates.categoryId,
        round: updates.round,
        match_number: updates.matchNumber,
        athlete_ids: updates.athleteIds,
        kata_score_id: updates.kataScoreId || null,
        kumite_match_id: updates.kumiteMatchId || null,
        status: updates.status,
        winner_id: updates.winnerId || null,
        result_status: updates.resultStatus,
      })
      .eq('id', id);

    if (error) throw error;
    await get().fetchMatches();
  },

  // Kata Scores
  kataScores: [],
  loadingKataScores: false,
  fetchKataScores: async (matchId) => {
    set({ loadingKataScores: true });
    let query = supabase.from('kata_scores').select('*');

    if (matchId) {
      query = query.eq('match_id', matchId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching kata scores:', error);
      set({ loadingKataScores: false });
      return;
    }

    const kataScores: KataScore[] = (data || []).map((ks) => ({
      id: ks.id,
      matchId: ks.match_id,
      athleteId: ks.athlete_id,
      judgeScores: ks.judge_scores,
      finalScore: parseFloat(ks.final_score),
      status: ks.status,
    }));

    set({ kataScores, loadingKataScores: false });
  },
  addKataScore: async (score) => {
    const { error } = await supabase
      .from('kata_scores')
      .insert({
        match_id: score.matchId,
        athlete_id: score.athleteId,
        judge_scores: score.judgeScores,
        final_score: score.finalScore,
        status: score.status,
      })
      .select()
      .single();

    if (error) throw error;
    await get().fetchKataScores();
  },
  updateKataScore: async (id, updates) => {
    const { error } = await supabase
      .from('kata_scores')
      .update({
        judge_scores: updates.judgeScores,
        final_score: updates.finalScore,
        status: updates.status,
      })
      .eq('id', id);

    if (error) throw error;
    await get().fetchKataScores();
  },

  // Kumite Matches
  kumiteMatches: [],
  loadingKumiteMatches: false,
  fetchKumiteMatches: async (categoryId) => {
    set({ loadingKumiteMatches: true });
    let query = supabase.from('kumite_matches').select('*');

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching kumite matches:', error);
      set({ loadingKumiteMatches: false });
      return;
    }

    const kumiteMatches: KumiteMatch[] = (data || []).map((km) => ({
      id: km.id,
      categoryId: km.category_id,
      athlete1Id: km.athlete1_id,
      athlete2Id: km.athlete2_id,
      athlete1Points: km.athlete1_points,
      athlete2Points: km.athlete2_points,
      athlete1Penalties: km.athlete1_penalties,
      athlete2Penalties: km.athlete2_penalties,
      matchDuration: km.match_duration,
      elapsedTime: km.elapsed_time,
      winnerId: km.winner_id || undefined,
      status: km.status,
      resultStatus: km.result_status,
    }));

    set({ kumiteMatches, loadingKumiteMatches: false });
  },
  addKumiteMatch: async (match) => {
    const { error } = await supabase
      .from('kumite_matches')
      .insert({
        category_id: match.categoryId,
        athlete1_id: match.athlete1Id,
        athlete2_id: match.athlete2Id,
        athlete1_points: match.athlete1Points,
        athlete2_points: match.athlete2Points,
        athlete1_penalties: match.athlete1Penalties,
        athlete2_penalties: match.athlete2Penalties,
        match_duration: match.matchDuration,
        elapsed_time: match.elapsedTime,
        winner_id: match.winnerId || null,
        status: match.status,
        result_status: match.resultStatus,
      })
      .select()
      .single();

    if (error) throw error;
    await get().fetchKumiteMatches();
  },
  updateKumiteMatch: async (id, updates) => {
    const { error } = await supabase
      .from('kumite_matches')
      .update({
        athlete1_points: updates.athlete1Points,
        athlete2_points: updates.athlete2Points,
        athlete1_penalties: updates.athlete1Penalties,
        athlete2_penalties: updates.athlete2Penalties,
        elapsed_time: updates.elapsedTime,
        winner_id: updates.winnerId || null,
        status: updates.status,
        result_status: updates.resultStatus,
      })
      .eq('id', id);

    if (error) throw error;
    await get().fetchKumiteMatches();
  },

  // Official Results
  officialResults: [],
  loadingOfficialResults: false,
  fetchOfficialResults: async (categoryId) => {
    set({ loadingOfficialResults: true });
    let query = supabase.from('official_results').select('*');

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query.order('position', { ascending: true });

    if (error) {
      console.error('Error fetching official results:', error);
      set({ loadingOfficialResults: false });
      return;
    }

    const officialResults: OfficialResult[] = (data || []).map((or) => ({
      id: or.id,
      categoryId: or.category_id,
      athleteId: or.athlete_id,
      position: or.position,
      medal: or.medal || undefined,
      points: or.points,
      status: or.status,
    }));

    set({ officialResults, loadingOfficialResults: false });
  },
  addOfficialResult: async (result) => {
    const { error } = await supabase
      .from('official_results')
      .insert({
        category_id: result.categoryId,
        athlete_id: result.athleteId,
        position: result.position,
        medal: result.medal || null,
        points: result.points,
        status: result.status,
      })
      .select()
      .single();

    if (error) throw error;
    await get().fetchOfficialResults();
  },
  updateOfficialResult: async (id, updates) => {
    const { error } = await supabase
      .from('official_results')
      .update({
        position: updates.position,
        medal: updates.medal || null,
        points: updates.points,
        status: updates.status,
      })
      .eq('id', id);

    if (error) throw error;
    await get().fetchOfficialResults();
  },

  // Tournament Rules
  tournamentRules: [],
  loadingTournamentRules: false,
  fetchTournamentRules: async (tournamentId) => {
    set({ loadingTournamentRules: true });
    let query = supabase.from('tournament_rules').select('*');

    if (tournamentId) {
      query = query.eq('tournament_id', tournamentId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tournament rules:', error);
      set({ loadingTournamentRules: false });
      return;
    }

    const tournamentRules: TournamentRules[] = (data || []).map((tr) => ({
      id: tr.id,
      tournamentId: tr.tournament_id,
      kataJudgesCount: tr.kata_judges_count,
      kumiteMatchDuration: tr.kumite_match_duration,
      teamPointRules: tr.team_point_rules,
      senshuEnabled: tr.senshu_enabled,
      tieBreakRule: tr.tie_break_rule || undefined,
    }));

    set({ tournamentRules, loadingTournamentRules: false });
  },
  setTournamentRules: async (rules) => {
    const { error } = await supabase
      .from('tournament_rules')
      .upsert({
        tournament_id: rules.tournamentId,
        kata_judges_count: rules.kataJudgesCount,
        kumite_match_duration: rules.kumiteMatchDuration,
        team_point_rules: rules.teamPointRules,
        senshu_enabled: rules.senshuEnabled,
        tie_break_rule: rules.tieBreakRule || null,
      });

    if (error) throw error;
    await get().fetchTournamentRules();
  },
}));

