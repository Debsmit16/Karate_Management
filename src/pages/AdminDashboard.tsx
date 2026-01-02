import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { Tournament, TournamentLevel, EventType } from '../types';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const tournaments = useStore((state) => state.tournaments);
  const addTournament = useStore((state) => state.addTournament);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    level: TournamentLevel;
    events: EventType;
    teamChampionshipEnabled: boolean;
  }>({
    name: '',
    level: 'Local',
    events: 'Both',
    teamChampionshipEnabled: true,
  });

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const tournament: Tournament = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'draft',
    };

    addTournament(tournament);
    setFormData({
      name: '',
      level: 'Local',
      events: 'Both',
      teamChampionshipEnabled: true,
    });
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Mobile: stacked, Desktop: side-by-side */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Tournament Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            PRD Section 3.1: Admin / Tournament Committee
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn btn-primary w-full sm:w-auto"
        >
          {showCreateForm ? 'Cancel' : '+ Create Tournament'}
        </button>
      </div>

      {/* Create Tournament Form - PRD Section 4.1 */}
      {showCreateForm && (
        <div className="card">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Create New Tournament
          </h2>
          <form onSubmit={handleCreateTournament} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tournament Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input"
                placeholder="e.g., Regional Karate Championship 2024"
                required
              />
            </div>

            <div className="grid-responsive">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      level: e.target.value as TournamentLevel,
                    })
                  }
                  className="input"
                >
                  <option value="Local">Local</option>
                  <option value="District">District</option>
                  <option value="Open">Open</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Events *
                </label>
                <select
                  value={formData.events}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      events: e.target.value as EventType,
                    })
                  }
                  className="input"
                >
                  <option value="Kata">Kata Only</option>
                  <option value="Kumite">Kumite Only</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="teamChampionship"
                checked={formData.teamChampionshipEnabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    teamChampionshipEnabled: e.target.checked,
                  })
                }
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <label
                htmlFor="teamChampionship"
                className="ml-2 text-sm text-gray-700"
              >
                Enable Team Championship (PRD Section 8.1)
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-full sm:w-auto">
              Create Tournament
            </button>
          </form>
        </div>
      )}

      {/* Tournaments List - Mobile: stacked cards, Desktop: grid */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          All Tournaments
        </h2>
        {tournaments.length === 0 ? (
          <div className="card text-center py-8 sm:py-12">
            <p className="text-gray-500 text-sm sm:text-base">
              No tournaments yet. Create your first tournament above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournaments.map((tournament) => (
              <Link
                key={tournament.id}
                to={`/tournament/${tournament.id}`}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900">
                    {tournament.name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      tournament.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : tournament.status === 'completed'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {tournament.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Level:</span> {tournament.level}
                  </p>
                  <p>
                    <span className="font-medium">Events:</span> {tournament.events}
                  </p>
                  <p>
                    <span className="font-medium">Team Championship:</span>{' '}
                    {tournament.teamChampionshipEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Created:{' '}
                    {format(new Date(tournament.createdAt), 'MMM d, yyyy')}
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

