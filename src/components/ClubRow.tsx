import { Link } from 'react-router-dom';
import { Club } from '../lib/types';
import { average, tendency } from '../lib/suggest';

type Props = { club: Club };

export function ClubRow({ club }: Props) {
  const avg = average(club.shots);
  const tend = tendency(club.shots);
  const tendencyLabel = tend === 'L' ? '← tends left' : tend === 'R' ? 'tends right →' : null;

  return (
    <Link
      to={`/range/${club.id}`}
      className="card p-4 flex items-center gap-4 active:scale-[0.99] transition"
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-fairway-900 text-lg truncate">{club.name}</h3>
        <div className="text-sm text-fairway-700/70 flex gap-2 items-center mt-0.5">
          <span>{club.shots.length} shots</span>
          {tendencyLabel && (
            <span className="pill bg-sand-100 text-sand-400">{tendencyLabel}</span>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono text-2xl font-bold text-fairway-700 tabular-nums">
          {avg > 0 ? Math.round(avg) : '—'}
        </div>
        <div className="text-xs text-fairway-700/60 uppercase tracking-wider font-semibold">
          avg yd
        </div>
      </div>
      <svg className="w-5 h-5 text-fairway-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </Link>
  );
}
