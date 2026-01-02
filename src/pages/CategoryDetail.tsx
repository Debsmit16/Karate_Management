import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function CategoryDetail() {
  const { id } = useParams<{ id: string }>();
  const categories = useStore((state) => state.categories);
  const matches = useStore((state) => state.matches);
  const athletes = useStore((state) => state.athletes);
  const currentUser = useStore((state) => state.currentUser);

  const category = categories.find((c) => c.id === id);
  const categoryMatches = matches.filter((m) => m.categoryId === id);
  const categoryAthletes = athletes.filter((a) =>
    category?.participantIds.includes(a.id)
  );

  if (!category) {
    return (
      <div className="card text-center py-8 sm:py-12">
        <p className="text-gray-500">Category not found</p>
        <Link to="/" className="btn btn-primary mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const getAthleteName = (athleteId: string) => {
    const athlete = categoryAthletes.find((a) => a.id === athleteId);
    return athlete?.name || 'Unknown';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/"
          className="text-sm text-primary-600 hover:text-primary-700 mb-2 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {category.name}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          {category.eventType} • {category.gender} • Age {category.ageRange.min}-
          {category.ageRange.max}
        </p>
      </div>

      {/* Participants */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Participants ({categoryAthletes.length})
        </h2>
        {categoryAthletes.length === 0 ? (
          <div className="card text-center py-8 sm:py-12">
            <p className="text-gray-500 text-sm sm:text-base">
              No participants yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {categoryAthletes.map((athlete) => (
              <div key={athlete.id} className="card">
                <h3 className="font-semibold text-base text-gray-900">
                  {athlete.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {athlete.beltLevel}
                  {athlete.weight && ` • ${athlete.weight}kg`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Matches */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Matches ({categoryMatches.length})
        </h2>
        {categoryMatches.length === 0 ? (
          <div className="card text-center py-8 sm:py-12">
            <p className="text-gray-500 text-sm sm:text-base">
              No matches scheduled yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {categoryMatches.map((match) => (
              <Link
                key={match.id}
                to={`/match/${match.id}`}
                className="card hover:shadow-md transition-shadow block"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1">
                      Round {match.round} - Match {match.matchNumber}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      {match.athleteIds.map((athleteId, idx) => (
                        <div key={athleteId}>
                          {idx + 1}. {getAthleteName(athleteId)}
                          {match.winnerId === athleteId && (
                            <span className="ml-2 text-green-600 font-semibold">
                              ✓ Winner
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                      match.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : match.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {match.status}
                  </span>
                </div>
                {(currentUser?.role === 'referee' ||
                  currentUser?.role === 'admin') &&
                  (match.status === 'pending' ||
                    match.status === 'in_progress') && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs sm:text-sm text-primary-600">
                        Click to score this match
                      </p>
                    </div>
                  )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

