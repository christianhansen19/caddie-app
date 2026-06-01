import { signInWithGoogle } from '../lib/auth';
import { firebaseConfigured } from '../lib/firebase';

export function SignInGate() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-12 gap-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-fairway-500 text-white flex items-center justify-center text-4xl font-bold shadow-card">
        ⛳
      </div>
      <div>
        <h1 className="text-3xl font-bold text-fairway-900">Caddie</h1>
        <p className="text-fairway-700/70 mt-1">Your personal club picker</p>
      </div>

      {!firebaseConfigured ? (
        <div className="card p-5 text-left max-w-sm">
          <h2 className="font-bold text-fairway-900">Firebase not configured</h2>
          <p className="text-sm text-fairway-800/80 mt-2">
            Copy <code className="font-mono bg-fairway-50 px-1 rounded">.env.example</code> to{' '}
            <code className="font-mono bg-fairway-50 px-1 rounded">.env.local</code> and fill in
            your Firebase web config. See the README for full setup.
          </p>
        </div>
      ) : (
        <button onClick={() => signInWithGoogle()} className="btn-primary !min-h-[56px] text-lg px-8">
          Sign in with Google
        </button>
      )}
    </div>
  );
}
