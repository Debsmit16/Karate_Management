import { useStore } from '../store/useStore';

export default function CoachDashboard() {
  const currentUser = useStore((state) => state.currentUser);
  const teams = useStore((state) => state.teams);
  const athletes = useStore((state) => state.athletes);
  const officialResults = useStore((state) => state.officialResults);
  const teamChampionships = useStore((state) => state.teamChampionships);
  const tournaments = useStore((state) => state.tournaments);

  const myTeam = teams.find((t) => t.coachId === currentUser?.id);
  const myAthletes = athletes.filter((a) => a.teamId === myTeam?.id);

  // Get results for my athletes
  const myAthleteIds = myAthletes.map((a) => a.id);
  const myResults = officialResults.filter((r) =>
    myAthleteIds.includes(r.athleteId)
  );

  // Calculate team stats
  const teamStats = {
    gold: myResults.filter((r) => r.medal === 'Gold').length,
    silver: myResults.filter((r) => r.medal === 'Silver').length,
    bronze: myResults.filter((r) => r.medal === 'Bronze').length,
  };

  // Get team championship for active tournaments
  const activeTournaments = tournaments.filter((t) => t.status === 'active');
  const teamChampionship = teamChampionships.find(
    (tc) => activeTournaments.some((t) => t.id === tc.tournamentId)
  );

  const myTeamRank =
    teamChampionship && myTeam
      ? teamChampionship.teamPoints
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .findIndex((tp) => tp.teamId === myTeam.id) + 1
      : null;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Coach Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          PRD Section 3.3: Read-only + team management
        </p>
      </div>

      {/* Team Info - Mobile: stacked, Desktop: side-by-side */}
      {myTeam ? (
        <>
          <div className="card">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              My Team: {myTeam.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-600">
                  {teamStats.gold}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Gold</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-400">
                  {teamStats.silver}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Silver</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                  {teamStats.bronze}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Bronze</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary-600">
                  {myTeamRank || '-'}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Rank</div>
              </div>
            </div>
          </div>

          {/* My Athletes - PRD Section 9 */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              My Athletes ({myAthletes.length})
            </h2>
            {myAthletes.length === 0 ? (
              <div className="card text-center py-8 sm:py-12">
                <p className="text-gray-500 text-sm sm:text-base mb-4">
                  No athletes yet. Add students to your team.
                </p>
                <button className="btn btn-primary">Add Athlete</button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {myAthletes.map((athlete) => {
                  const athleteResults = myResults.filter(
                    (r) => r.athleteId === athlete.id
                  );
                  const athleteMedals = {
                    gold: athleteResults.filter((r) => r.medal === 'Gold')
                      .length,
                    silver: athleteResults.filter((r) => r.medal === 'Silver')
                      .length,
                    bronze: athleteResults.filter((r) => r.medal === 'Bronze')
                      .length,
                  };

                  return (
                    <div key={athlete.id} className="card">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-base sm:text-lg text-gray-900">
                            {athlete.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {athlete.gender} • Age {athlete.age} • {athlete.beltLevel}
                            {athlete.weight && ` • ${athlete.weight}kg`}
                          </p>
                        </div>
                        {(athleteMedals.gold > 0 ||
                          athleteMedals.silver > 0 ||
                          athleteMedals.bronze > 0) && (
                          <div className="flex space-x-1">
                            {athleteMedals.gold > 0 && (
                              <span className="text-yellow-600 text-sm font-semibold">
                                🥇{athleteMedals.gold}
                              </span>
                            )}
                            {athleteMedals.silver > 0 && (
                              <span className="text-gray-400 text-sm font-semibold">
                                🥈{athleteMedals.silver}
                              </span>
                            )}
                            {athleteMedals.bronze > 0 && (
                              <span className="text-orange-600 text-sm font-semibold">
                                🥉{athleteMedals.bronze}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {athleteResults.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs sm:text-sm text-gray-600">
                            {athleteResults.length} result(s) • PRD Section 9:
                            Auto-synced from official results
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="card text-center py-8 sm:py-12">
          <p className="text-gray-500 text-sm sm:text-base mb-4">
            You need to create a team first.
          </p>
          <button className="btn btn-primary">Create Team</button>
        </div>
      )}

      {/* Instructions */}
      <div className="card bg-green-50 border-green-200">
        <h3 className="font-semibold text-sm sm:text-base text-green-900 mb-2">
          Coach Capabilities (PRD Section 3.3)
        </h3>
        <ul className="space-y-1 text-xs sm:text-sm text-green-800 list-disc list-inside">
          <li>Create and manage your dojo/team</li>
          <li>Add students</li>
          <li>Track matches, scores, medals, and team ranking</li>
          <li>View official results (read-only)</li>
        </ul>
      </div>
    </div>
  );
}

