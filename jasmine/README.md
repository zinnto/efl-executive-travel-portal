# EFL Global — Executive Travel Portal

A complete travel management system with two portals:

| Portal | URL | Who uses it |
|--------|-----|-------------|
| **Admin Dashboard** | `admin.html` | Travel coordinators — manage executives, trips, flights, hotels, documents |
| **Executive Portal** | `index.html` | Travelling executives — view their full trip pack (PWA, mobile-first) |

---

## Folder structure

```
efl-travel-portal/
??? admin.html              ? Admin dashboard (manage executives & trips)
??? index.html              ? Executive travel portal (PWA)
??? style.css               ? Executive portal styles
??? script.js               ? Executive portal logic (reads data/trip.json)
??? manifest.json           ? PWA manifest
??? service-worker.js       ? Offline caching
?
??? css/
?   ??? admin.css           ? Admin dashboard styles
?
??? js/
?   ??? app.js              ? Shared data engine (localStorage + JSON sync)
?   ??? admin.js            ? Admin dashboard controller
?
??? data/
?   ??? executives.json     ? Executive profiles (seed data)
?   ??? trips.json          ? All trips (seed data)
?   ??? trip.json           ? Single-trip pack for executive portal demo
?   ??? countries.json      ? Country/city dropdowns
?   ??? airlines.json       ? Airline dropdowns
?   ??? hotels.json         ? Hotel directory
?   ??? settings.json       ? Organisation settings
?   ??? version.json        ? Data version (auto-sync)
?
??? documents/              ? Sample PDFs linked from trip.json
```

---

## Quick start (local)

The app must be served over HTTP (not opened as `file://`):

```bash
cd efl-travel-portal
python -m http.server 8080
```

Then open:
- **Admin:** http://localhost:8080/admin.html
- **Executive portal:** http://localhost:8080/index.html

---

## Admin dashboard features

- **Dashboard** — counts, upcoming trips, items needing attention
- **Executives** — add and view executive profiles
- **Trips** — create trips, assign executives, set destinations and dates
- **Trip workspace** — add/edit flights, hotels, documents, contacts, readiness checklist
- **Settings** — organisation name, timezone, currency
- **Publish & Sync** — export JSON data or publish directly to GitHub

Data is saved in the browser's localStorage. Use **Export Data** or **Publish to GitHub** to make changes permanent for all users.

---

## Executive portal

The executive portal (`index.html`) renders a premium mobile-first trip pack from `data/trip.json`. To publish a new executive trip:

1. Edit `data/trip.json` with the traveller's details, flights, hotels, itinerary, documents, etc.
2. Drop PDFs into `documents/` and reference them in `trip.json`
3. Redeploy (or export from admin and commit)

---

## Publishing on GitHub Pages

1. Push this folder to a GitHub repository
2. Go to **Settings ? Pages** ? deploy from `main` branch, `/ (root)`
3. Your site will be at `https://<your-org>.github.io/<repo>/`
4. In the admin **Settings** tab, configure GitHub publishing to push data with one click

---

## Branding

EFL Global navy (`#0A1F3D`) and gold (`#D6B876`) are used throughout. Update CSS variables in `style.css` (executive) and `css/admin.css` (admin) to retint both portals.

---

EFL Global © 2026
