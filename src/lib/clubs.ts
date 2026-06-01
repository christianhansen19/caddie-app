import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Club, DEFAULT_CLUBS, Direction, Shot } from './types';

const clubsCol = (uid: string) => collection(db, 'users', uid, 'clubs');
const clubDoc = (uid: string, clubId: string) => doc(db, 'users', uid, 'clubs', clubId);

type RawClub = {
  name: string;
  order: number;
  shots?: { yardage: number; direction: Direction; recordedAt?: Timestamp | number }[];
};

function toClub(id: string, raw: RawClub): Club {
  const shots: Shot[] = (raw.shots ?? []).map((s) => ({
    yardage: s.yardage,
    direction: s.direction,
    recordedAt:
      typeof s.recordedAt === 'number'
        ? s.recordedAt
        : s.recordedAt?.toMillis?.() ?? Date.now(),
  }));
  return {
    id,
    name: raw.name,
    order: raw.order ?? 0,
    shots,
  };
}

export function subscribeClubs(uid: string, cb: (clubs: Club[]) => void): () => void {
  const q = query(clubsCol(uid), orderBy('order', 'asc'));
  return onSnapshot(q, (snap) => {
    const clubs = snap.docs.map((d) => toClub(d.id, d.data() as RawClub));
    cb(clubs);
  });
}

export async function seedDefaultClubs(uid: string) {
  const batch = writeBatch(db);
  for (const c of DEFAULT_CLUBS) {
    const id = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    batch.set(clubDoc(uid, id), { name: c.name, order: c.order, shots: [] });
  }
  await batch.commit();
}

export async function addClub(uid: string, name: string, order: number) {
  const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
  await setDoc(clubDoc(uid, id), { name, order, shots: [] });
}

export async function renameClub(uid: string, clubId: string, name: string) {
  await updateDoc(clubDoc(uid, clubId), { name });
}

export async function deleteClub(uid: string, clubId: string) {
  await deleteDoc(clubDoc(uid, clubId));
}

export async function addShot(uid: string, clubId: string, yardage: number, direction: Direction) {
  await updateDoc(clubDoc(uid, clubId), {
    shots: arrayUnion({ yardage, direction, recordedAt: Date.now() }),
  });
}

export async function setShots(uid: string, clubId: string, shots: Shot[]) {
  await updateDoc(clubDoc(uid, clubId), { shots });
}

export async function touchUser(uid: string, displayName: string | null) {
  await setDoc(
    doc(db, 'users', uid),
    { displayName, lastSeen: serverTimestamp() },
    { merge: true },
  );
}
