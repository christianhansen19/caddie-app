import { useMemo, useState } from 'react';
import { TargetInput } from '../components/TargetInput';
import { PresetChips } from '../components/PresetChips';
import { SuggestionCard } from '../components/SuggestionCard';
import { suggest } from '../lib/suggest';
import { Club, Settings } from '../lib/types';

type Props = {
  clubs: Club[];
  settings: Settings;
};

export function CaddiePage({ clubs, settings }: Props) {
  const [target, setTarget] = useState(150);

  const suggestions = useMemo(
    () => suggest(target, clubs, settings.multipliers, 3),
    [target, clubs, settings.multipliers],
  );

  const hasData = clubs.some((c) => c.shots.length > 0);

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-32 max-w-md mx-auto">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-fairway-900">Caddie</h1>
        <span className="text-xs text-fairway-700/60 uppercase tracking-wider font-semibold">
          ⛳ pick a club
        </span>
      </header>

      <TargetInput value={target} onChange={setTarget} />

      <PresetChips presets={settings.presets} active={target} onPick={setTarget} />

      <section className="flex flex-col gap-3">
        <h2 className="text-xs uppercase tracking-widest text-fairway-600 font-bold px-1">
          Suggestions
        </h2>

        {!hasData && (
          <div className="card p-6 text-center">
            <p className="text-fairway-800 font-semibold">No shots recorded yet</p>
            <p className="text-sm text-fairway-700/70 mt-1">
              Go to <strong>Range</strong> and add shots for each club. Suggestions appear once
              there's at least one recorded shot.
            </p>
          </div>
        )}

        {hasData && suggestions.length === 0 && (
          <div className="card p-6 text-center text-fairway-800/80">
            No close matches for that distance.
          </div>
        )}

        {suggestions.map((s, i) => (
          <SuggestionCard key={`${s.club.id}-${s.effort}`} suggestion={s} rank={i} />
        ))}
      </section>
    </div>
  );
}
