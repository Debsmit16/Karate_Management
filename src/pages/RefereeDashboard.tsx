import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import type { Match } from '../types';

export default function RefereeDashboard() {
  const matches = useStore((state) => state.matches);
  const categories = useStore((state) => state.categories);
  const currentUser = useStore((state) => state.currentUser);

  // Get matches assigned to this referee or all pending/in-progress matches
  const assignedMatches = matches.filter(
    (m) => m.status === 'pending' || m.status === 'in_progress'
  );

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Referee Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          PRD Section 3.2: Match execution only
        </p>
      </div>

      {/* Active Matches - Mobile: stacked, Desktop: grid */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Active Matches
        </h2>
        {assignedMatches.length === 0 ? (
          <div className="card text-center py-8 sm:py-12">
            <p className="text-gray-500 text-sm sm:text-base">
              No active matches assigned. Wait for admin to assign matches.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {assignedMatches.map((match) => (
              <Link
                key={match.id}
                to={`/match/${match.id}`}
                className="card hover:shadow-md transition-shadow block"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1">
                      {getCategoryName(match.categoryId)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Round {match.round} - Match {match.matchNumber}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                      match.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {match.status === 'in_progress' ? 'In Progress' : 'Pending'}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Click to score this match
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Instructions - Mobile: compact, Desktop: expanded */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-sm sm:text-base text-blue-900 mb-2">
          Referee Instructions
        </h3>
        <ul className="space-y-1 text-xs sm:text-sm text-blue-800 list-disc list-inside">
          <li>Enter Kata scores (PRD Section 5.1)</li>
          <li>Control Kumite scoring: points, penalties, timer (PRD Section 6)</li>
          <li>End matches when complete</li>
          <li>You cannot edit categories or modify results after finalization</li>
        </ul>
      </div>
    </div>
  );
}

