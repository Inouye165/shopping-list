
# Home Shopping List

Real-time shared shopping list for a household (demo users Ron & Tricia) built with React (Vite) + Firebase Realtime Database.

## Features
- Demo auth (ron / tricia, password: dobby) – replace later with real auth
- Real-time sync (Firebase Realtime Database)
- Add / complete / delete items
- Grouped: incomplete first, collapsible completed section
- Clear completed
- Remaining counter & offline indicator
- Theme cycle: system → light → dark (persisted)
- Session persistence (localStorage)
- Accessible (labels, focus rings, keyboard add on Enter)
- Mobile friendly with sticky add bar

## Quick Start
```bash
npm install
npm run dev
```
Visit: http://localhost:5173

## Build & Preview
```bash
npm run build
npm run preview
```

## Deploy to Netlify
1. Connect repo in Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. (Optional later) Move Firebase keys to environment variables.

## Firebase Config
Located in `src/firebase.js`. For production security, expose keys via Vite env variables:
```
VITE_FIREBASE_API_KEY=...
```
Then in code: `apiKey: import.meta.env.VITE_FIREBASE_API_KEY`.

## Scripts
| Command | Purpose |
|---------|---------|
| `npm run dev` / `npm start` | Dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview dist locally |
| `npm run lint` | Lint code |

## Tech Stack
- React 19 + Vite
- Firebase Realtime Database
- Vanilla CSS (design tokens + responsive layout)

## Roadmap Ideas
- Replace demo auth with Firebase Auth or Netlify Identity
- Undo (snackbar) + soft delete window
- Quantity / notes per item
- Drag & drop reorder
- Per-user color theming
- PWA: offline cache + install prompt
- Unit tests (React Testing Library) & integration tests

## License
MIT – personal demo project.
