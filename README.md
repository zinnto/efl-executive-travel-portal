# EFL Global — Executive Travel Portal

A premium, installable Progressive Web App that replaces PDF-and-folder trip packs with a single mobile-first travel portal for senior executives — plus an **Admin Dashboard** for the EFL ops team to create and manage every executive's trip.

Layout is a Soft-UI-style shell: a fixed **sidebar** (off-canvas on mobile, permanent on desktop/tablet), a sticky **top navbar** with breadcrumb, and rounded, soft-shadowed **cards** throughout. Branding is EFL Global navy + gold on a clean white background.

---

## 1. The two apps in this project

| App | File | Who it's for |
|---|---|---|
| **Executive Portal** | `index.html` | The travelling executive — dashboard, itinerary, documents, contacts, maps, expenses |
| **Admin Dashboard** | `admin.html` | The EFL ops/travel team — add, edit, duplicate and delete trips & executives |

They share the same design system (`style.css`) and the same trip data.

## 2. Folder structure

```
efl-travel-portal/
│
├── index.html            → Executive Portal shell
├── admin.html              → Admin Dashboard shell
├── style.css                 → Full design system (tokens, layout, both apps' components)
├── script.js                   → Portal logic — loads & renders the active trip
├── admin.js                      → Admin logic — CRUD over trips & executives
├── manifest.json                   → PWA manifest (name, icons, theme)
├── service-worker.js                 → Offline caching for both apps
│
├── assets/icons/                        → Generated app icons (home screen + favicon)
├── documents/                             → Sample PDFs linked from trip files
│
└── data/
    ├── trips-index.json                     → Lists every trip (id, file, traveller, stage)
    └── trips/
        ├── EFL-UG-0726.json                     → One trip = one executive = one JSON file
        └── EFL-SG-0812.json
```

## 3. How multiple trips/executives work

Every screen in the **portal** is rendered by `script.js` purely from a trip
JSON file. `data/trips-index.json` is the directory of all trips:

```json
{
  "defaultTripId": "EFL-UG-0726",
  "trips": [
    { "tripId": "EFL-UG-0726", "file": "data/trips/EFL-UG-0726.json",
      "travellerName": "Prageeth Ranasinghe", "position": "Regional Finance Manager",
      "destination": "Kampala & Entebbe, Uganda", "dates": "20–27 Jul 2026", "status": "active" }
  ]
}
```

The portal decides which trip to show, in this order:
1. `?trip=<tripId>` in the URL (used for admin "Open in Portal" previews)
2. the last trip opened on this device (remembered in the browser)
3. `defaultTripId` in `trips-index.json`

To add a trip **permanently** (visible to everyone after deploy): create a
new `data/trips/<id>.json` file (same shape as the existing ones) and add an
entry for it in `data/trips-index.json`, then commit & push. **The Admin
Dashboard generates this file for you** — see below.

## 4. Using the Admin Dashboard

Open `admin.html` (or tap **Settings → Manage Trips (Admin)** in the portal).

- **All Trips** — every trip currently known to this browser, as cards with
  Edit / Open in Portal / Duplicate / Download / Delete.
- **+ New Trip** — opens a full form: traveller details, next event, status
  checklist, itinerary (day-by-day, with events and attachments), flights,
  hotels, meetings, transport, documents (by category), contacts, maps and
  expenses. No JSON editing required.
- **Import JSON** — paste in or upload an existing trip file to edit it.
- **Save Trip** — writes the trip into this browser's local storage. Because
  the portal checks local storage before fetching the file on disk, **this
  makes your edit appear in the portal instantly**, in this browser, without
  any deploy — perfect for reviewing before you publish.
- **Download JSON** — downloads the trip as `<tripId>.json`. This is how a
  change becomes *permanent*: drop the file into `data/trips/`, add/update
  its entry in `data/trips-index.json`, commit, and push.
- **Set as Default in Portal** — makes this trip the one shown when the
  portal opens with no trip already remembered on this device.

> **Why "Save" isn't automatically permanent:** GitHub Pages (like this
> project) serves static files — there is no database or server the admin
> page can write to. The local-storage save gives you an instant, private
> preview; "Download JSON" + commit is the publishing step. If you later want
> true multi-user editing with no manual file step, that would need a small
> backend (e.g. a serverless function + database) — happy to help design
> that if EFL Global wants to take this further.

## 5. Running it locally

Because the app fetches JSON and registers a service worker, it must be
served over HTTP (not opened as a bare `file://`):

```bash
cd efl-travel-portal
python3 -m http.server 8080
# Portal:  http://localhost:8080/index.html
# Admin:   http://localhost:8080/admin.html
```

## 6. Publishing on GitHub Pages

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
6. Every time you add a trip via the Admin Dashboard, **Download JSON**,
   commit the new file into `data/trips/`, update `data/trips-index.json`,
   and push — Pages redeploys automatically.

> GitHub Pages serves over HTTPS by default, required for the service worker
> and "Add to Home Screen" install prompt to work.

## 7. Adding it to a phone home screen

### iPhone (Safari)
1. Open the published portal URL in **Safari**.
2. Tap the **Share** icon, then **Add to Home Screen**, then **Add**.

### Android (Chrome)
1. Open the published portal URL in **Chrome**.
2. Tap **⋮ → Install app** (or **Add to Home screen**).

The in-app **Settings → Add to Home Screen** button triggers this directly
on supported browsers.

## 8. Offline mode

Toggling **Settings → Offline Mode** in the portal tells the service worker
to cache the current trip's data and every linked document, so the itinerary
and documents remain viewable without signal.

## 9. Customising branding

All brand colors and type live as CSS variables at the top of `style.css`
(`--navy-900`, `--gold-500`, fonts, radii, shadows) — shared by both the
portal and the admin dashboard.
