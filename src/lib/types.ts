export type Direction = 'L' | 'C' | 'R';

export type Shot = {
  yardage: number;
  direction: Direction;
  recordedAt: number;
};

export type Club = {
  id: string;
  name: string;
  order: number;
  shots: Shot[];
};

export type EffortKey = string;

export type Multipliers = Record<EffortKey, number>;

export type Settings = {
  multipliers: Multipliers;
  presets: number[];
};

export type Suggestion = {
  club: Club;
  effort: EffortKey;
  multiplier: number;
  projected: number;
  delta: number;
  tendency: Direction | null;
};

export const DEFAULT_MULTIPLIERS: Multipliers = {
  full: 1.0,
  '90%': 0.9,
  '75%': 0.75,
  '50%': 0.5,
};

export const DEFAULT_PRESETS = [50, 75, 100, 125, 150, 175, 200, 225, 250];

export const DEFAULT_CLUBS: { name: string; order: number }[] = [
  { name: 'Driver', order: 0 },
  { name: '3 Wood', order: 1 },
  { name: '5 Wood', order: 2 },
  { name: '4 Iron', order: 3 },
  { name: '5 Iron', order: 4 },
  { name: '6 Iron', order: 5 },
  { name: '7 Iron', order: 6 },
  { name: '8 Iron', order: 7 },
  { name: '9 Iron', order: 8 },
  { name: 'PW', order: 9 },
  { name: 'GW', order: 10 },
  { name: 'SW', order: 11 },
  { name: 'LW', order: 12 },
];
