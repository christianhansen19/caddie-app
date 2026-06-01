import { useState } from 'react';
import { User } from 'firebase/auth';
import { signOut } from '../lib/auth';
import { Club, Settings } from '../lib/types';
import { updateMultipliers, updatePresets } from '../lib/settings';

type Props = {
  uid: string;
  user: User;
  clubs: Club[];
  settings: Settings;
};

export function SettingsPage({ uid, user, clubs, settings }: Props) {
  return (
    <div className="px-4 pt-6 pb-32 max-w-md mx-auto flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold text-fairway-900">Settings</h1>
      </header>

      <section className="card p-5 flex items-center gap-4">
        {user.photoURL && (
          <img src={user.photoURL} alt="" className="w-12 h-12 rounded-full" />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-fairway-900 truncate">
            {user.displayName ?? 'Signed in'}
          </div>
          <div className="text-sm text-fairway-700/70 truncate">{user.email}</div>
        </div>
        <button onClick={signOut} className="btn-ghost text-sm">
          Sign out
        </button>
      </section>

      <MultipliersEditor uid={uid} settings={settings} />
      <PresetsEditor uid={uid} settings={settings} />
      <ExportImport uid={uid} clubs={clubs} />
    </div>
  );
}

function MultipliersEditor({ uid, settings }: { uid: string; settings: Settings }) {
  const [draft, setDraft] = useState(
    Object.entries(settings.multipliers)
      .map(([k, v]) => `${k}=${v}`)
      .join('\n'),
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setError(null);
    const parsed: Record<string, number> = {};
    for (const line of draft.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const [key, val] = trimmed.split('=');
      const num = Number(val);
      if (!key || !Number.isFinite(num) || num <= 0 || num > 2) {
        setError(`Bad line: "${trimmed}". Use format "label=number" (0 < number ≤ 2).`);
        return;
      }
      parsed[key.trim()] = num;
    }
    if (Object.keys(parsed).length === 0) {
      setError('At least one multiplier is required.');
      return;
    }
    setSaving(true);
    try {
      await updateMultipliers(uid, parsed);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card p-5 flex flex-col gap-3">
      <div>
        <h2 className="font-bold text-fairway-900">Effort multipliers</h2>
        <p className="text-sm text-fairway-700/70">
          One per line, format <code className="font-mono">label=number</code>. e.g.{' '}
          <code className="font-mono">75%=0.75</code>
        </p>
      </div>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={5}
        className="font-mono bg-fairway-50 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fairway-500"
      />
      {error && <div className="text-sm text-red-700">{error}</div>}
      <button onClick={save} disabled={saving} className="btn-primary self-end disabled:opacity-50">
        {saving ? 'Saving…' : 'Save'}
      </button>
    </section>
  );
}

function PresetsEditor({ uid, settings }: { uid: string; settings: Settings }) {
  const [draft, setDraft] = useState(settings.presets.join(', '));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setError(null);
    const numbers = draft
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number);
    if (numbers.some((n) => !Number.isFinite(n) || n <= 0 || n > 500)) {
      setError('Each preset must be a positive number under 500.');
      return;
    }
    setSaving(true);
    try {
      await updatePresets(uid, numbers);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card p-5 flex flex-col gap-3">
      <div>
        <h2 className="font-bold text-fairway-900">Preset distances</h2>
        <p className="text-sm text-fairway-700/70">
          Comma or space separated. Shown as quick-tap chips on the Caddie screen.
        </p>
      </div>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="font-mono bg-fairway-50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-fairway-500"
      />
      {error && <div className="text-sm text-red-700">{error}</div>}
      <button onClick={save} disabled={saving} className="btn-primary self-end disabled:opacity-50">
        {saving ? 'Saving…' : 'Save'}
      </button>
    </section>
  );
}

function ExportImport({ uid, clubs }: { uid: string; clubs: Club[] }) {
  function handleExport() {
    const payload = {
      exportedAt: new Date().toISOString(),
      clubs: clubs.map((c) => ({
        id: c.id,
        name: c.name,
        order: c.order,
        shots: c.shots,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caddie-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="card p-5 flex flex-col gap-2">
      <h2 className="font-bold text-fairway-900">Backup</h2>
      <p className="text-sm text-fairway-700/70">
        Your data is already synced to Firebase under your account ({uid.slice(0, 6)}…). Use this
        to grab a local JSON copy.
      </p>
      <button onClick={handleExport} className="btn-secondary self-end">
        Export JSON
      </button>
    </section>
  );
}
