type Props = {
  presets: number[];
  active: number;
  onPick: (yardage: number) => void;
};

export function PresetChips({ presets, active, onPick }: Props) {
  return (
    <div className="-mx-4 px-4 overflow-x-auto scrollbar-none">
      <div className="flex gap-2 pb-1 w-max">
        {presets.map((y) => {
          const isActive = y === active;
          return (
            <button
              key={y}
              onClick={() => onPick(y)}
              className={`chip min-w-[64px] ${
                isActive ? 'bg-fairway-500 !text-white border-fairway-500' : ''
              }`}
            >
              {y}
            </button>
          );
        })}
      </div>
    </div>
  );
}
