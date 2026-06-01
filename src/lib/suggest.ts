import { Club, Direction, Multipliers, Shot, Suggestion } from './types';

export function average(shots: Shot[]): number {
  if (shots.length === 0) return 0;
  const sum = shots.reduce((acc, s) => acc + s.yardage, 0);
  return sum / shots.length;
}

export function tendency(shots: Shot[]): Direction | null {
  if (shots.length < 3) return null;
  const counts: Record<Direction, number> = { L: 0, C: 0, R: 0 };
  for (const s of shots) counts[s.direction]++;
  const total = shots.length;
  if (counts.L / total > 0.6) return 'L';
  if (counts.R / total > 0.6) return 'R';
  return null;
}

export function suggest(
  target: number,
  clubs: Club[],
  multipliers: Multipliers,
  topN = 3,
): Suggestion[] {
  if (!target || target <= 0) return [];

  const candidates: Suggestion[] = [];
  for (const club of clubs) {
    if (club.shots.length === 0) continue;
    const avg = average(club.shots);
    const tend = tendency(club.shots);
    for (const [effort, multiplier] of Object.entries(multipliers)) {
      const projected = avg * multiplier;
      candidates.push({
        club,
        effort,
        multiplier,
        projected,
        delta: projected - target,
        tendency: tend,
      });
    }
  }

  candidates.sort((a, b) => Math.abs(a.delta) - Math.abs(b.delta));
  return candidates.slice(0, topN);
}

export function formatDelta(delta: number): { label: string; tone: 'good' | 'ok' | 'far' } {
  const rounded = Math.round(delta);
  const abs = Math.abs(rounded);
  const tone: 'good' | 'ok' | 'far' = abs <= 3 ? 'good' : abs <= 8 ? 'ok' : 'far';
  if (rounded === 0) return { label: 'dialed', tone };
  if (rounded > 0) return { label: `+${rounded} long`, tone };
  return { label: `${rounded} short`, tone };
}
