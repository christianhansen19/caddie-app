# Caddie

Personal golf club suggestion PWA. Type in a target yardage; get the three closest club + swing-effort combos based on your own simulator data. Mobile-first, installable to home screen, works offline.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in the Firebase values (see below)
npm run dev                  # http://localhost:5173/caddie-app/
```

## Firebase setup (free Spark plan)

1. Go to <https://console.firebase.google.com> and **Add project**. Name it anything (e.g. `caddie`). Disable Google Analytics if you want, it's not needed.
2. In the project: **Build → Authentication → Get started → Sign-in method → Google → Enable**. Set a support email and save.
3. **Build → Firestore Database → Create database**. Choose any region (closest to you). Start in **production** mode.
4. **Firestore → Rules**, replace with:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```
   Publish.
5. **Project settings (⚙) → Your apps → Add app → Web (`</>`)**. Register a nickname, skip Hosting. Copy the `firebaseConfig` values into `.env.local`:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
6. **Authentication → Settings → Authorized domains → Add domain**. Add `localhost` (usually already there) and once you've deployed, also add `<your-github-username>.github.io`.

The client API key is safe to commit (it's public by design); security comes from the Firestore rules above. `.env.local` is gitignored mainly to keep your project tidy.

## How it works

- **Range page**: tap a club, log your simulator shots (yardage + Left/Center/Right). Default bag of 13 clubs available on first launch.
- **Caddie page**: type a target yardage (or tap a preset chip). The app multiplies each club's average yardage by the effort multipliers (full, 90%, 75%, 50% by default) and shows the 3 candidates closest to your target. Tendency badge appears when a club drifts ≥60% one way.
- **Settings**: edit effort multipliers, edit preset distance chips, export your data as JSON.

## Deploy to GitHub Pages

1. Create a public repo named **`caddie-app`** on GitHub (the name must match `base: '/caddie-app/'` in `vite.config.ts` — change both if you want a different name).
2. From this directory:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin git@github.com:<your-username>/caddie-app.git
   git push -u origin main
   ```
3. Deploy:
   ```bash
   npm run deploy
   ```
   This builds and pushes the `dist/` folder to the `gh-pages` branch.
4. On GitHub: **Settings → Pages → Source: Deploy from branch → Branch: `gh-pages` / root**. Save.
5. Wait ~30s, then open `https://<your-username>.github.io/caddie-app/` on your phone.
6. In Safari/Chrome: **Share → Add to Home Screen** to install as a PWA.
7. Don't forget to add your `github.io` domain to Firebase Auth's authorized domains (step 6 above).

## Scripts

| | |
|--|--|
| `npm run dev` | Local dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run deploy` | Build + push to `gh-pages` branch |

## Tech

React 18 · Vite · TypeScript · Tailwind · Firebase Auth + Firestore · vite-plugin-pwa
