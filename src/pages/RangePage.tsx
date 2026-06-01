import { useState } from 'react';
import { ClubRow } from '../components/ClubRow';
import { Club } from '../lib/types';
import { addClub, seedDefaultClubs } from '../lib/clubs';

type Props = {
  uid: string;
  clubs: Club[];
};

export function RangePage({ uid, clubs }: Props) {
  const [newName, setNewName] = useState('');
  const [seeding, setSeeding] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const order = clubs.length;
    await addClub(uid, name, order);
    setNewName('');
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      await seedDefaultClubs(uid);
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-6 pb-8 max-w-md mx-auto">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-fairway-900">Range</h1>
        <span className="text-xs text-fairway-700/60 uppercase tracking-wider font-semibold">
          🏌️ your bag
        </span>
      </header>

      {clubs.length === 0 ? (
        <div className="card p-6 text-center flex flex-col gap-4">
          <p className="text-fairway-800 font-semibold">Your bag is empty</p>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="btn-primary self-center disabled:opacity-50"
          >
            {seeding ? 'Seeding…' : 'Seed standard 13-club set'}
          </button>
          <p className="text-xs text-fairway-700/60">
            Or add clubs one-by-one below
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {clubs.map((club) => (
            <ClubRow key={club.id} club={club} />
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} className="card p-4 flex gap-2 items-center mt-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Add a club (e.g. 4-Hybrid)"
          className="flex-1 bg-fairway-50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-fairway-500"
        />
        <button type="submit" className="btn-primary !px-4" disabled={!newName.trim()}>
          Add
        </button>
      </form>
    </div>
  );
}
