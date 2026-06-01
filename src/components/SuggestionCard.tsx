import { Suggestion } from '../lib/types';
import { formatDelta } from '../lib/suggest';

type Props = {
  suggestion: Suggestion;
  rank: number;
};

export function SuggestionCard({ suggestion, rank }: Props) {
  const { club, effort, projected, tendency } = suggestion;
  const { label, tone } = formatDelta(suggestion.delta);

  const toneClass =
    tone === 'good'
      ? 'bg-fairway-100 text-fairway-800'
      : tone === 'ok'
        ? 'bg-sand-100 text-sand-400'
        : 'bg-red-100 text-red-700';

  const tendencyLabel =
    tendency === 'L' ? 'tends left' : tendency === 'R' ? 'tends right' : null;

  return (
    <div
      className={`card p-5 flex items-center gap-4 ${
        rank === 0 ? 'ring-2 ring-fairway-500' : ''
      }`}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-fairway-50 text-fairway-700 font-bold">
        {rank + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-bold text-xl text-fairway-900 truncate">{club.name}</h3>
          <span className="pill bg-fairway-50 text-fairway-700 border border-fairway-100">
            {effort}
          </span>
          {tendencyLabel && (
            <span className="pill bg-sand-100 text-sand-400">{tendencyLabel}</span>
          )}
        </div>
        <div className="text-sm text-fairway-700/70 mt-0.5">
          plays ~{Math.round(projected)} yd
        </div>
      </div>
      <div className={`pill ${toneClass} text-sm px-3 py-1.5 whitespace-nowrap`}>{label}</div>
    </div>
  );
}
