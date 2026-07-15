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
    ├── executives-index.json                → Executive directory (profiles, reused across trips)
    ├── trips-index.json                     → Lists every trip (id, file, traveller, stage)
    └── trips/
        ├── EFL-UG-0726.json                     → One trip = one executive = one JSON file
        └── EFL-SG-0812.json
```

## 3. Executives vs. Trips

These are two separate, linked entities:

- **An Executive** (`data/executives-index.json`) is a reusable profile — name,
  position, department, contact details, travel notes (seat preference,
  frequent-flyer status, etc). It doesn't change trip to trip.
- **A Trip** (`data/trips/<id>.json`) is one journey, and can optionally link
  to an executive via `traveller.execId`. A trip without a linked executive
  still works fine — the traveller fields are just entered directly.

In the Admin Dashboard, an executive's profile page lists every trip linked
to them, and has a **"+ New Trip for this Executive"** shortcut that
pre-fills the new trip's traveller details from the profile.

## 4. How multiple trips/executives work

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

## 5. Using the Admin Dashboard

Open `admin.html` (or tap **Settings → Manage Trips (Admin)** in the portal). It has four tabs:

**Dashboard** — summary cards (total trips, executives, active trips, pending
items), a **Pending Matters** list built from every trip's checklist (click
any item to jump straight into that trip and fix it), and a preview of your
most recent trips with quick Edit / Open in Portal actions.

**Trips** — every trip currently known to this browser, as cards with
Edit / Open in Portal / Duplicate / Download / Delete. **+ New Trip** opens
a full form: an optional link to an executive profile (which autofills the
traveller's name/position/photo initials), a system-generated Trip ID, next
event with airline and airport dropdowns, a **checklist** (add/remove/rename
any number of items), itinerary (day-by-day, with events and attachments),
flights (with the same airline/airport dropdowns), hotels, meetings,
transport, documents (by category), contacts, maps and expenses. No JSON
editing required. **Import JSON** lets you paste in or upload an existing
trip file. **Download trips-index.json** gives you an up-to-date copy of the
whole trip directory, ready to replace the one in your repo.

**Executives** — the executive directory. Add a profile once (name,
position, department, contact info, travel notes), then link any number of
trips to it from the trip editor's "Executive" dropdown — selecting one
autofills the traveller fields. Opening an executive's profile shows every
trip linked to them and lets you jump straight into editing one, open their
current trip in the portal, or start a new trip pre-filled with their
details. **Download executives-index.json** gives you the full executive
directory as one file, ready to replace the one in your repo.

**Settings** — documentation on how the data model and publishing flow
work (including a concrete "which downloaded file goes where" checklist and
how to attach PDFs or Google Drive links), an **Export All (JSON)** button
that backs up every trip and executive currently saved in this browser into
one file, an **Import Bundle** button to restore from that file, and a
"Clear All Local Admin Edits" reset for when local preview data gets out of
sync.

**Save** — writes into this browser's local storage. Because the portal
checks local storage before fetching the file on disk, **this makes your
edit appear in the portal instantly**, in this browser, without any deploy —
perfect for reviewing before you publish.

**Set as Default in Portal** — makes this trip the one shown when the portal
opens with no trip already remembered on this device.

> **Why "Save" isn't automatically permanent:** GitHub Pages (like this
> project) serves static files — there is no database or server the admin
> page can write to. The local-storage save gives you an instant, private
> preview; downloading + committing the right file (see the checklist below)
> is the publishing step. If you later want true multi-user editing with no
> manual file step, that would need a small backend (e.g. a serverless
> function + database) — happy to help design that if EFL Global wants to
> take this further.

## 5a. Publishing checklist — where each downloaded file goes

Every "Download" button in the Admin Dashboard produces a file already
named correctly. Here's exactly where each one goes in your repository:

| You downloaded… | Goes in… | Also do… |
|---|---|---|
| `<tripId>.json` (from a Trip) | `data/trips/` | Also download & replace `trips-index.json` (see below) |
| `trips-index.json` (Trips tab button) | `data/` — replace the whole file | — |
| `executives-index.json` (Executives tab button) | `data/` — replace the whole file | This is one array of **all** executives — always replace the whole file, don't try to hand-merge individual downloads into it |
| A PDF (boarding pass, hotel confirmation, etc.) | `documents/` | Reference it in the trip as `documents/your-file.pdf` |

**Adding a PDF:** upload it straight into the `documents/` folder in your
GitHub repo (GitHub's web UI: **Add file → Upload files**, or copy it in
locally before you commit), then type `documents/your-file-name.pdf` into
the relevant document/attachment field in the admin editor.

**Using Google Drive (or any other link) instead:** every document/attachment
field accepts a full URL in place of a local path — e.g.
`https://drive.google.com/file/d/XXXXXXXX/view`. Set the Drive file's sharing
to "Anyone with the link can view" (the executive opening it from the portal
won't be logged into your Drive), and nothing needs to go in `documents/`
for that entry.

The **Export All (JSON)** button in Settings is a separate, different-shaped
bundle meant only for backup/restore *within the admin tool itself* (via
**Import Bundle**) — it is not in the same format as the repo files above, so
use the table above when you're ready to publish.

## 6. Running it locally

Because the app fetches JSON and registers a service worker, it must be
served over HTTP (not opened as a bare `file://`):

```bash
cd efl-travel-portal
python3 -m http.server 8080
# Portal:  http://localhost:8080/index.html
# Admin:   http://localhost:8080/admin.html
```

## 7. Publishing on GitHub Pages

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

## 8. Adding it to a phone home screen

### iPhone (Safari)
1. Open the published portal URL in **Safari**.
2. Tap the **Share** icon, then **Add to Home Screen**, then **Add**.

### Android (Chrome)
1. Open the published portal URL in **Chrome**.
2. Tap **⋮ → Install app** (or **Add to Home screen**).

The in-app **Settings → Add to Home Screen** button triggers this directly
on supported browsers.

## 9. Offline mode

Toggling **Settings → Offline Mode** in the portal tells the service worker
to cache the current trip's data and every linked document, so the itinerary
and documents remain viewable without signal.

## 10. Customising branding

All brand colors and type live as CSS variables at the top of `style.css`
(`--navy-900`, `--gold-500`, fonts, radii, shadows) — shared by both the
portal and the admin dashboard.
