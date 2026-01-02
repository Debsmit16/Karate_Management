import type {
  OfficialResult,
  TeamChampionship,
  TournamentRules,
  Team,
} from '../types';
import { calculateTeamPoints } from './scoring';

// PRD Section 7.1: Official Results - Single Source of Truth
// PRD Section 8.3: Auto Calculation of Team Points

export function updateTeamChampionship(
  officialResults: OfficialResult[],
  teams: Team[],
  tournamentId: string,
  pointRules: { gold: number; silver: number; bronze: number }
): TeamChampionship {
  // Group results by team
  const teamStats: Record<
    string,
    { gold: number; silver: number; bronze: number }
  > = {};

  officialResults.forEach((result) => {
    // Find which team this athlete belongs to
    const athleteTeam = teams.find((team) => {
      // This would need athlete data - simplified for now
      // In real implementation, we'd have athlete.teamId
      return true; // Placeholder
    });

    if (athleteTeam) {
      if (!teamStats[athleteTeam.id]) {
        teamStats[athleteTeam.id] = { gold: 0, silver: 0, bronze: 0 };
      }

      if (result.medal === 'Gold') {
        teamStats[athleteTeam.id].gold++;
      } else if (result.medal === 'Silver') {
        teamStats[athleteTeam.id].silver++;
      } else if (result.medal === 'Bronze') {
        teamStats[athleteTeam.id].bronze++;
      }
    }
  });

  // Calculate total points for each team
  const teamPoints = Object.entries(teamStats).map(([teamId, stats]) => ({
    teamId,
    gold: stats.gold,
    silver: stats.silver,
    bronze: stats.bronze,
    totalPoints: calculateTeamPoints(stats.gold, stats.silver, stats.bronze, pointRules),
  }));

  return {
    tournamentId,
    teamPoints,
    pointRules,
    enabled: true,
  };
}

// PRD Section 7.2: Auto Synchronization
// This function ensures all dashboards see the same official results
export function syncOfficialResults(
  results: OfficialResult[]
): {
  coachView: OfficialResult[];
  adminView: OfficialResult[];
  publicView: OfficialResult[];
} {
  // PRD Section 10: Shared Visibility Model
  // All roles see the same official results
  const officialOnly = results.filter((r) => r.status === 'official');

  return {
    coachView: officialOnly,
    adminView: results, // Admin sees all including pending/corrected
    publicView: officialOnly,
  };
}

