# EFL Global — Executive Travel Portal

A premium, installable Progressive Web App that replaces PDF-and-folder trip packs with a single mobile-first travel portal for senior executives.

Layout is a Soft-UI-style admin shell: a fixed **sidebar** (off-canvas on mobile, permanent on desktop/tablet), a sticky **top navbar** with breadcrumb, and rounded, soft-shadowed **cards** throughout. Branding is EFL Global navy + gold on a clean white background.

---

## 1. Folder structure

```
efl-travel-portal/
│
├── index.html            → App shell: sidebar, topnav, all views
├── style.css              → Full design system (tokens, layout, components)
├── script.js               → Renders every view from data/trip.json
├── manifest.json            → PWA manifest (name, icons, theme)
├── service-worker.js         → Offline caching
│
├── assets/
│   └── icons/                → Generated app icons (home screen + favicon)
│
├── documents/                 → Sample PDFs linked from trip.json
│
└── data/
    └── trip.json                → ALL trip content — edit this to create a new trip
```

## 2. How the dynamic data works

Every screen — dashboard, flights, hotels, itinerary, meetings, transport,
documents, maps, contacts, expenses, settings — is rendered by `script.js`
purely from `data/trip.json`. **To publish a new executive's trip, duplicate
`trip.json`, change the values, and redeploy — no HTML/CSS/JS edits needed.**

Key sections in `trip.json`:

| Key | Powers |
|---|---|
| `traveller` | Name, title, destination, dates shown on the dashboard header |
| `nextEvent` | The boarding-pass style "Next Event" card |
| `quickAccess` | The 9 quick-access tiles and their target view |
| `itinerary` | Day-by-day timeline (time, location, contact, notes, attachments, map query) |
| `flights` / `hotels` / `meetings` / `transport` | Their respective list screens |
| `documents` | Categorised document library — each item needs a `name` and a `file` path |
| `contacts` | Contact cards with call / WhatsApp / email actions |
| `maps` | Cards that open Google Maps in a new tab |
| `expenses` | Per diem + logged expense items |

To attach a real PDF, drop it into `/documents` and reference it by relative
path in `trip.json` (e.g. `"documents/boarding-pass-kq414.pdf"`).

## 3. Running it locally

Because the app fetches `data/trip.json` and registers a service worker, it
must be served over HTTP (not opened as a bare `file://`). Any static server
works, for example:

```bash
cd efl-travel-portal
python3 -m http.server 8080
# open http://localhost:8080
```

## 4. Publishing on GitHub Pages

1. Create a new GitHub repository (e.g. `efl-travel-portal`).
2. Push this folder's contents to the repository root:
   ```bash
   cd efl-travel-portal
   git init
   git add .
   git commit -m "EFL Global Executive Travel Portal"
   git branch -M main
   git remote add origin https://github.com/<your-org>/efl-travel-portal.git
   git push -u origin main
   ```
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`. Save.
5. GitHub will publish the site at:
   `https://<your-org>.github.io/efl-travel-portal/`
   (first deploy can take 1–2 minutes).
6. Every time you edit `data/trip.json` for a new trip, commit and push —
   Pages redeploys automatically.

> Note: GitHub Pages serves over HTTPS by default, which is required for the
> service worker and "Add to Home Screen" install prompt to work.

## 5. Adding it to a phone home screen

### iPhone (Safari)
1. Open the published URL in **Safari** (not Chrome — iOS requires Safari for this).
2. Tap the **Share** icon (square with an arrow) in the toolbar.
3. Scroll down and tap **Add to Home Screen**.
4. Confirm the name (EFL Travel) and tap **Add**.
5. The app icon now opens full-screen, without browser chrome, like a native app.

### Android (Chrome)
1. Open the published URL in **Chrome**.
2. Tap the **⋮** menu in the top right.
3. Tap **Install app** (or **Add to Home screen**).
4. Confirm — the icon is added to the home screen and app drawer.

The in-app **Settings → Add to Home Screen** button also triggers this
prompt directly on Android/Chromium browsers that support it.

## 6. Offline mode

Toggling **Settings → Offline Mode** tells the service worker to cache the
current trip's data and every linked document, so the itinerary and
documents remain viewable without signal (e.g. in-flight or in transit).

## 7. Customising branding

All brand colors and type live as CSS variables at the top of `style.css`
(`--navy-900`, `--gold-500`, fonts, radii, shadows). Update them there to
retint the whole app consistently.
