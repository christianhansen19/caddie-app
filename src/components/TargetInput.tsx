type Props = {
  value: number;
  onChange: (value: number) => void;
};

export function TargetInput({ value, onChange }: Props) {
  const clamp = (n: number) => Math.max(0, Math.min(400, n));

  return (
    <div className="card p-6 flex flex-col items-center gap-4">
      <div className="text-xs uppercase tracking-widest text-fairway-600 font-bold">Target</div>
      <div className="flex items-center justify-center gap-4 w-full">
        <button
          aria-label="Decrease 5 yards"
          onClick={() => onChange(clamp(value - 5))}
          className="btn-secondary !rounded-full w-14 h-14 text-3xl !p-0"
        >
          −
        </button>
        <div className="flex flex-1 items-baseline justify-center gap-1">
          <span className="font-mono font-bold text-fairway-800 text-7xl tabular-nums leading-none">
            {value}
          </span>
          <span className="text-fairway-600 font-semibold pb-2">yd</span>
        </div>
        <button
          aria-label="Increase 5 yards"
          onClick={() => onChange(clamp(value + 5))}
          className="btn-secondary !rounded-full w-14 h-14 text-3xl !p-0"
        >
          +
        </button>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <button onClick={() => onChange(clamp(value - 1))} className="btn-ghost !min-h-0 px-3 py-1">
          −1
        </button>
        <button onClick={() => onChange(clamp(value - 10))} className="btn-ghost !min-h-0 px-3 py-1">
          −10
        </button>
        <button onClick={() => onChange(clamp(value + 10))} className="btn-ghost !min-h-0 px-3 py-1">
          +10
        </button>
        <button onClick={() => onChange(clamp(value + 1))} className="btn-ghost !min-h-0 px-3 py-1">
          +1
        </button>
      </div>
    </div>
  );
}
