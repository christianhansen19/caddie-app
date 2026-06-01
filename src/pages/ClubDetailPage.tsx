import { Link, useNavigate, useParams } from 'react-router-dom';
import { ShotEntryForm } from '../components/ShotEntryForm';
import { Club } from '../lib/types';
import { average, tendency } from '../lib/suggest';
import { addShot, deleteClub, renameClub, setShots } from '../lib/clubs';
import { useState } from 'react';

type Props = {
  uid: string;
  clubs: Club[];
};

export function ClubDetailPage({ uid, clubs }: Props) {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const club = clubs.find((c) => c.id === clubId);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(club?.name ?? '');

  if (!club) {
    return (
      <div className="px-4 pt-6 pb-8 max-w-md mx-auto">
        <Link to="/range" className="btn-ghost">
          ← Back
        </Link>
        <div className="card p-6 mt-4 text-center text-fairway-800">Club not found.</div>
      </div>
    );
  }

  const avg = average(club.shots);
  const tend = tendency(club.shots);
  const recentShots = [...club.shots].sort((a, b) => b.recordedAt - a.recordedAt);

  async function handleDeleteShot(index: number) {
    if (!club) return;
    const sorted = [...club.shots].sort((a, b) => b.recordedAt - a.recordedAt);
    const toRemove = sorted[index];
    const next = club.shots.filter((s) => s !== toRemove);
    await setShots(uid, club.id, next);
  }

  async function handleRename() {
    if (!club) return;
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== club.name) {
      await renameClub(uid, club.id, trimmed);
    }
    setEditingName(false);
  }

  async function handleDeleteClub() {
    if (!club) return;
    if (!confirm(`Delete "${club.name}" and all its shots?`)) return;
    await deleteClub(uid, club.id);
    navigate('/range');
  }

  return (
    <div className="px-4 pt-6 pb-8 max-w-md mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Link to="/range" className="btn-ghost !px-2">
          ← Back
        </Link>
        <button onClick={handleDeleteClub} className="btn-ghost !text-red-700 !px-2 text-sm">
          Delete club
        </button>
      </div>

      <div className="card p-5 flex flex-col gap-3">
        {editingName ? (
          <div className="flex gap-2">
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              className="flex-1 bg-fairway-50 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fairway-500"
            />
            <button onClick={handleRename} className="btn-primary !px-4">
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setNameDraft(club.name);
              setEditingName(true);
            }}
            className="text-left"
          >
            <h1 className="text-3xl font-bold text-fairway-900">{club.name}</h1>
            <span className="text-xs text-fairway-700/50">tap to rename</span>
          </button>
        )}
        <div className="grid grid-cols-3 gap-3 mt-1">
          <Stat label="Avg" value={avg > 0 ? `${Math.round(avg)}y` : '—'} />
          <Stat label="Shots" value={String(club.shots.length)} />
          <Stat
            label="Tendency"
            value={tend === 'L' ? '← L' : tend === 'R' ? 'R →' : tend === null ? 'Straight' : '—'}
          />
        </div>
      </div>

      <ShotEntryForm onSubmit={(yardage, direction) => addShot(uid, club.id, yardage, direction)} />

      <section className="flex flex-col gap-2">
        <h2 className="text-xs uppercase tracking-widest text-fairway-600 font-bold px-1">
          Recent shots
        </h2>
        {recentShots.length === 0 ? (
          <div className="card p-5 text-center text-fairway-800/70 text-sm">
            No shots yet — hit 10 balls at the simulator and log them above.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {recentShots.map((s, i) => (
              <li
                key={`${s.recordedAt}-${i}`}
                className="card p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xl font-bold text-fairway-800 tabular-nums">
                    {s.yardage}y
                  </span>
                  <span
                    className={`pill ${
                      s.direction === 'C'
                        ? 'bg-fairway-100 text-fairway-700'
                        : 'bg-sand-100 text-sand-400'
                    }`}
                  >
                    {s.direction === 'L' ? '← Left' : s.direction === 'R' ? 'Right →' : 'Straight'}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteShot(i)}
                  className="btn-ghost !text-red-700 !px-2 text-sm"
                  aria-label="Delete shot"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-fairway-50 rounded-2xl py-3 text-center">
      <div className="font-mono text-xl font-bold text-fairway-800 tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-fairway-700/60 font-semibold">
        {label}
      </div>
    </div>
  );
}
