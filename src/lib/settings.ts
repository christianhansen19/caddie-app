import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { DEFAULT_MULTIPLIERS, DEFAULT_PRESETS, Multipliers, Settings } from './types';

const settingsDoc = (uid: string) => doc(db, 'users', uid, 'meta', 'settings');

export function subscribeSettings(uid: string, cb: (settings: Settings) => void): () => void {
  return onSnapshot(settingsDoc(uid), (snap) => {
    const data = snap.data() as Partial<Settings> | undefined;
    cb({
      multipliers: data?.multipliers ?? DEFAULT_MULTIPLIERS,
      presets: data?.presets ?? DEFAULT_PRESETS,
    });
  });
}

export async function updateMultipliers(uid: string, multipliers: Multipliers) {
  await setDoc(settingsDoc(uid), { multipliers }, { merge: true });
}

export async function updatePresets(uid: string, presets: number[]) {
  await setDoc(settingsDoc(uid), { presets }, { merge: true });
}
