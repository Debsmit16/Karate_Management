import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../store/useStore';
import TeamLeaderboard from '../components/TeamLeaderboard';
import type { Category, EventType } from '../types';

export default function TournamentDetail() {
  const { id } = useParams<{ id: string }>();
  const tournaments = useStore((state) => state.tournaments);
  const categories = useStore((state) => state.categories);
  const addCategory = useStore((state) => state.addCategory);
  const currentUser = useStore((state) => state.currentUser);

  const tournament = tournaments.find((t) => t.id === id);
  const tournamentCategories = categories.filter((c) => c.tournamentId === id);

  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    eventType: 'Kata' | 'Kumite';
    ageMin: number;
    ageMax: number;
    gender: 'Male' | 'Female' | 'Mixed';
    beltLevel: string;
    weightMin?: number;
    weightMax?: number;
  }>({
    name: '',
    eventType: 'Kata',
    ageMin: 8,
    ageMax: 10,
    gender: 'Mixed',
    beltLevel: '',
  });

  if (!tournament) {
    return (
      <div className="card text-center py-8 sm:py-12">
        <p className="text-gray-500">Tournament not found</p>
        <Link to="/" className="btn btn-primary mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // PRD Section 3.1: Only admin can create categories
  const canManage = currentUser?.role === 'admin';

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const category: Category = {
      id: Date.now().toString(),
      tournamentId: tournament.id,
      name: formData.name,
      eventType: formData.eventType,
      ageRange: { min: formData.ageMin, max: formData.ageMax },
      gender: formData.gender,
      beltLevel: formData.beltLevel || undefined,
      weightRange:
        formData.eventType === 'Kumite' && formData.weightMin && formData.weightMax
          ? { min: formData.weightMin, max: formData.weightMax }
          : undefined,
      isLocked: false,
      participantIds: [],
    };

    addCategory(category);
    setFormData({
      name: '',
      eventType: 'Kata',
      ageMin: 8,
      ageMax: 10,
      gender: 'Mixed',
      beltLevel: '',
    });
    setShowCreateCategory(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            to="/"
            className="text-sm text-primary-600 hover:text-primary-700 mb-2 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {tournament.name}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {tournament.level} • {tournament.events}
            {tournament.teamChampionshipEnabled && ' • Team Championship Enabled'}
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowCreateCategory(!showCreateCategory)}
            className="btn btn-primary w-full sm:w-auto"
          >
            {showCreateCategory ? 'Cancel' : '+ Create Category'}
          </button>
        )}
      </div>

      {/* Create Category Form - PRD Section 4.2 */}
      {showCreateCategory && canManage && (
        <div className="card">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Create Category
          </h2>
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input"
                placeholder="e.g., Male 8-10 Kata"
                required
              />
            </div>

            <div className="grid-responsive">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type *
                </label>
                <select
                  value={formData.eventType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eventType: e.target.value as 'Kata' | 'Kumite',
                    })
                  }
                  className="input"
                >
                  <option value="Kata">Kata</option>
                  <option value="Kumite">Kumite</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender: e.target.value as 'Male' | 'Female' | 'Mixed',
                    })
                  }
                  className="input"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Belt Level
                </label>
                <input
                  type="text"
                  value={formData.beltLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, beltLevel: e.target.value })
                  }
                  className="input"
                  placeholder="e.g., White-Yellow"
                />
              </div>
            </div>

            <div className="grid-responsive">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Min *
                </label>
                <input
                  type="number"
                  value={formData.ageMin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ageMin: parseInt(e.target.value) || 0,
                    })
                  }
                  className="input"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Max *
                </label>
                <input
                  type="number"
                  value={formData.ageMax}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ageMax: parseInt(e.target.value) || 0,
                    })
                  }
                  className="input"
                  min="0"
                  required
                />
              </div>
            </div>

            {formData.eventType === 'Kumite' && (
              <div className="grid-responsive">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight Min (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weightMin || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weightMin: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    className="input"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight Max (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weightMax || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weightMax: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    className="input"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full sm:w-auto">
              Create Category
            </button>
          </form>
        </div>
      )}

      {/* Team Leaderboard - PRD Section 8.4 */}
      {tournament.teamChampionshipEnabled && (
        <div>
          <TeamLeaderboard tournamentId={tournament.id} />
        </div>
      )}

      {/* Categories List */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Categories ({tournamentCategories.length})
        </h2>
        {tournamentCategories.length === 0 ? (
          <div className="card text-center py-8 sm:py-12">
            <p className="text-gray-500 text-sm sm:text-base">
              No categories yet. {canManage && 'Create a category above.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournamentCategories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 flex-1">
                    {category.name}
                  </h3>
                  {category.isLocked && (
                    <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                      Locked
                    </span>
                  )}
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Event:</span> {category.eventType}
                  </p>
                  <p>
                    <span className="font-medium">Age:</span> {category.ageRange.min}-
                    {category.ageRange.max}
                  </p>
                  <p>
                    <span className="font-medium">Gender:</span> {category.gender}
                  </p>
                  {category.beltLevel && (
                    <p>
                      <span className="font-medium">Belt:</span> {category.beltLevel}
                    </p>
                  )}
                  {category.weightRange && (
                    <p>
                      <span className="font-medium">Weight:</span>{' '}
                      {category.weightRange.min}-{category.weightRange.max} kg
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {category.participantIds.length} participant(s)
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

