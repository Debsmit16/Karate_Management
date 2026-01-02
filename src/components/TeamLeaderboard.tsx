import { useStore } from '../store/useStore';
import type { TeamChampionship } from '../types';

interface TeamLeaderboardProps {
  tournamentId: string;
}

export default function TeamLeaderboard({ tournamentId }: TeamLeaderboardProps) {
  const teamChampionships = useStore((state) => state.teamChampionships);
  const teams = useStore((state) => state.teams);

  const championship = teamChampionships.find(
    (tc) => tc.tournamentId === tournamentId
  );

  if (!championship || !championship.enabled) {
    return (
      <div className="card text-center py-8 sm:py-12">
        <p className="text-gray-500 text-sm sm:text-base">
          Team Championship is not enabled for this tournament.
        </p>
      </div>
    );
  }

  // Sort teams by total points, then by tie-break rules (PRD Section 8.4)
  const sortedTeams = [...championship.teamPoints]
    .map((tp) => {
      const team = teams.find((t) => t.id === tp.teamId);
      return {
        ...tp,
        teamName: team?.name || 'Unknown Team',
      };
    })
    .sort((a, b) => {
      // Primary: Total points
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      // Tie-break: More gold (PRD Section 8.4)
      if (b.gold !== a.gold) {
        return b.gold - a.gold;
      }
      // Tie-break: More silver
      if (b.silver !== a.silver) {
        return b.silver - a.silver;
      }
      // Tie-break: More bronze
      return b.bronze - a.bronze;
    });

  return (
    <div className="card">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">
        Team Championship Leaderboard
      </h2>
      <p className="text-xs sm:text-sm text-gray-600 mb-4">
        PRD Section 8.4: Auto-calculated, real-time updates
      </p>

      {/* Mobile: Stacked cards, Desktop: Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                Rank
              </th>
              <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                Team
              </th>
              <th className="text-center py-2 px-3 text-sm font-semibold text-gray-700">
                🥇
              </th>
              <th className="text-center py-2 px-3 text-sm font-semibold text-gray-700">
                🥈
              </th>
              <th className="text-center py-2 px-3 text-sm font-semibold text-gray-700">
                🥉
              </th>
              <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">
                Total Points
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, index) => (
              <tr
                key={team.teamId}
                className={`border-b border-gray-100 ${
                  index < 3 ? 'bg-yellow-50' : ''
                }`}
              >
                <td className="py-3 px-3 text-sm font-semibold text-gray-900">
                  {index + 1}
                </td>
                <td className="py-3 px-3 text-sm text-gray-900">{team.teamName}</td>
                <td className="py-3 px-3 text-sm text-center text-yellow-600 font-semibold">
                  {team.gold}
                </td>
                <td className="py-3 px-3 text-sm text-center text-gray-400 font-semibold">
                  {team.silver}
                </td>
                <td className="py-3 px-3 text-sm text-center text-orange-600 font-semibold">
                  {team.bronze}
                </td>
                <td className="py-3 px-3 text-sm text-right font-bold text-primary-600">
                  {team.totalPoints}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: Card view */}
      <div className="sm:hidden space-y-3">
        {sortedTeams.map((team, index) => (
          <div
            key={team.teamId}
            className={`p-3 rounded-lg border ${
              index < 3
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">#{index + 1}</span>
                <span className="font-semibold text-sm text-gray-900">
                  {team.teamName}
                </span>
              </div>
              <span className="text-lg font-bold text-primary-600">
                {team.totalPoints} pts
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center space-x-3">
                <span className="text-yellow-600 font-semibold">
                  🥇 {team.gold}
                </span>
                <span className="text-gray-400 font-semibold">
                  🥈 {team.silver}
                </span>
                <span className="text-orange-600 font-semibold">
                  🥉 {team.bronze}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedTeams.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No team results yet.
        </div>
      )}
    </div>
  );
}

