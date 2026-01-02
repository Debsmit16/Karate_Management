import type { KataScore, KumiteMatch, KumitePoint } from '../types';

// PRD Section 6.1: Point Values
const POINT_VALUES: Record<KumitePoint, number> = {
  'Yuko': 1,
  'Waza-ari': 2,
  'Ippon': 3,
};

// PRD Section 5.1: Kata Scoring Calculation
export function calculateKataScore(judgeScores: number[]): number {
  if (judgeScores.length < 3) return 0;
  
  // Remove highest and lowest scores
  const sorted = [...judgeScores].sort((a, b) => a - b);
  const trimmed = sorted.slice(1, -1);
  
  // Sum remaining scores
  return trimmed.reduce((sum, score) => sum + score, 0);
}

// PRD Section 6.1: Kumite Point Calculation
export function calculateKumitePoints(points: KumitePoint[]): number {
  return points.reduce((total, point) => {
    const value = POINT_VALUES[point];
    return total + value;
  }, 0);
}

// PRD Section 6.2: Kumite Win Conditions
export function checkKumiteWinCondition(
  athlete1Points: KumitePoint[],
  athlete2Points: KumitePoint[],
  elapsedTime: number,
  matchDuration: number,
  senshuEnabled: boolean
): { winner: 'athlete1' | 'athlete2' | null; reason: string } {
  const points1 = calculateKumitePoints(athlete1Points);
  const points2 = calculateKumitePoints(athlete2Points);
  
  // 8-point lead
  if (points1 >= points2 + 8) {
    return { winner: 'athlete1', reason: '8-point lead' };
  }
  if (points2 >= points1 + 8) {
    return { winner: 'athlete2', reason: '8-point lead' };
  }
  
  // Time up - higher score wins
  if (elapsedTime >= matchDuration) {
    if (points1 > points2) {
      return { winner: 'athlete1', reason: 'Time up - higher score' };
    }
    if (points2 > points1) {
      return { winner: 'athlete2', reason: 'Time up - higher score' };
    }
    
    // Tie - Senshu rule if enabled
    if (senshuEnabled) {
      if (athlete1Points.length > 0 && athlete2Points.length === 0) {
        return { winner: 'athlete1', reason: 'Senshu (first score advantage)' };
      }
      if (athlete2Points.length > 0 && athlete1Points.length === 0) {
        return { winner: 'athlete2', reason: 'Senshu (first score advantage)' };
      }
    }
    
    return { winner: null, reason: 'Tie - requires decision' };
  }
  
  return { winner: null, reason: 'Match in progress' };
}

// PRD Section 8.2: Team Point Calculation
export function calculateTeamPoints(
  gold: number,
  silver: number,
  bronze: number,
  pointRules: { gold: number; silver: number; bronze: number }
): number {
  return gold * pointRules.gold + silver * pointRules.silver + bronze * pointRules.bronze;
}

