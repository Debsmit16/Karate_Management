import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import {
  calculateKataScore,
  calculateKumitePoints,
  checkKumiteWinCondition,
} from '../utils/scoring';
import type {
  Match,
  KataScore,
  KumiteMatch,
  KumitePoint,
  OfficialResult,
} from '../types';

export default function MatchScoring() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const matches = useStore((state) => state.matches);
  const athletes = useStore((state) => state.athletes);
  const categories = useStore((state) => state.categories);
  const kataScores = useStore((state) => state.kataScores);
  const kumiteMatches = useStore((state) => state.kumiteMatches);
  const tournamentRules = useStore((state) => state.tournamentRules);
  const officialResults = useStore((state) => state.officialResults);
  const addKataScore = useStore((state) => state.addKataScore);
  const addKumiteMatch = useStore((state) => state.addKumiteMatch);
  const updateMatch = useStore((state) => state.updateMatch);
  const updateKataScore = useStore((state) => state.updateKataScore);
  const updateKumiteMatch = useStore((state) => state.updateKumiteMatch);
  const addOfficialResult = useStore((state) => state.addOfficialResult);
  const currentUser = useStore((state) => state.currentUser);

  const match = matches.find((m) => m.id === id);
  const category = match
    ? categories.find((c) => c.id === match.categoryId)
    : null;

  // PRD Section 3.2: Only referees can score
  const canScore = currentUser?.role === 'referee' || currentUser?.role === 'admin';

  // Kata scoring state
  const [kataJudgeScores, setKataJudgeScores] = useState<number[]>([]);
  const [kataFinalScore, setKataFinalScore] = useState<number>(0);

  // Kumite scoring state
  const [kumiteAthlete1Points, setKumiteAthlete1Points] = useState<KumitePoint[]>(
    []
  );
  const [kumiteAthlete2Points, setKumiteAthlete2Points] = useState<KumitePoint[]>(
    []
  );
  const [kumiteTimer, setKumiteTimer] = useState(0);
  const [kumiteTimerRunning, setKumiteTimerRunning] = useState(false);

  useEffect(() => {
    if (!match || !category) return;

    // Load existing kata score
    if (category.eventType === 'Kata' && match.kataScoreId) {
      const existingScore = kataScores.find((s) => s.id === match.kataScoreId);
      if (existingScore) {
        const scores = existingScore.judgeScores.map((js) => js.score);
        setKataJudgeScores(scores);
        setKataFinalScore(existingScore.finalScore);
      }
    }

    // Load existing kumite match
    if (category.eventType === 'Kumite' && match.kumiteMatchId) {
      const existingKumite = kumiteMatches.find(
        (km) => km.id === match.kumiteMatchId
      );
      if (existingKumite) {
        setKumiteAthlete1Points(existingKumite.athlete1Points);
        setKumiteAthlete2Points(existingKumite.athlete2Points);
        setKumiteTimer(existingKumite.elapsedTime);
      }
    }
  }, [match, category, kataScores, kumiteMatches]);

  // Timer effect for Kumite
  useEffect(() => {
    if (!kumiteTimerRunning) return;

    const interval = setInterval(() => {
      setKumiteTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [kumiteTimerRunning]);

  if (!match || !category) {
    return (
      <div className="card text-center py-8 sm:py-12">
        <p className="text-gray-500">Match not found</p>
        <Link to="/" className="btn btn-primary mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const athlete1 = athletes.find((a) => a.id === match.athleteIds[0]);
  const athlete2 = athletes.find((a) => a.id === match.athleteIds[1]);
  const rules = tournamentRules.find((r) => r.tournamentId === category.tournamentId);

  // PRD Section 5.1: Kata Scoring
  const handleKataScoreChange = (judgeIndex: number, score: number) => {
    if (!rules) return;
    const judgeCount = rules.kataJudgesCount;
    const newScores = [...kataJudgeScores];
    newScores[judgeIndex] = score;
    while (newScores.length < judgeCount) {
      newScores.push(0);
    }
    setKataJudgeScores(newScores.slice(0, judgeCount));

    // Auto-calculate final score
    const validScores = newScores.filter((s) => s > 0);
    if (validScores.length === judgeCount) {
      const final = calculateKataScore(validScores);
      setKataFinalScore(final);
    }
  };

  const handleKataSubmit = () => {
    if (!match || !rules) return;
    if (kataJudgeScores.filter((s) => s > 0).length !== rules.kataJudgesCount) {
      alert('Please enter all judge scores');
      return;
    }

    const judgeScores = kataJudgeScores.map((score, idx) => ({
      judgeId: `judge-${idx}`,
      score,
    }));

    const kataScore: KataScore = {
      id: `kata-${Date.now()}`,
      matchId: match.id,
      athleteId: match.athleteIds[0], // For kata, single athlete
      judgeScores,
      finalScore: kataFinalScore,
      status: 'official',
    };

    addKataScore(kataScore);
    updateMatch(match.id, {
      kataScoreId: kataScore.id,
      status: 'completed',
      winnerId: match.athleteIds[0], // For now, single athlete kata
      resultStatus: 'official',
    });

    // Create official result - PRD Section 7.1
    const result: OfficialResult = {
      id: `result-${Date.now()}`,
      categoryId: category.id,
      athleteId: match.athleteIds[0],
      position: 1,
      medal: 'Gold',
      points: 3,
      status: 'official',
    };
    addOfficialResult(result);

    navigate(`/category/${category.id}`);
  };

  // PRD Section 6.1: Kumite Scoring
  const handleKumitePoint = (athlete: 1 | 2, point: KumitePoint) => {
    if (athlete === 1) {
      setKumiteAthlete1Points([...kumiteAthlete1Points, point]);
    } else {
      setKumiteAthlete2Points([...kumiteAthlete2Points, point]);
    }
  };

  const handleKumiteEnd = () => {
    if (!match || !rules) return;

    const winCondition = checkKumiteWinCondition(
      kumiteAthlete1Points,
      kumiteAthlete2Points,
      kumiteTimer,
      rules.kumiteMatchDuration[category.ageRange.min.toString()] || 120,
      rules.senshuEnabled
    );

    const kumiteMatch: KumiteMatch = {
      id: `kumite-${Date.now()}`,
      categoryId: category.id,
      athlete1Id: match.athleteIds[0],
      athlete2Id: match.athleteIds[1],
      athlete1Points: kumiteAthlete1Points,
      athlete2Points: kumiteAthlete2Points,
      athlete1Penalties: 0,
      athlete2Penalties: 0,
      matchDuration: rules.kumiteMatchDuration[category.ageRange.min.toString()] || 120,
      elapsedTime: kumiteTimer,
      winnerId: winCondition.winner
        ? winCondition.winner === 'athlete1'
          ? match.athleteIds[0]
          : match.athleteIds[1]
        : undefined,
      status: winCondition.winner ? 'completed' : 'in_progress',
      resultStatus: winCondition.winner ? 'official' : 'pending',
    };

    addKumiteMatch(kumiteMatch);
    updateMatch(match.id, {
      kumiteMatchId: kumiteMatch.id,
      status: kumiteMatch.status,
      winnerId: kumiteMatch.winnerId,
      resultStatus: kumiteMatch.resultStatus,
    });

    if (kumiteMatch.winnerId) {
      // Create official result
      const result: OfficialResult = {
        id: `result-${Date.now()}`,
        categoryId: category.id,
        athleteId: kumiteMatch.winnerId,
        position: 1,
        medal: 'Gold',
        points: 3,
        status: 'official',
      };
      addOfficialResult(result);
    }

    navigate(`/category/${category.id}`);
  };

  const points1 = calculateKumitePoints(kumiteAthlete1Points);
  const points2 = calculateKumitePoints(kumiteAthlete2Points);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <Link
          to={`/category/${category.id}`}
          className="text-sm text-primary-600 hover:text-primary-700 mb-2 inline-block"
        >
          ← Back to Category
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Match Scoring
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          {category.name} • {category.eventType}
        </p>
      </div>

      {/* Athletes Info */}
      <div className="card">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-2">
              {athlete1?.name || 'Athlete 1'}
            </h3>
            <p className="text-sm text-gray-600">{athlete1?.beltLevel}</p>
          </div>
          {category.eventType === 'Kumite' && athlete2 && (
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-2">
                {athlete2.name}
              </h3>
              <p className="text-sm text-gray-600">{athlete2.beltLevel}</p>
            </div>
          )}
        </div>
      </div>

      {/* Kata Scoring - PRD Section 5 */}
      {category.eventType === 'Kata' && canScore && (
        <div className="card">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Kata Scoring (PRD Section 5.1)
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Judges: {rules?.kataJudgesCount || 5} • System removes highest and lowest,
            sums remaining
          </p>

          <div className="space-y-4">
            {Array.from({ length: rules?.kataJudgesCount || 5 }).map((_, idx) => (
              <div key={idx}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judge {idx + 1} Score
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={kataJudgeScores[idx] || ''}
                  onChange={(e) =>
                    handleKataScoreChange(idx, parseFloat(e.target.value) || 0)
                  }
                  className="input"
                  placeholder="0.0 - 10.0"
                />
              </div>
            ))}

            {kataFinalScore > 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900">
                  Final Score (Auto-calculated):{' '}
                  <span className="text-lg font-bold">{kataFinalScore.toFixed(1)}</span>
                </p>
              </div>
            )}

            <button
              onClick={handleKataSubmit}
              disabled={kataFinalScore === 0}
              className="btn btn-primary w-full sm:w-auto"
            >
              Submit Kata Score
            </button>
          </div>
        </div>
      )}

      {/* Kumite Scoring - PRD Section 6 */}
      {category.eventType === 'Kumite' && canScore && (
        <div className="space-y-4 sm:space-y-6">
          {/* Timer */}
          <div className="card">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">
                {Math.floor(kumiteTimer / 60)}:
                {(kumiteTimer % 60).toString().padStart(2, '0')}
              </div>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setKumiteTimerRunning(!kumiteTimerRunning)}
                  className="btn btn-secondary text-sm"
                >
                  {kumiteTimerRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={() => setKumiteTimer(0)}
                  className="btn btn-secondary text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Athlete 1 Points */}
          <div className="card">
            <h3 className="font-semibold text-base sm:text-lg mb-4">
              {athlete1?.name || 'Athlete 1'}
            </h3>
            <div className="mb-4">
              <div className="text-2xl sm:text-3xl font-bold text-primary-600">
                {points1} Points
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {kumiteAthlete1Points.join(', ') || 'No points'}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                onClick={() => handleKumitePoint(1, 'Yuko')}
                className="btn btn-secondary text-xs sm:text-sm"
              >
                Yuko (1)
              </button>
              <button
                onClick={() => handleKumitePoint(1, 'Waza-ari')}
                className="btn btn-secondary text-xs sm:text-sm"
              >
                Waza-ari (2)
              </button>
              <button
                onClick={() => handleKumitePoint(1, 'Ippon')}
                className="btn btn-secondary text-xs sm:text-sm"
              >
                Ippon (3)
              </button>
            </div>
          </div>

          {/* Athlete 2 Points */}
          {athlete2 && (
            <div className="card">
              <h3 className="font-semibold text-base sm:text-lg mb-4">
                {athlete2.name}
              </h3>
              <div className="mb-4">
                <div className="text-2xl sm:text-3xl font-bold text-primary-600">
                  {points2} Points
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {kumiteAthlete2Points.join(', ') || 'No points'}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  onClick={() => handleKumitePoint(2, 'Yuko')}
                  className="btn btn-secondary text-xs sm:text-sm"
                >
                  Yuko (1)
                </button>
                <button
                  onClick={() => handleKumitePoint(2, 'Waza-ari')}
                  className="btn btn-secondary text-xs sm:text-sm"
                >
                  Waza-ari (2)
                </button>
                <button
                  onClick={() => handleKumitePoint(2, 'Ippon')}
                  className="btn btn-secondary text-xs sm:text-sm"
                >
                  Ippon (3)
                </button>
              </div>
            </div>
          )}

          {/* End Match */}
          <div className="card">
            <button
              onClick={handleKumiteEnd}
              className="btn btn-primary w-full"
            >
              End Match & Calculate Winner
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              PRD Section 6.2: Auto win conditions (8-point lead, time up, etc.)
            </p>
          </div>
        </div>
      )}

      {/* Read-only view for coaches */}
      {!canScore && (
        <div className="card text-center py-8 sm:py-12">
          <p className="text-gray-500 text-sm sm:text-base">
            PRD Section 3.3: Coaches can only view results, not edit scores.
          </p>
        </div>
      )}
    </div>
  );
}

