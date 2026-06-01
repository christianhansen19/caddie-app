import { useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export type AuthState = {
  user: User | null;
  loading: boolean;
};

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setState({ user, loading: false });
    });
    return unsub;
  }, []);

  return state;
}

export async function signInWithGoogle() {
  await signInWithPopup(auth, googleProvider);
}

export async function signOut() {
  await fbSignOut(auth);
}
