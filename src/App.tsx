import { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './lib/auth';
import { firebaseConfigured } from './lib/firebase';
import { subscribeClubs, touchUser } from './lib/clubs';
import { subscribeSettings } from './lib/settings';
import { Club, DEFAULT_MULTIPLIERS, DEFAULT_PRESETS, Settings } from './lib/types';
import { BottomNav } from './components/BottomNav';
import { SignInGate } from './components/SignInGate';
import { CaddiePage } from './pages/CaddiePage';
import { RangePage } from './pages/RangePage';
import { ClubDetailPage } from './pages/ClubDetailPage';
import { SettingsPage } from './pages/SettingsPage';

function AppShell() {
  const { user, loading } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [settings, setSettings] = useState<Settings>({
    multipliers: DEFAULT_MULTIPLIERS,
    presets: DEFAULT_PRESETS,
  });

  useEffect(() => {
    if (!user) return;
    touchUser(user.uid, user.displayName).catch(() => {});
    const unsubClubs = subscribeClubs(user.uid, setClubs);
    const unsubSettings = subscribeSettings(user.uid, setSettings);
    return () => {
      unsubClubs();
      unsubSettings();
    };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center text-fairway-700">
        Loading…
      </div>
    );
  }

  if (!firebaseConfigured || !user) {
    return <SignInGate />;
  }

  return (
    <div className="min-h-full" style={{ paddingTop: 'var(--safe-top)' }}>
      <Routes>
        <Route path="/" element={<CaddiePage clubs={clubs} settings={settings} />} />
        <Route path="/range" element={<RangePage uid={user.uid} clubs={clubs} />} />
        <Route
          path="/range/:clubId"
          element={<ClubDetailPage uid={user.uid} clubs={clubs} />}
        />
        <Route
          path="/settings"
          element={
            <SettingsPage uid={user.uid} user={user} clubs={clubs} settings={settings} />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  );
}
