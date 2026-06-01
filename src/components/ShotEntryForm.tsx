import { useState } from 'react';
import { Direction } from '../lib/types';

type Props = {
  onSubmit: (yardage: number, direction: Direction) => void | Promise<void>;
};

export function ShotEntryForm({ onSubmit }: Props) {
  const [yardage, setYardage] = useState('');
  const [direction, setDirection] = useState<Direction>('C');
  const [saving, setSaving] = useState(false);

  const numeric = Number(yardage);
  const valid = Number.isFinite(numeric) && numeric > 0 && numeric < 500;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || saving) return;
    setSaving(true);
    try {
      await onSubmit(Math.round(numeric), direction);
      setYardage('');
      setDirection('C');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-widest text-fairway-600 font-bold">
          Yardage
        </span>
        <input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="0"
          value={yardage}
          onChange={(e) => setYardage(e.target.value)}
          className="text-4xl font-mono font-bold text-fairway-900 bg-fairway-50 rounded-2xl px-4 py-3 text-center tabular-nums focus:outline-none focus:ring-2 focus:ring-fairway-500"
        />
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-widest text-fairway-600 font-bold">
          Direction
        </span>
        <div className="grid grid-cols-3 gap-2">
          {(['L', 'C', 'R'] as Direction[]).map((d) => (
            <button
              type="button"
              key={d}
              onClick={() => setDirection(d)}
              className={`btn !min-h-[56px] text-lg font-bold border ${
                direction === d
                  ? 'bg-fairway-500 text-white border-fairway-500'
                  : 'bg-white text-fairway-800 border-fairway-100'
              }`}
            >
              {d === 'L' ? '← Left' : d === 'R' ? 'Right →' : 'Straight'}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!valid || saving}
        className="btn-primary w-full !min-h-[56px] text-lg disabled:opacity-50 disabled:active:scale-100"
      >
        {saving ? 'Saving…' : 'Add shot'}
      </button>
    </form>
  );
}
