/* ==========================================================================
   EFL GLOBAL — Admin Dashboard
   Manages trips/executives on top of the static data/trips-index.json +
   data/trips/*.json files, using the SAME localStorage contract the
   portal (script.js) already reads:

     localStorage['efl-trip-data-<tripId>']   → full trip JSON (live override)
     localStorage['efl-active-trip']          → tripId shown by default
     localStorage['efl-trips-index-extra']    → trips created only in admin
     localStorage['efl-trips-index-removed']  → tripIds deleted in admin

   This is a static, serverless site, so "Save" persists to this browser's
   localStorage (instant preview in the portal) and "Download JSON" is how
   a change becomes permanent — commit the file into data/trips/ and it
   will be picked up by everyone once redeployed.
   ========================================================================== */

const LS_EXTRA = 'efl-trips-index-extra';
const LS_REMOVED = 'efl-trips-index-removed';
const LS_ACTIVE = 'efl-active-trip';
const tripDataKey = (id) => 'efl-trip-data-' + id;

const LS_EXEC_EXTRA = 'efl-executives-extra';
const LS_EXEC_REMOVED = 'efl-executives-removed';
const execDataKey = (id) => 'efl-exec-data-' + id;

let currentTrip = null;
let currentIsNew = false;
let currentExec = null;
let currentExecIsNew = false;
let currentView = 'dashboard';
let editorOrigin = 'list'; // which tab to return to when leaving the trip editor: 'list' | 'executives' | 'dashboard'
let EXEC_CACHE = null; // cached merged executives list, refreshed on demand

const ICONS = {
  itinerary: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 3v3M16 3v3"/></svg>',
  contact: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>',
  flight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.5 3.5l7 7-3.5 1.4-3.9-2.5-2.1 2.1 1.6 3-1.4 1.4-3-3.6-3.6-3 1.4-1.4 3 1.6 2.1-2.1-2.5-3.9 1.4-3.5z"/></svg>',
  document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l6 6L20 6"/></svg>'
};

function blankExecutive() {
  return { execId: '', name: '', position: '', department: '', tier: '', photoInitials: '', email: '', phone: '', nationality: '', notes: '' };
}
function newExecId(name) {
  return `EXEC-${slugify(name).slice(0, 6) || 'NEW'}${Date.now().toString(36).slice(-3).toUpperCase()}`;
}

/* ---------------- Reference lists: airlines & airports ---------------- */

const AIRLINE_OPTIONS = [
  'Kenya Airways', 'Ethiopian Airlines', 'RwandAir', 'Uganda Airlines', 'South African Airways',
  'EgyptAir', 'Emirates', 'Qatar Airways', 'Etihad Airways', 'Turkish Airlines',
  'British Airways', 'Lufthansa', 'Air France', 'KLM', 'Swiss International Air Lines',
  'Brussels Airlines', 'Delta Air Lines', 'United Airlines', 'American Airlines',
  'Singapore Airlines', 'Qantas', 'Air Canada'
];

const AIRPORT_OPTIONS = [
  // East & Southern Africa
  'Nairobi (NBO) — Jomo Kenyatta Intl', 'Mombasa (MBA) — Moi Intl', 'Entebbe (EBB) — Entebbe Intl, Kampala',
  'Kigali (KGL) — Kigali Intl', 'Dar es Salaam (DAR) — Julius Nyerere Intl', 'Zanzibar (ZNZ) — Abeid Amani Karume Intl',
  'Addis Ababa (ADD) — Bole Intl', 'Lagos (LOS) — Murtala Muhammed Intl', 'Johannesburg (JNB) — OR Tambo Intl',
  'Cape Town (CPT) — Cape Town Intl',
  // Middle East / North Africa
  'Cairo (CAI) — Cairo Intl', 'Dubai (DXB) — Dubai Intl', 'Abu Dhabi (AUH) — Zayed Intl',
  'Doha (DOH) — Hamad Intl', 'Istanbul (IST) — Istanbul Airport',
  // Europe
  'London (LHR) — Heathrow', 'London (LGW) — Gatwick', 'Paris (CDG) — Charles de Gaulle',
  'Amsterdam (AMS) — Schiphol', 'Frankfurt (FRA) — Frankfurt Airport', 'Munich (MUC) — Munich Airport',
  'Zurich (ZRH) — Zurich Airport', 'Geneva (GVA) — Geneva Airport', 'Vienna (VIE) — Vienna Intl',
  'Brussels (BRU) — Brussels Airport', 'Madrid (MAD) — Adolfo Suárez Barajas', 'Rome (FCO) — Fiumicino',
  'Milan (MXP) — Malpensa', 'Copenhagen (CPH) — Kastrup', 'Stockholm (ARN) — Arlanda',
  'Dublin (DUB) — Dublin Airport', 'Lisbon (LIS) — Humberto Delgado', 'Warsaw (WAW) — Chopin Airport',
  // USA / Canada
  'New York (JFK) — John F. Kennedy Intl', 'New York (EWR) — Newark Liberty', 'Washington DC (IAD) — Dulles Intl',
  'Los Angeles (LAX) — LA Intl', 'San Francisco (SFO) — SF Intl', 'Chicago (ORD) — O\'Hare Intl',
  'Atlanta (ATL) — Hartsfield-Jackson', 'Houston (IAH) — George Bush Intercontinental', 'Miami (MIA) — Miami Intl',
  'Boston (BOS) — Logan Intl', 'Dallas (DFW) — Dallas/Fort Worth Intl', 'Seattle (SEA) — Sea-Tac Intl',
  'Toronto (YYZ) — Pearson Intl'
];

const OTHER_VALUE = '__other__';

/* ---------------- Travel policy reference (for editor hints) ---------------- */

let POLICY_DATA = null;
async function loadPolicyData() {
  if (POLICY_DATA) return POLICY_DATA;
  try {
    const res = await fetch('data/travel-policy.json', { cache: 'no-store' });
    POLICY_DATA = await res.json();
  } catch (err) {
    console.warn('Could not load travel-policy.json — policy hints will be unavailable.', err);
    POLICY_DATA = null;
  }
  return POLICY_DATA;
}
function policyRowForZone(section, zone) {
  if (!POLICY_DATA || !POLICY_DATA[section]) return null;
  return POLICY_DATA[section].rows.find(r => r.zone === zone) || null;
}
function policyRowForTier(tier) {
  if (!POLICY_DATA || !POLICY_DATA.classOfService) return null;
  return POLICY_DATA.classOfService.rows.find(r => r.level === tier) || null;
}

// Recomputes every policy hint shown in the trip editor, based on the
// currently selected Travel Zone and the linked executive's Policy Tier.
// Purely informational — nothing here validates or blocks saving.
async function updatePolicyHints() {
  if (!currentTrip) return;
  await loadPolicyData();

  const zone = document.getElementById('f_zone').value;
  const zoneCountriesEl = document.getElementById('zoneCountriesHint');
  const perDiemHintEl = document.getElementById('perDiemHint');
  const hotelHintEl = document.getElementById('hotelHint');
  const classHintEl = document.getElementById('classHint');

  if (zone && POLICY_DATA) {
    const pd = policyRowForZone('perDiemByZone', zone);
    const hl = policyRowForZone('hotelLimitsByZone', zone);

    zoneCountriesEl.textContent = pd ? pd.countries : '';
    zoneCountriesEl.style.display = pd ? '' : 'none';

    perDiemHintEl.textContent = pd ? `Policy per diem for ${zone}: ${pd.dailyLimit}/day` : '';
    perDiemHintEl.style.display = pd ? '' : 'none';

    hotelHintEl.textContent = hl ? `Policy hotel limit for ${zone}: ${hl.range}` : '';
    hotelHintEl.style.display = hl ? '' : 'none';
  } else {
    zoneCountriesEl.style.display = 'none';
    perDiemHintEl.style.display = 'none';
    hotelHintEl.style.display = 'none';
  }

  const execId = document.getElementById('f_execId').value;
  let cls = null, execLabel = '';
  if (execId) {
    try {
      const exec = await loadExecutiveById(execId);
      if (exec && exec.tier) { cls = policyRowForTier(exec.tier); execLabel = exec.name || ''; }
    } catch (err) { /* executive not found — leave hint hidden */ }
  }
  if (cls) {
    classHintEl.textContent = `Policy class for ${execLabel} (${cls.level}): ${cls.shortHaul} (≤6h) · ${cls.longHaul} (>6h)`;
    classHintEl.style.display = '';
  } else {
    classHintEl.style.display = 'none';
  }
}

// A "select + other" field shows a dropdown of common options, plus a free-text
// input (revealed by choosing "Other…") for anything not on the list.
function selectOtherOptionsHtml(options, selected) {
  return '<option value="">— Select —</option>' +
    options.map(o => `<option value="${esc(o)}" ${selected === o ? 'selected' : ''}>${esc(o)}</option>`).join('') +
    `<option value="${OTHER_VALUE}" ${selected === OTHER_VALUE ? 'selected' : ''}>Other (type manually)…</option>`;
}
function setSelectOtherPair(selectEl, otherEl, value, options) {
  if (value && options.includes(value)) {
    selectEl.value = value;
    otherEl.value = '';
    otherEl.style.display = 'none';
  } else if (value) {
    selectEl.value = OTHER_VALUE;
    otherEl.value = value;
    otherEl.style.display = '';
  } else {
    selectEl.value = '';
    otherEl.value = '';
    otherEl.style.display = 'none';
  }
}
function getSelectOtherValue(selectEl, otherEl) {
  return selectEl.value === OTHER_VALUE ? otherEl.value.trim() : selectEl.value;
}
// Short, human-friendly label for composing routes, e.g. "Nairobi (NBO) — Jomo…" -> "Nairobi (NBO)"
function shortLabel(v) {
  return (v || '').split(' — ')[0];
}
// "2026-07-20" -> "Mon, 20 Jul 2026" — used to auto-fill the free-text display
// date whenever a real (dateISO) date is picked, so the two never drift apart.
function formatDateISO(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
}

/* ---------------- Utilities ---------------- */

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
function initials(name) {
  return (name || '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
function esc(v) {
  return (v === undefined || v === null ? '' : String(v)).replace(/"/g, '&quot;');
}
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastText').textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 3800);
}
function slugify(name) {
  return (name || 'trip').toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 14);
}
function newTripId(name) {
  return `EFL-${slugify(name).slice(0, 8) || 'NEW'}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
}
function download(filename, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

/* ---------------- Blank trip template ---------------- */

function blankTrip() {
  return {
    meta: { tripName: 'New Trip', companyName: 'EFL Global', generatedOn: new Date().toISOString().slice(0, 10), stage: 'upcoming' },
    traveller: { name: '', position: '', photoInitials: '', destination: '', dates: '', tripId: '', zone: '' },
    nextEvent: null,
    status: { documentsReady: false, hotelsConfirmed: false, transportArranged: false },
    quickAccess: [
      { id: 'flights', label: 'Flights', icon: 'flight' }, { id: 'hotels', label: 'Hotels', icon: 'hotel' },
      { id: 'itinerary', label: 'Itinerary', icon: 'itinerary' }, { id: 'meetings', label: 'Meetings', icon: 'meeting' },
      { id: 'transport', label: 'Transport', icon: 'transport' }, { id: 'documents', label: 'Documents', icon: 'document' },
      { id: 'maps', label: 'Maps', icon: 'map' }, { id: 'contacts', label: 'Contacts', icon: 'contact' },
      { id: 'expenses', label: 'Expenses', icon: 'expense' }
    ],
    itinerary: [], flights: [], hotels: [], meetings: [], transport: [],
    documents: {}, contacts: [], maps: [],
    expenses: { currency: 'USD', perDiem: 0, items: [] }
  };
}

/* ---------------- Trips index (static + local overlay) ---------------- */

async function loadTripsIndex() {
  let staticIdx = { defaultTripId: null, trips: [] };
  try {
    const res = await fetch('data/trips-index.json', { cache: 'no-store' });
    staticIdx = await res.json();
  } catch (e) { console.warn('No trips-index.json found', e); }

  const removed = JSON.parse(localStorage.getItem(LS_REMOVED) || '[]');
  const extra = JSON.parse(localStorage.getItem(LS_EXTRA) || '[]');
  const map = {};
  [...staticIdx.trips, ...extra].forEach(t => { map[t.tripId] = t; });
  removed.forEach(id => delete map[id]);
  return { defaultTripId: staticIdx.defaultTripId, trips: Object.values(map) };
}

function upsertIndexEntry(trip) {
  const entry = {
    tripId: trip.traveller.tripId,
    file: `data/trips/${trip.traveller.tripId}.json`,
    travellerName: trip.traveller.name,
    position: trip.traveller.position,
    destination: trip.traveller.destination,
    dates: trip.traveller.dates,
    status: trip.meta.stage || 'upcoming'
  };
  const extra = JSON.parse(localStorage.getItem(LS_EXTRA) || '[]');
  const i = extra.findIndex(t => t.tripId === entry.tripId);
  if (i >= 0) extra[i] = entry; else extra.push(entry);
  localStorage.setItem(LS_EXTRA, JSON.stringify(extra));

  const removed = JSON.parse(localStorage.getItem(LS_REMOVED) || '[]').filter(id => id !== entry.tripId);
  localStorage.setItem(LS_REMOVED, JSON.stringify(removed));
}

async function loadTripById(id, fileHint) {
  const override = localStorage.getItem(tripDataKey(id));
  if (override) return JSON.parse(override);
  const file = fileHint || `data/trips/${id}.json`;
  const res = await fetch(file, { cache: 'no-store' });
  if (!res.ok) throw new Error('Trip file not found: ' + file);
  return res.json();
}

/* ---------------- Executives directory (static + local overlay) ----------------
   Unlike trips (one file per trip), the executives directory is one small
   JSON array (data/executives-index.json). Local edits/additions live in
   localStorage the same way trips do: an override per executive, plus an
   "extra" list for ones only created in this browser, plus a "removed" list. */

async function loadExecutivesList(forceRefresh) {
  if (EXEC_CACHE && !forceRefresh) return EXEC_CACHE;
  let staticList = [];
  try {
    const res = await fetch('data/executives-index.json', { cache: 'no-store' });
    staticList = await res.json();
  } catch (e) { console.warn('No executives-index.json found', e); }

  const removed = JSON.parse(localStorage.getItem(LS_EXEC_REMOVED) || '[]');
  const extra = JSON.parse(localStorage.getItem(LS_EXEC_EXTRA) || '[]');
  const map = {};
  [...staticList, ...extra].forEach(e => { map[e.execId] = e; });
  removed.forEach(id => delete map[id]);

  // Apply any live per-executive overrides (edited profiles) on top.
  const merged = Object.values(map).map(e => {
    const override = localStorage.getItem(execDataKey(e.execId));
    return override ? JSON.parse(override) : e;
  });
  EXEC_CACHE = merged;
  return merged;
}

async function loadExecutiveById(id) {
  const override = localStorage.getItem(execDataKey(id));
  if (override) return JSON.parse(override);
  const list = await loadExecutivesList();
  const found = list.find(e => e.execId === id);
  if (!found) throw new Error('Executive not found: ' + id);
  return found;
}

function upsertExecutive(exec) {
  localStorage.setItem(execDataKey(exec.execId), JSON.stringify(exec));
  const extra = JSON.parse(localStorage.getItem(LS_EXEC_EXTRA) || '[]');
  const i = extra.findIndex(e => e.execId === exec.execId);
  if (i >= 0) extra[i] = exec; else extra.push(exec);
  localStorage.setItem(LS_EXEC_EXTRA, JSON.stringify(extra));
  const removed = JSON.parse(localStorage.getItem(LS_EXEC_REMOVED) || '[]').filter(id => id !== exec.execId);
  localStorage.setItem(LS_EXEC_REMOVED, JSON.stringify(removed));
  EXEC_CACHE = null;
}

function deleteExecutive(id) {
  localStorage.removeItem(execDataKey(id));
  const removed = JSON.parse(localStorage.getItem(LS_EXEC_REMOVED) || '[]');
  if (!removed.includes(id)) removed.push(id);
  localStorage.setItem(LS_EXEC_REMOVED, JSON.stringify(removed));
  let extra = JSON.parse(localStorage.getItem(LS_EXEC_EXTRA) || '[]').filter(e => e.execId !== id);
  localStorage.setItem(LS_EXEC_EXTRA, JSON.stringify(extra));
  EXEC_CACHE = null;
}

/* Trips that belong to a given executive — matched by execId, falling back
   to a name match for older trips created before this field existed. */
async function tripsForExecutive(exec) {
  const idx = await loadTripsIndex();
  const out = [];
  for (const entry of idx.trips) {
    try {
      const t = await loadTripById(entry.tripId, entry.file);
      const matches = t.traveller.execId ? t.traveller.execId === exec.execId : t.traveller.name === exec.name;
      if (matches) out.push(t);
    } catch (e) { /* skip trips whose file is missing */ }
  }
  return out;
}

/* ---------------- View: Dashboard ---------------- */

async function renderDashboard() {
  const statGrid = document.getElementById('dashStatGrid');
  const pendingWrap = document.getElementById('dashPending');
  const previewWrap = document.getElementById('dashTripsPreview');
  statGrid.innerHTML = '<div class="empty-hint">Loading…</div>';
  pendingWrap.innerHTML = '';
  previewWrap.innerHTML = '';

  const [idx, execs] = await Promise.all([loadTripsIndex(), loadExecutivesList(true)]);
  const trips = (await Promise.all(idx.trips.map(async (entry) => {
    try { return await loadTripById(entry.tripId, entry.file); } catch (e) { return null; }
  }))).filter(Boolean);

  const activeCount = trips.filter(t => (t.meta.stage || 'upcoming') === 'active').length;

  const pending = [];
  trips.forEach(t => {
    migrateChecklist(t).filter(c => !c.done && c.label).forEach(c => pending.push({ trip: t, label: c.label }));
  });

  statGrid.innerHTML = [
    { label: 'Total Trips', value: trips.length, icon: 'itinerary' },
    { label: 'Executives', value: execs.length, icon: 'contact', gold: true },
    { label: 'Active Trips', value: activeCount, icon: 'flight' },
    { label: 'Pending Items', value: pending.length, icon: 'document', gold: pending.length > 0 }
  ].map(c => `<div class="stat-card">
      <div class="stat-card__text"><div class="stat-card__label">${c.label}</div><div class="stat-card__value">${c.value}</div></div>
      <div class="stat-card__icon ${c.gold ? 'gold' : ''}">${ICONS[c.icon]}</div>
    </div>`).join('');

  if (!pending.length) {
    pendingWrap.innerHTML = `<div class="status-row"><div class="status-check">${ICONS.check}</div><div class="status-text">Nothing pending — every trip is fully arranged.</div></div>`;
  } else {
    pendingWrap.innerHTML = pending.map(p => `
      <div class="status-row" style="cursor:pointer;" data-id="${esc(p.trip.traveller.tripId)}">
        <div class="status-check" style="background:var(--gold-100);color:var(--navy-800);">${ICONS.bell}</div>
        <div class="status-text">${esc(p.trip.traveller.name) || '(unnamed)'} — ${esc(p.label)}</div>
      </div>`).join('');
    pendingWrap.querySelectorAll('.status-row[data-id]').forEach(row => {
      row.addEventListener('click', () => { editorOrigin = 'dashboard'; openEditor(row.dataset.id); });
    });
  }

  previewWrap.innerHTML = trips.slice(0, 6).map(t => `
    <div class="trip-card" data-id="${esc(t.traveller.tripId)}">
      <div class="trip-card__top">
        <div class="trip-card__avatar">${initials(t.traveller.name)}</div>
        <div><div class="trip-card__name">${esc(t.traveller.name) || '(unnamed)'}</div><div class="trip-card__role">${esc(t.traveller.position || '')}</div></div>
      </div>
      <div class="trip-card__meta"><div><span>Destination </span>${esc(t.traveller.destination || '—')}</div><div><span>Dates </span>${esc(t.traveller.dates || '—')}</div></div>
      <span class="trip-card__status ${t.meta.stage || 'upcoming'}">${t.meta.stage || 'upcoming'}</span>
      <div class="trip-card__actions">
        <button class="btn btn-primary btn-sm" data-act="edit">Edit</button>
        <button class="btn btn-outline btn-sm" data-act="preview">Open in Portal</button>
      </div>
    </div>`).join('') || '<div class="empty-hint">No trips yet — head to the Trips tab to create the first one.</div>';

  previewWrap.querySelectorAll('.trip-card').forEach(card => {
    const id = card.dataset.id;
    card.querySelector('[data-act="edit"]').addEventListener('click', () => { editorOrigin = 'dashboard'; openEditor(id); });
    card.querySelector('[data-act="preview"]').addEventListener('click', () => window.open(`index.html?trip=${encodeURIComponent(id)}`, '_blank'));
  });
}

/* ---------------- View: Trips list ---------------- */

async function renderTripsList() {
  const grid = document.getElementById('tripsGrid');
  grid.innerHTML = '<div class="empty-hint">Loading trips…</div>';
  const idx = await loadTripsIndex();

  if (!idx.trips.length) {
    grid.innerHTML = `<div class="empty-hint">No trips yet. Click <strong>+ New Trip</strong> to create the first executive itinerary.</div>`;
    return;
  }

  const activeId = localStorage.getItem(LS_ACTIVE);
  const cards = await Promise.all(idx.trips.map(async (entry) => {
    let live = entry;
    try {
      const t = await loadTripById(entry.tripId, entry.file);
      live = {
        tripId: t.traveller.tripId, travellerName: t.traveller.name, position: t.traveller.position,
        destination: t.traveller.destination, dates: t.traveller.dates, status: (t.meta && t.meta.stage) || entry.status || 'upcoming'
      };
    } catch (e) { /* fall back to index metadata if file missing */ }
    const isDefault = live.tripId === (activeId || idx.defaultTripId);
    return `
      <div class="trip-card" data-id="${esc(live.tripId)}">
        <div class="trip-card__top">
          <div class="trip-card__avatar">${initials(live.travellerName)}</div>
          <div>
            <div class="trip-card__name">${live.travellerName || '(unnamed)'}</div>
            <div class="trip-card__role">${live.position || ''}</div>
          </div>
        </div>
        <div class="trip-card__meta">
          <div><span>Destination </span>${live.destination || '—'}</div>
          <div><span>Dates </span>${live.dates || '—'}</div>
          <div><span>Trip ID </span>${live.tripId}</div>
        </div>
        <span class="trip-card__status ${live.status}">${live.status}${isDefault ? ' · default' : ''}</span>
        <div class="trip-card__actions">
          <button class="btn btn-primary btn-sm" data-act="edit">Edit</button>
          <button class="btn btn-outline btn-sm" data-act="preview">Open in Portal</button>
          <button class="btn btn-outline btn-sm" data-act="duplicate">Duplicate</button>
          <button class="btn btn-outline btn-sm" data-act="download">Download</button>
          <button class="btn btn-ghost btn-sm" data-act="delete">Delete</button>
        </div>
      </div>`;
  }));
  grid.innerHTML = cards.join('');

  grid.querySelectorAll('.trip-card').forEach(card => {
    const id = card.dataset.id;
    card.querySelector('[data-act="edit"]').addEventListener('click', () => { editorOrigin = 'list'; openEditor(id); });
    card.querySelector('[data-act="preview"]').addEventListener('click', () => window.open(`index.html?trip=${encodeURIComponent(id)}`, '_blank'));
    card.querySelector('[data-act="download"]').addEventListener('click', async () => {
      const t = await loadTripById(id);
      download(`${id}.json`, JSON.stringify(t, null, 2));
    });
    card.querySelector('[data-act="duplicate"]').addEventListener('click', async () => {
      const t = await loadTripById(id);
      const clone = JSON.parse(JSON.stringify(t));
      const newId = newTripId(clone.traveller.name + '-copy');
      clone.traveller.tripId = newId;
      clone.traveller.name = clone.traveller.name + ' (Copy)';
      currentTrip = clone; currentIsNew = true;
      editorOrigin = 'list';
      openEditorWithTrip(clone, true);
      showToast('Duplicated — edit and Save to keep it.');
    });
    card.querySelector('[data-act="delete"]').addEventListener('click', () => {
      if (!confirm(`Delete "${card.querySelector('.trip-card__name').textContent}"? This removes it from this browser. If it came from a committed file, redeploying will bring it back unless you also delete the file in your repo.`)) return;
      localStorage.removeItem(tripDataKey(id));
      const removed = JSON.parse(localStorage.getItem(LS_REMOVED) || '[]');
      if (!removed.includes(id)) removed.push(id);
      localStorage.setItem(LS_REMOVED, JSON.stringify(removed));
      let extra = JSON.parse(localStorage.getItem(LS_EXTRA) || '[]').filter(t => t.tripId !== id);
      localStorage.setItem(LS_EXTRA, JSON.stringify(extra));
      if (localStorage.getItem(LS_ACTIVE) === id) localStorage.removeItem(LS_ACTIVE);
      showToast('Trip deleted from this browser.');
      renderTripsList();
    });
  });
}

/* ---------------- Generic repeatable-field list builder ---------------- */

function renderRepeatList(containerEl, items, fields, opts) {
  containerEl.innerHTML = '';
  if (!items.length) {
    containerEl.appendChild(el(`<div class="empty-hint">${opts.emptyText || 'None added yet.'}</div>`));
  }
  items.forEach((item, idx) => {
    const card = el(`<div class="repeat-card">
      <div class="repeat-card__head">
        <span class="repeat-card__title">${opts.title(item, idx)}</span>
        <button class="repeat-card__remove" type="button">Remove</button>
      </div>
      <div class="form-grid"></div>
    </div>`);
    const grid = card.querySelector('.form-grid');
    const refreshTitle = () => {
      const t = card.querySelector('.repeat-card__title');
      if (t) t.textContent = opts.title(item, idx);
    };
    const composeRouteIfApplicable = () => {
      if (!('from' in item) && !('to' in item)) return;
      const routeInput = grid.querySelector('[data-k="route"]');
      if (!routeInput) return;
      if (item.from && item.to) {
        item.route = `${shortLabel(item.from)} → ${shortLabel(item.to)}`;
        routeInput.value = item.route;
      }
    };

    fields.forEach(f => {
      if (f.type === 'select-other') {
        const wrap = el(`<div class="field ${f.span2 ? 'span-2' : ''}"><label>${f.label}</label></div>`);
        const select = el(`<select class="f-input">${selectOtherOptionsHtml(f.options, f.options.includes(item[f.key]) ? item[f.key] : (item[f.key] ? OTHER_VALUE : ''))}</select>`);
        const otherInput = el(`<input class="f-input" type="text" placeholder="Type manually" style="margin-top:6px;" value="${esc(f.options.includes(item[f.key]) ? '' : (item[f.key] || ''))}" />`);
        otherInput.style.display = (select.value === OTHER_VALUE) ? '' : 'none';
        const commit = () => {
          item[f.key] = getSelectOtherValue(select, otherInput);
          composeRouteIfApplicable();
          refreshTitle();
          if (opts.onChange) opts.onChange();
        };
        select.addEventListener('change', () => {
          otherInput.style.display = select.value === OTHER_VALUE ? '' : 'none';
          commit();
        });
        otherInput.addEventListener('input', commit);
        wrap.appendChild(select);
        wrap.appendChild(otherInput);
        grid.appendChild(wrap);
        return;
      }
      const val = esc(item[f.key]);
      const inputHtml = f.type === 'textarea'
        ? `<textarea class="f-input" data-k="${f.key}">${item[f.key] || ''}</textarea>`
        : `<input class="f-input" type="${f.type || 'text'}" data-k="${f.key}" value="${val}" placeholder="${f.placeholder || ''}" />`;
      const field = el(`<div class="field ${f.span2 ? 'span-2' : ''}"><label>${f.label}</label>${inputHtml}</div>`);
      field.querySelector('[data-k]').addEventListener('input', (e) => {
        let v = e.target.value;
        if (f.type === 'number') v = v === '' ? 0 : Number(v);
        item[f.key] = v;
        if (f.key === 'dateISO' && v) {
          const pretty = formatDateISO(v);
          item.date = pretty;
          const dateInput = grid.querySelector('[data-k="date"]');
          if (dateInput) dateInput.value = pretty;
        }
        if (opts.onChange) opts.onChange();
        refreshTitle();
      });
      grid.appendChild(field);
    });
    card.querySelector('.repeat-card__remove').addEventListener('click', () => {
      items.splice(idx, 1);
      renderRepeatList(containerEl, items, fields, opts);
    });
    containerEl.appendChild(card);
  });
}

const FIELD_SCHEMAS = {
  flight: [
    { key: 'airline', label: 'Airline', type: 'select-other', options: AIRLINE_OPTIONS },
    { key: 'flightNumber', label: 'Flight Number' },
    { key: 'from', label: 'From', type: 'select-other', options: AIRPORT_OPTIONS },
    { key: 'to', label: 'To', type: 'select-other', options: AIRPORT_OPTIONS },
    { key: 'route', label: 'Route (auto-filled from From/To — still editable)', span2: true, placeholder: 'Nairobi (NBO) → Entebbe (EBB)' },
    { key: 'dateISO', label: 'Date (drives calendar & Next Event)', type: 'date' },
    { key: 'date', label: 'Date (display, auto-filled)', placeholder: '20 Jul 2026' },
    { key: 'departure', label: 'Departure' }, { key: 'arrival', label: 'Arrival' },
    { key: 'class', label: 'Class' }, { key: 'seat', label: 'Seat' }, { key: 'pnr', label: 'PNR' },
    { key: 'document', label: 'Document (local path or full URL)', span2: true, placeholder: 'documents/boarding-pass.pdf  or  https://drive.google.com/...' }
  ],
  hotel: [
    { key: 'name', label: 'Hotel Name', span2: true }, { key: 'address', label: 'Address', span2: true },
    { key: 'checkIn', label: 'Check-in' }, { key: 'checkOut', label: 'Check-out' },
    { key: 'room', label: 'Room Type' }, { key: 'confirmation', label: 'Confirmation No.' },
    { key: 'mapQuery', label: 'Map Search Query', span2: true },
    { key: 'document', label: 'Document (local path or full URL)', span2: true, placeholder: 'documents/hotel-confirmation.pdf  or  https://drive.google.com/...' }
  ],
  meeting: [
    { key: 'title', label: 'Title', span2: true }, { key: 'with', label: 'With' }, { key: 'date', label: 'Date / Time' },
    { key: 'location', label: 'Location', span2: true },
    { key: 'document', label: 'Document (local path or full URL)', span2: true, placeholder: 'documents/meeting-brief.pdf  or  https://drive.google.com/...' }
  ],
  transport: [
    { key: 'type', label: 'Type', span2: true, placeholder: 'Airport Transfer' },
    { key: 'driver', label: 'Driver Name' }, { key: 'phone', label: 'Phone' },
    { key: 'vehicle', label: 'Vehicle', span2: true }, { key: 'notes', label: 'Notes', span2: true, type: 'textarea' }
  ],
  contact: [
    { key: 'name', label: 'Name' }, { key: 'company', label: 'Company' }, { key: 'role', label: 'Role' },
    { key: 'phone', label: 'Phone', placeholder: '+254711223456' }, { key: 'whatsapp', label: 'WhatsApp', placeholder: '254711223456' },
    { key: 'email', label: 'Email', span2: true }
  ],
  map: [
    { key: 'category', label: 'Category', placeholder: 'Airport / Hotel / Meeting / Restaurant' },
    { key: 'name', label: 'Name', span2: true }, { key: 'address', label: 'Address', span2: true },
    { key: 'query', label: 'Map Search Query', span2: true }
  ],
  expenseItem: [
    { key: 'date', label: 'Date' }, { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description', span2: true }, { key: 'amount', label: 'Amount', type: 'number' }
  ],
  attachment: [
    { key: 'name', label: 'Attachment Name', span2: true },
    { key: 'file', label: 'File (local path or full URL)', span2: true, placeholder: 'documents/file.pdf  or  https://drive.google.com/...' }
  ]
};

function renderSimpleSections() {
  renderRepeatList(document.getElementById('flightsList'), currentTrip.flights, FIELD_SCHEMAS.flight,
    { title: (i) => `${i.airline || 'Flight'} ${i.flightNumber || ''}`.trim() || 'New Flight', emptyText: 'No flights added.', onChange: refreshNeCopyFromFlightOptions });
  refreshNeCopyFromFlightOptions();

  renderRepeatList(document.getElementById('hotelsList'), currentTrip.hotels, FIELD_SCHEMAS.hotel,
    { title: (i) => i.name || 'New Hotel', emptyText: 'No hotels added.' });

  renderRepeatList(document.getElementById('meetingsList'), currentTrip.meetings, FIELD_SCHEMAS.meeting,
    { title: (i) => i.title || 'New Meeting', emptyText: 'No meetings added.' });

  renderRepeatList(document.getElementById('transportList'), currentTrip.transport, FIELD_SCHEMAS.transport,
    { title: (i) => i.type || 'New Transport', emptyText: 'No transport added.' });

  renderRepeatList(document.getElementById('contactsList'), currentTrip.contacts, FIELD_SCHEMAS.contact,
    { title: (i) => i.name || 'New Contact', emptyText: 'No contacts added.' });

  renderRepeatList(document.getElementById('mapsList'), currentTrip.maps, FIELD_SCHEMAS.map,
    { title: (i) => i.name || 'New Place', emptyText: 'No map pins added.' });

  renderRepeatList(document.getElementById('expensesList'), currentTrip.expenses.items, FIELD_SCHEMAS.expenseItem,
    { title: (i) => i.description || 'New Expense', emptyText: 'No expenses logged.' });
}

/* ---------------- Itinerary (days → events) ---------------- */

function renderItinerary() {
  const wrap = document.getElementById('itineraryList');
  wrap.innerHTML = '';
  if (!currentTrip.itinerary.length) {
    wrap.appendChild(el(`<div class="empty-hint">No itinerary days yet. Click "+ Add Day" to start.</div>`));
  }
  currentTrip.itinerary.forEach((day, dIdx) => {
    const dayCard = el(`
      <div class="day-card">
        <div class="day-card__head">
          <div class="field-inline">
            <input class="f-input" data-k="day" type="number" value="${esc(day.day)}" placeholder="Day #" style="max-width:70px" />
            <input class="f-input" data-k="dateISO" type="date" value="${esc(day.dateISO || '')}" style="max-width:150px" title="Drives the calendar & Next Event" />
            <input class="f-input" data-k="date" value="${esc(day.date)}" placeholder="Mon, 20 Jul 2026 (auto-filled)" />
            <input class="f-input" data-k="city" value="${esc(day.city)}" placeholder="City / Route" />
          </div>
          <button class="repeat-card__remove" type="button">Remove Day</button>
        </div>
        <div class="events-wrap"></div>
        <button class="btn btn-outline btn-sm" type="button">+ Add Event</button>
      </div>`);

    dayCard.querySelectorAll('[data-k]').forEach(inp => {
      inp.addEventListener('input', () => {
        const key = inp.dataset.k;
        day[key] = inp.type === 'number' ? Number(inp.value) : inp.value;
        if (key === 'dateISO' && inp.value) {
          day.date = formatDateISO(inp.value);
          const dateTextInput = dayCard.querySelector('[data-k="date"]');
          if (dateTextInput) dateTextInput.value = day.date;
        }
      });
    });
    dayCard.querySelector('.repeat-card__remove').addEventListener('click', () => {
      currentTrip.itinerary.splice(dIdx, 1);
      renderItinerary();
    });
    dayCard.querySelector('.btn-outline').addEventListener('click', () => {
      day.events.push({ time: '', title: '', type: 'meeting', location: '', contact: '', notes: '', attachments: [], mapQuery: '' });
      renderEvents(dayCard.querySelector('.events-wrap'), day.events);
    });

    renderEvents(dayCard.querySelector('.events-wrap'), day.events);
    wrap.appendChild(dayCard);
  });
}

function renderEvents(container, events) {
  container.innerHTML = '';
  events.forEach((ev, eIdx) => {
    const card = el(`
      <div class="event-card">
        <div class="repeat-card__head">
          <span class="repeat-card__title">${ev.time || '--:--'} · ${ev.title || 'New Event'}</span>
          <button class="repeat-card__remove" type="button">Remove</button>
        </div>
        <div class="form-grid cols-3">
          <div class="field"><label>Time</label><input class="f-input" data-k="time" value="${esc(ev.time)}" placeholder="09:30" /></div>
          <div class="field span-2"><label>Title</label><input class="f-input" data-k="title" value="${esc(ev.title)}" /></div>
          <div class="field"><label>Type</label>
            <select class="f-input" data-k="type">
              ${['flight','transport','meeting','dining','hotel','other'].map(t => `<option value="${t}" ${ev.type===t?'selected':''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="field span-2"><label>Location</label><input class="f-input" data-k="location" value="${esc(ev.location)}" /></div>
          <div class="field"><label>Contact</label><input class="f-input" data-k="contact" value="${esc(ev.contact)}" /></div>
          <div class="field span-2"><label>Map Search Query</label><input class="f-input" data-k="mapQuery" value="${esc(ev.mapQuery)}" /></div>
          <div class="field span-2"><label>Notes</label><textarea class="f-input" data-k="notes">${ev.notes || ''}</textarea></div>
        </div>
        <h4 style="margin-top:14px;">Attachments</h4>
        <div class="attachments-wrap"></div>
        <button class="btn btn-outline btn-sm" type="button">+ Add Attachment</button>
      </div>`);

    card.querySelectorAll('[data-k]').forEach(inp => {
      inp.addEventListener('input', () => {
        ev[inp.dataset.k] = inp.value;
        card.querySelector('.repeat-card__title').textContent = `${ev.time || '--:--'} · ${ev.title || 'New Event'}`;
      });
      if (inp.tagName === 'SELECT') inp.addEventListener('change', () => { ev.type = inp.value; });
    });
    card.querySelector('.repeat-card__remove').addEventListener('click', () => {
      events.splice(eIdx, 1);
      renderEvents(container, events);
    });
    card.querySelector('.btn-outline').addEventListener('click', () => {
      if (!ev.attachments) ev.attachments = [];
      ev.attachments.push({ name: '', file: '' });
      renderRepeatList(card.querySelector('.attachments-wrap'), ev.attachments, FIELD_SCHEMAS.attachment,
        { title: (a) => a.name || 'Attachment', emptyText: 'No attachments.' });
    });

    renderRepeatList(card.querySelector('.attachments-wrap'), ev.attachments || (ev.attachments = []), FIELD_SCHEMAS.attachment,
      { title: (a) => a.name || 'Attachment', emptyText: 'No attachments.' });

    container.appendChild(card);
  });
}

/* ---------------- Documents (category → files) ---------------- */

function renderDocuments() {
  const wrap = document.getElementById('docsList');
  wrap.innerHTML = '';
  const cats = Object.keys(currentTrip.documents);
  if (!cats.length) {
    wrap.appendChild(el(`<div class="empty-hint">No document categories yet.</div>`));
  }
  cats.forEach((catName) => {
    const files = currentTrip.documents[catName];
    const card = el(`
      <div class="doc-cat-card">
        <div class="doc-cat-card__head">
          <input class="f-input" value="${esc(catName)}" data-role="catname" />
          <button class="repeat-card__remove" type="button">Remove Category</button>
        </div>
        <div class="doc-files"></div>
        <button class="btn btn-outline btn-sm" type="button">+ Add Document</button>
      </div>`);

    const renderFiles = () => {
      const filesWrap = card.querySelector('.doc-files');
      filesWrap.innerHTML = '';
      if (!files.length) filesWrap.appendChild(el(`<div class="empty-hint">No documents in this category.</div>`));
      files.forEach((f, fIdx) => {
        const row = el(`<div class="doc-item-row">
          <input class="f-input" placeholder="Document name" value="${esc(f.name)}" data-role="name" />
          <input class="f-input" placeholder="documents/file.pdf or https://drive.google.com/..." value="${esc(f.file)}" data-role="file" />
          <button class="repeat-card__remove" type="button">Remove</button>
        </div>`);
        row.querySelector('[data-role="name"]').addEventListener('input', (e) => { f.name = e.target.value; });
        row.querySelector('[data-role="file"]').addEventListener('input', (e) => { f.file = e.target.value; });
        row.querySelector('.repeat-card__remove').addEventListener('click', () => { files.splice(fIdx, 1); renderFiles(); });
        filesWrap.appendChild(row);
      });
    };

    card.querySelector('[data-role="catname"]').addEventListener('change', (e) => {
      const newName = e.target.value.trim();
      if (!newName || newName === catName) { e.target.value = catName; return; }
      if (currentTrip.documents[newName]) { showToast('A category with that name already exists.'); e.target.value = catName; return; }
      const ordered = {};
      Object.keys(currentTrip.documents).forEach(k => { ordered[k === catName ? newName : k] = currentTrip.documents[k]; });
      currentTrip.documents = ordered;
      renderDocuments();
    });
    card.querySelector('.doc-cat-card__head .repeat-card__remove').addEventListener('click', () => {
      delete currentTrip.documents[catName];
      renderDocuments();
    });
    card.querySelector('.doc-cat-card > .btn-outline').addEventListener('click', () => {
      files.push({ name: '', file: '' });
      renderFiles();
    });

    renderFiles();
    wrap.appendChild(card);
  });
}

/* ---------------- Checklist editor (trip) ---------------- */

function migrateChecklist(trip) {
  if (Array.isArray(trip.checklist)) return trip.checklist;
  const s = trip.status || {};
  return [
    { id: 'c1', label: 'Documents Ready', done: !!s.documentsReady },
    { id: 'c2', label: 'Hotels Confirmed', done: !!s.hotelsConfirmed },
    { id: 'c3', label: 'Transport Arranged', done: !!s.transportArranged }
  ];
}

function renderChecklist() {
  const wrap = document.getElementById('checklistList');
  wrap.innerHTML = '';
  if (!currentTrip.checklist.length) {
    wrap.appendChild(el(`<div class="empty-hint">No checklist items yet.</div>`));
  }
  currentTrip.checklist.forEach((item, idx) => {
    const row = el(`<div class="checklist-editor-row">
      <input type="checkbox" ${item.done ? 'checked' : ''} data-role="done" />
      <input type="text" class="f-input" value="${esc(item.label)}" placeholder="Checklist item" data-role="label" />
      <button class="repeat-card__remove" type="button">Remove</button>
    </div>`);
    row.querySelector('[data-role="done"]').addEventListener('change', (e) => { item.done = e.target.checked; });
    row.querySelector('[data-role="label"]').addEventListener('input', (e) => { item.label = e.target.value; });
    row.querySelector('.repeat-card__remove').addEventListener('click', () => {
      currentTrip.checklist.splice(idx, 1);
      renderChecklist();
    });
    wrap.appendChild(row);
  });
}

/* ---------------- Executive-select dropdown (used inside trip editor) ---------------- */

function refreshNeCopyFromFlightOptions() {
  const sel = document.getElementById('ne_copy_from_flight');
  if (!sel || !currentTrip) return;
  const flights = currentTrip.flights || [];
  const prev = sel.value;
  sel.innerHTML = '<option value="">— Select a flight below to copy from —</option>' +
    flights.map((fl, i) => {
      const route = fl.route || (fl.from && fl.to ? `${shortLabel(fl.from)} → ${shortLabel(fl.to)}` : 'no route yet');
      return `<option value="${i}">${esc(fl.airline || 'Flight')} ${esc(fl.flightNumber || '')} — ${esc(route)}</option>`;
    }).join('');
  if (prev && Number(prev) < flights.length) sel.value = prev;
}

async function populateExecutiveSelect(selectedExecId) {
  const sel = document.getElementById('f_execId');
  const execs = await loadExecutivesList();
  sel.innerHTML = '<option value="">— Not linked to an executive profile —</option>' +
    execs.map(e => `<option value="${esc(e.execId)}" ${e.execId === selectedExecId ? 'selected' : ''}>${esc(e.name)} — ${esc(e.position || '')}</option>`).join('');
}

/* ---------------- Editor: load / bind / save (Trip) ---------------- */

async function openEditorWithTrip(trip, isNew) {
  currentTrip = trip;
  currentIsNew = !!isNew;
  if (!currentTrip.expenses) currentTrip.expenses = { currency: 'USD', perDiem: 0, items: [] };
  if (!currentTrip.documents) currentTrip.documents = {};
  if (!currentTrip.meta.stage) currentTrip.meta.stage = 'upcoming';
  currentTrip.checklist = migrateChecklist(currentTrip);

  if (isNew && !currentTrip.traveller.tripId) {
    currentTrip.traveller.tripId = newTripId(currentTrip.traveller.name || 'trip');
  }

  document.getElementById('editorHeading').textContent = isNew ? 'New Trip' : `Edit — ${trip.traveller.name || trip.traveller.tripId}`;

  const f = (id) => document.getElementById(id);
  f('f_tripId').value = trip.traveller.tripId || '';
  document.getElementById('regenTripIdBtn').style.display = isNew ? '' : 'none';
  f('f_stage').value = trip.meta.stage;
  f('f_zone').value = trip.traveller.zone || '';
  await populateExecutiveSelect(trip.traveller.execId || '');
  f('f_tripName').value = trip.meta.tripName || '';
  f('f_companyName').value = trip.meta.companyName || 'EFL Global';
  f('f_travellerName').value = trip.traveller.name || '';
  f('f_position').value = trip.traveller.position || '';
  f('f_initials').value = trip.traveller.photoInitials || '';
  f('f_destination').value = trip.traveller.destination || '';
  f('f_dates').value = trip.traveller.dates || '';

  const ne = trip.nextEvent || {};
  setSelectOtherPair(f('ne_airline_select'), f('ne_airline_other'), ne.airline || '', AIRLINE_OPTIONS);
  f('ne_flightNumber').value = ne.flightNumber || '';
  f('ne_status').value = ne.status || 'On Time';
  setSelectOtherPair(f('ne_from_select'), f('ne_from_other'), ne.from || '', AIRPORT_OPTIONS);
  setSelectOtherPair(f('ne_to_select'), f('ne_to_other'), ne.to || '', AIRPORT_OPTIONS);
  f('ne_route').value = ne.route || '';
  f('ne_dateISO').value = ne.dateISO || '';
  f('ne_date').value = ne.date || '';
  f('ne_departure').value = ne.departure || '';
  f('ne_arrival').value = ne.arrival || '';
  f('ne_terminal').value = ne.terminal || '';
  f('ne_gate').value = ne.gate || '';
  f('ne_seat').value = ne.seat || '';

  f('exp_currency').value = trip.expenses.currency || 'USD';
  f('exp_perDiem').value = trip.expenses.perDiem || 0;

  renderChecklist();
  renderItinerary();
  renderSimpleSections();
  renderDocuments();
  updatePolicyHints();

  showView('editor');
  document.getElementById('topnavTitle').textContent = isNew ? 'New Trip' : 'Edit Trip';
  window.scrollTo({ top: 0 });
}

async function openEditor(id) {
  try {
    const trip = await loadTripById(id);
    await openEditorWithTrip(trip, false);
  } catch (e) {
    showToast('Could not load that trip.');
  }
}

function collectBasicFieldsIntoTrip() {
  const f = (id) => document.getElementById(id);
  currentTrip.traveller.tripId = f('f_tripId').value.trim() || newTripId(f('f_travellerName').value);
  currentTrip.meta.stage = f('f_stage').value;
  currentTrip.traveller.execId = f('f_execId').value || '';
  currentTrip.meta.tripName = f('f_tripName').value;
  currentTrip.meta.companyName = f('f_companyName').value || 'EFL Global';
  currentTrip.traveller.name = f('f_travellerName').value;
  currentTrip.traveller.position = f('f_position').value;
  currentTrip.traveller.photoInitials = f('f_initials').value || initials(f('f_travellerName').value);
  currentTrip.traveller.destination = f('f_destination').value;
  currentTrip.traveller.zone = f('f_zone').value;
  currentTrip.traveller.dates = f('f_dates').value;

  const neAirline = getSelectOtherValue(f('ne_airline_select'), f('ne_airline_other'));
  const neFrom = getSelectOtherValue(f('ne_from_select'), f('ne_from_other'));
  const neTo = getSelectOtherValue(f('ne_to_select'), f('ne_to_other'));
  const hasNextEvent = neAirline || f('ne_flightNumber').value || f('ne_route').value;
  currentTrip.nextEvent = hasNextEvent ? {
    type: 'flight',
    airline: neAirline, flightNumber: f('ne_flightNumber').value, status: f('ne_status').value,
    route: f('ne_route').value, from: neFrom, to: neTo, dateISO: f('ne_dateISO').value, date: f('ne_date').value, departure: f('ne_departure').value, arrival: f('ne_arrival').value,
    terminal: f('ne_terminal').value, gate: f('ne_gate').value, seat: f('ne_seat').value
  } : null;

  // Keep legacy `status` booleans in sync from the checklist for any code that still reads it.
  currentTrip.status = {
    documentsReady: currentTrip.checklist.some(c => /document/i.test(c.label) && c.done),
    hotelsConfirmed: currentTrip.checklist.some(c => /hotel/i.test(c.label) && c.done),
    transportArranged: currentTrip.checklist.some(c => /transport/i.test(c.label) && c.done)
  };

  currentTrip.expenses.currency = f('exp_currency').value || 'USD';
  currentTrip.expenses.perDiem = Number(f('exp_perDiem').value) || 0;
}

function saveTrip() {
  collectBasicFieldsIntoTrip();
  if (!currentTrip.traveller.name.trim()) { showToast('Traveller name is required.'); return; }
  currentTrip.meta.generatedOn = new Date().toISOString().slice(0, 10);

  const id = currentTrip.traveller.tripId;
  localStorage.setItem(tripDataKey(id), JSON.stringify(currentTrip));
  upsertIndexEntry(currentTrip);
  currentIsNew = false;
  showToast('Saved to this browser — instantly visible in the portal preview. Download JSON to make it permanent.');
  document.getElementById('editorHeading').textContent = `Edit — ${currentTrip.traveller.name}`;
  document.getElementById('f_tripId').readOnly = true;
}

/* ---------------- View: Executives list ---------------- */

async function renderExecutivesList() {
  const grid = document.getElementById('execGrid');
  grid.innerHTML = '<div class="empty-hint">Loading executives…</div>';
  const execs = await loadExecutivesList(true);

  if (!execs.length) {
    grid.innerHTML = `<div class="empty-hint">No executives yet. Click <strong>+ New Executive</strong> to add the first profile.</div>`;
    return;
  }

  const idx = await loadTripsIndex();
  const cards = await Promise.all(execs.map(async (exec) => {
    const tripCount = (await tripsForExecutive(exec)).length;
    return `
      <div class="exec-card" data-id="${esc(exec.execId)}">
        <div class="exec-card__top">
          <div class="exec-card__avatar">${initials(exec.name)}</div>
          <div>
            <div class="exec-card__name">${exec.name || '(unnamed)'}</div>
            <div class="exec-card__role">${exec.position || ''}</div>
            <div class="exec-card__dept">${exec.department || ''}</div>
          </div>
        </div>
        <div class="exec-card__meta">
          <div>${exec.email || 'No email on file'}</div>
          <div>${exec.phone || ''}</div>
        </div>
        <span class="exec-card__badge">${tripCount} trip${tripCount === 1 ? '' : 's'}</span>
        <div class="exec-card__actions">
          <button class="btn btn-primary btn-sm" data-act="view">View Profile</button>
          <button class="btn btn-outline btn-sm" data-act="download">Download</button>
          <button class="btn btn-ghost btn-sm" data-act="delete">Delete</button>
        </div>
      </div>`;
  }));
  grid.innerHTML = cards.join('');

  grid.querySelectorAll('.exec-card').forEach(card => {
    const id = card.dataset.id;
    card.querySelector('[data-act="view"]').addEventListener('click', () => openExecEditor(id));
    card.querySelector('[data-act="download"]').addEventListener('click', async () => {
      const e = await loadExecutiveById(id);
      download(`${id}.json`, JSON.stringify(e, null, 2));
    });
    card.querySelector('[data-act="delete"]').addEventListener('click', () => {
      const name = card.querySelector('.exec-card__name').textContent;
      if (!confirm(`Delete executive "${name}"? This does not delete their past trips.`)) return;
      deleteExecutive(id);
      showToast('Executive deleted from this browser.');
      renderExecutivesList();
    });
  });
}

/* ---------------- Executive profile editor ---------------- */

async function openExecEditorWithData(exec, isNew) {
  currentExec = exec;
  currentExecIsNew = !!isNew;

  document.getElementById('execEditorHeading').textContent = isNew ? 'New Executive' : `Edit — ${exec.name || exec.execId}`;
  document.getElementById('execProfileAvatar').textContent = initials(exec.name) || '—';
  document.getElementById('execProfileName').textContent = exec.name || 'New Executive';
  document.getElementById('execProfileRole').textContent = exec.position || '';
  document.getElementById('execProfileDept').textContent = exec.department || '';

  const f = (id) => document.getElementById(id);
  f('ex_execId').value = exec.execId || '';
  f('ex_execId').readOnly = !isNew;
  f('ex_execId').title = isNew ? '' : 'Executive ID cannot be changed after creation.';
  f('ex_department').value = exec.department || '';
  f('ex_name').value = exec.name || '';
  f('ex_position').value = exec.position || '';
  f('ex_tier').value = exec.tier || '';
  f('ex_initials').value = exec.photoInitials || '';
  f('ex_nationality').value = exec.nationality || '';
  f('ex_email').value = exec.email || '';
  f('ex_phone').value = exec.phone || '';
  f('ex_notes').value = exec.notes || '';

  document.getElementById('execNewTripBtn').style.display = isNew ? 'none' : '';
  const tripsWrap = document.getElementById('execTripsList');
  if (isNew) {
    tripsWrap.innerHTML = `<div class="empty-hint">Save this executive first to attach trips.</div>`;
  } else {
    tripsWrap.innerHTML = `<div class="empty-hint">Loading trips…</div>`;
    const trips = await tripsForExecutive(exec);
    if (!trips.length) {
      tripsWrap.innerHTML = `<div class="empty-hint">No trips yet for ${esc(exec.name)}.</div>`;
    } else {
      tripsWrap.innerHTML = trips.map(t => `
        <div class="exec-trip-row" data-id="${esc(t.traveller.tripId)}">
          <div class="exec-trip-row__icon">${ICON_PLANE}</div>
          <div>
            <div class="exec-trip-row__name">${esc(t.meta.tripName || t.traveller.destination)}</div>
            <div class="exec-trip-row__meta">${esc(t.traveller.destination)} · ${esc(t.traveller.dates)}</div>
          </div>
          <div class="exec-trip-row__actions">
            <button class="btn btn-outline btn-sm" data-act="edit">Edit</button>
          </div>
        </div>`).join('');
      tripsWrap.querySelectorAll('.exec-trip-row').forEach(row => {
        row.querySelector('[data-act="edit"]').addEventListener('click', () => { editorOrigin = 'executives'; openEditor(row.dataset.id); });
      });
    }
  }

  showView('exec-editor');
  document.getElementById('topnavTitle').textContent = isNew ? 'New Executive' : 'Executive Profile';
  window.scrollTo({ top: 0 });
}

async function openExecEditor(id) {
  try {
    const exec = await loadExecutiveById(id);
    await openExecEditorWithData(exec, false);
  } catch (e) {
    showToast('Could not load that executive.');
  }
}

function collectExecFields() {
  const f = (id) => document.getElementById(id);
  currentExec.execId = f('ex_execId').value.trim() || newExecId(f('ex_name').value);
  currentExec.department = f('ex_department').value;
  currentExec.name = f('ex_name').value;
  currentExec.position = f('ex_position').value;
  currentExec.tier = f('ex_tier').value;
  currentExec.photoInitials = f('ex_initials').value || initials(f('ex_name').value);
  currentExec.nationality = f('ex_nationality').value;
  currentExec.email = f('ex_email').value;
  currentExec.phone = f('ex_phone').value;
  currentExec.notes = f('ex_notes').value;
}

async function saveExec() {
  collectExecFields();
  if (!currentExec.name.trim()) { showToast('Executive name is required.'); return; }
  upsertExecutive(currentExec);
  currentExecIsNew = false;
  showToast('Executive saved to this browser. Download JSON to make it permanent.');
  await openExecEditorWithData(currentExec, false);
}

/* ---------------- Init ---------------- */

const ICON_PLANE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.5 3.5l7 7-3.5 1.4-3.9-2.5-2.1 2.1 1.6 3-1.4 1.4-3-3.6-3.6-3 1.4-1.4 3 1.6 2.1-2.1-2.5-3.9 1.4-3.5z"/></svg>';

function openSidebar() { document.getElementById('sidebar').classList.add('open'); document.getElementById('sidebarOverlay').classList.add('open'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebarOverlay').classList.remove('open'); }

const VIEW_IDS = { dashboard: 'view-dashboard', list: 'view-list', editor: 'view-editor', executives: 'view-executives', 'exec-editor': 'view-exec-editor', settings: 'view-settings' };
const VIEW_TITLES_ADMIN = { dashboard: 'Dashboard', list: 'Trips', editor: 'Edit Trip', executives: 'Executives', 'exec-editor': 'Executive Profile', settings: 'Settings' };

function activeTabFor(name) {
  if (name === 'editor') return editorOrigin === 'dashboard' ? 'dashboard' : editorOrigin === 'executives' ? 'executives' : 'list';
  if (name === 'exec-editor') return 'executives';
  return name;
}

function showView(name) {
  Object.values(VIEW_IDS).forEach(id => { document.getElementById(id).hidden = true; });
  document.getElementById(VIEW_IDS[name]).hidden = false;
  document.getElementById('topnavTitle').textContent = VIEW_TITLES_ADMIN[name];
  document.getElementById('backBtn').classList.toggle('hidden', !(name === 'editor' || name === 'exec-editor'));
  const activeTab = activeTabFor(name);
  document.querySelectorAll('.sidebar-link[data-view]').forEach(l => l.classList.toggle('active', l.dataset.view === activeTab));
  currentView = name;
  closeSidebar();
}

function backToDashboard() { showView('dashboard'); renderDashboard(); }
function backToList() {
  currentTrip = null;
  showView('list');
  renderTripsList();
}
function backToExecutives() {
  currentExec = null;
  showView('executives');
  renderExecutivesList();
}
function goToSettings() { showView('settings'); }

function goBackFromEditor() {
  currentTrip = null;
  if (editorOrigin === 'dashboard') backToDashboard();
  else if (editorOrigin === 'executives') backToExecutives();
  else backToList();
}
function handleBackClick() {
  if (currentView === 'exec-editor') backToExecutives();
  else if (currentView === 'editor') goBackFromEditor();
  else backToList();
}


function init() {
  loadPolicyData();

  document.getElementById('menuBtn').addEventListener('click', openSidebar);
  document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);
  document.getElementById('backBtn').addEventListener('click', handleBackClick);
  document.querySelector('.sidebar-link[data-view="dashboard"]').addEventListener('click', backToDashboard);
  document.querySelector('.sidebar-link[data-view="list"]').addEventListener('click', backToList);
  document.querySelector('.sidebar-link[data-view="executives"]').addEventListener('click', backToExecutives);
  document.querySelector('.sidebar-link[data-view="settings"]').addEventListener('click', goToSettings);

  document.getElementById('newTripBtn').addEventListener('click', () => { editorOrigin = 'list'; openEditorWithTrip(blankTrip(), true); });
  document.getElementById('newExecBtn').addEventListener('click', () => openExecEditorWithData(blankExecutive(), true));

  document.getElementById('downloadIndexBtn').addEventListener('click', async () => {
    const idx = await loadTripsIndex();
    const trips = await Promise.all(idx.trips.map(async (entry) => {
      try {
        const t = await loadTripById(entry.tripId, entry.file);
        return {
          tripId: t.traveller.tripId, file: `data/trips/${t.traveller.tripId}.json`,
          travellerName: t.traveller.name, position: t.traveller.position,
          destination: t.traveller.destination, dates: t.traveller.dates,
          status: (t.meta && t.meta.stage) || 'upcoming'
        };
      } catch (e) { return entry; }
    }));
    const out = { defaultTripId: localStorage.getItem(LS_ACTIVE) || idx.defaultTripId, trips };
    download('trips-index.json', JSON.stringify(out, null, 2));
    showToast("Downloaded the full trips-index.json — replace the copy in your repo's data/ folder.");
  });

  document.getElementById('downloadExecIndexBtn').addEventListener('click', async () => {
    const execs = await loadExecutivesList(true);
    download('executives-index.json', JSON.stringify(execs, null, 2));
    showToast("Downloaded the full executives-index.json — replace the copy in your repo's data/ folder.");
  });

  // Next Event: populate the airline/airport dropdowns once, wire "Other" toggling and route auto-fill.
  const neAirlineSelect = document.getElementById('ne_airline_select');
  const neAirlineOther = document.getElementById('ne_airline_other');
  const neFromSelect = document.getElementById('ne_from_select');
  const neFromOther = document.getElementById('ne_from_other');
  const neToSelect = document.getElementById('ne_to_select');
  const neToOther = document.getElementById('ne_to_other');
  neAirlineSelect.innerHTML = selectOtherOptionsHtml(AIRLINE_OPTIONS, '');
  neFromSelect.innerHTML = selectOtherOptionsHtml(AIRPORT_OPTIONS, '');
  neToSelect.innerHTML = selectOtherOptionsHtml(AIRPORT_OPTIONS, '');

  neAirlineSelect.addEventListener('change', () => { neAirlineOther.style.display = neAirlineSelect.value === OTHER_VALUE ? '' : 'none'; });

  document.getElementById('ne_dateISO').addEventListener('input', (e) => {
    if (e.target.value) document.getElementById('ne_date').value = formatDateISO(e.target.value);
  });

  const updateNeRoute = () => {
    const from = getSelectOtherValue(neFromSelect, neFromOther);
    const to = getSelectOtherValue(neToSelect, neToOther);
    if (from && to) document.getElementById('ne_route').value = `${shortLabel(from)} → ${shortLabel(to)}`;
  };
  neFromSelect.addEventListener('change', () => { neFromOther.style.display = neFromSelect.value === OTHER_VALUE ? '' : 'none'; updateNeRoute(); });
  neToSelect.addEventListener('change', () => { neToOther.style.display = neToSelect.value === OTHER_VALUE ? '' : 'none'; updateNeRoute(); });
  neFromOther.addEventListener('input', updateNeRoute);
  neToOther.addEventListener('input', updateNeRoute);

  document.getElementById('ne_copy_from_flight').addEventListener('change', (e) => {
    const idx = e.target.value;
    if (idx === '' || !currentTrip) return;
    const fl = currentTrip.flights[Number(idx)];
    if (!fl) return;
    setSelectOtherPair(neAirlineSelect, neAirlineOther, fl.airline || '', AIRLINE_OPTIONS);
    neAirlineOther.style.display = neAirlineSelect.value === OTHER_VALUE ? '' : 'none';
    setSelectOtherPair(neFromSelect, neFromOther, fl.from || '', AIRPORT_OPTIONS);
    neFromOther.style.display = neFromSelect.value === OTHER_VALUE ? '' : 'none';
    setSelectOtherPair(neToSelect, neToOther, fl.to || '', AIRPORT_OPTIONS);
    neToOther.style.display = neToSelect.value === OTHER_VALUE ? '' : 'none';
    document.getElementById('ne_flightNumber').value = fl.flightNumber || '';
    document.getElementById('ne_route').value = fl.route || '';
    document.getElementById('ne_dateISO').value = fl.dateISO || '';
    document.getElementById('ne_date').value = fl.date || '';
    document.getElementById('ne_departure').value = fl.departure || '';
    document.getElementById('ne_arrival').value = fl.arrival || '';
    document.getElementById('ne_seat').value = fl.seat || '';
    showToast('Next Event filled from that flight — terminal, gate and status still need your input.');
  });

  // Trip ID: system-generated. Regenerate button (new trips only) + live regeneration as the name is typed.
  document.getElementById('regenTripIdBtn').addEventListener('click', () => {
    if (!currentTrip) return;
    const id = newTripId(document.getElementById('f_travellerName').value || 'trip');
    currentTrip.traveller.tripId = id;
    document.getElementById('f_tripId').value = id;
  });
  document.getElementById('f_travellerName').addEventListener('input', (e) => {
    if (currentTrip && currentIsNew) {
      const id = newTripId(e.target.value || 'trip');
      currentTrip.traveller.tripId = id;
      document.getElementById('f_tripId').value = id;
    }
  });

  // Selecting an executive autofills the traveller fields (and regenerates the Trip ID for new trips).
  document.getElementById('f_execId').addEventListener('change', async (e) => {
    const execId = e.target.value;
    if (!execId || !currentTrip) return;
    try {
      const exec = await loadExecutiveById(execId);
      document.getElementById('f_travellerName').value = exec.name || '';
      document.getElementById('f_position').value = exec.position || '';
      document.getElementById('f_initials').value = exec.photoInitials || initials(exec.name);
      currentTrip.traveller.name = exec.name || '';
      currentTrip.traveller.position = exec.position || '';
      currentTrip.traveller.photoInitials = exec.photoInitials || initials(exec.name);
      if (currentIsNew) {
        const id = newTripId(exec.name || 'trip');
        currentTrip.traveller.tripId = id;
        document.getElementById('f_tripId').value = id;
      }
      showToast(`Autofilled traveller details from ${exec.name}.`);
    } catch (err) { /* profile not found — leave fields as-is */ }
    updatePolicyHints();
  });

  document.getElementById('f_zone').addEventListener('change', updatePolicyHints);

  const importFile = document.getElementById('importFile');
  document.getElementById('importBtn').addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const trip = JSON.parse(reader.result);
        if (!trip.traveller || !trip.traveller.tripId) trip.traveller.tripId = newTripId(trip.traveller?.name);
        editorOrigin = 'list';
        openEditorWithTrip(trip, false);
        showToast('Imported — review and Save to keep it.');
      } catch (err) { showToast('That file is not valid trip JSON.'); }
    };
    reader.readAsText(file);
    importFile.value = '';
  });

  document.getElementById('cancelEditBtn').addEventListener('click', goBackFromEditor);
  document.getElementById('saveTripBtn').addEventListener('click', saveTrip);
  document.getElementById('clearNextEventBtn').addEventListener('click', () => {
    ['ne_flightNumber','ne_route','ne_dateISO','ne_date','ne_departure','ne_arrival','ne_terminal','ne_gate','ne_seat'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('ne_status').value = 'On Time';
    setSelectOtherPair(neAirlineSelect, neAirlineOther, '', AIRLINE_OPTIONS);
    setSelectOtherPair(neFromSelect, neFromOther, '', AIRPORT_OPTIONS);
    setSelectOtherPair(neToSelect, neToOther, '', AIRPORT_OPTIONS);
    showToast('Next Event cleared — Save to apply.');
  });

  document.getElementById('addChecklistBtn').addEventListener('click', () => {
    currentTrip.checklist.push({ id: 'c' + Date.now(), label: '', done: false });
    renderChecklist();
  });

  document.getElementById('addDayBtn').addEventListener('click', () => {
    currentTrip.itinerary.push({ day: currentTrip.itinerary.length + 1, dateISO: '', date: '', city: '', events: [] });
    renderItinerary();
  });
  document.getElementById('addFlightBtn').addEventListener('click', () => { currentTrip.flights.push({ airline: '', flightNumber: '', from: '', to: '', route: '', dateISO: '', date: '', departure: '', arrival: '', class: 'Business', seat: '', pnr: '', document: '' }); renderSimpleSections(); });
  document.getElementById('addHotelBtn').addEventListener('click', () => { currentTrip.hotels.push({ name: '', address: '', checkIn: '', checkOut: '', room: '', confirmation: '', document: '', mapQuery: '' }); renderSimpleSections(); });
  document.getElementById('addMeetingBtn').addEventListener('click', () => { currentTrip.meetings.push({ title: '', with: '', date: '', location: '', document: '' }); renderSimpleSections(); });
  document.getElementById('addTransportBtn').addEventListener('click', () => { currentTrip.transport.push({ type: '', driver: '', phone: '', vehicle: '', notes: '' }); renderSimpleSections(); });
  document.getElementById('addContactBtn').addEventListener('click', () => { currentTrip.contacts.push({ name: '', company: '', role: '', phone: '', whatsapp: '', email: '' }); renderSimpleSections(); });
  document.getElementById('addMapBtn').addEventListener('click', () => { currentTrip.maps.push({ category: '', name: '', address: '', query: '' }); renderSimpleSections(); });
  document.getElementById('addExpenseBtn').addEventListener('click', () => { currentTrip.expenses.items.push({ date: '', category: '', description: '', amount: 0 }); renderSimpleSections(); });
  document.getElementById('addDocCatBtn').addEventListener('click', () => {
    let name = 'New Category', n = 1;
    while (currentTrip.documents[name]) { n++; name = `New Category ${n}`; }
    currentTrip.documents[name] = [];
    renderDocuments();
  });

  document.getElementById('openPortalBtn').addEventListener('click', () => {
    if (!currentTrip.traveller.tripId) { showToast('Save the trip first.'); return; }
    window.open(`index.html?trip=${encodeURIComponent(currentTrip.traveller.tripId)}`, '_blank');
  });
  document.getElementById('downloadBtn').addEventListener('click', () => {
    collectBasicFieldsIntoTrip();
    download(`${currentTrip.traveller.tripId || 'trip'}.json`, JSON.stringify(currentTrip, null, 2));
  });
  document.getElementById('setActiveBtn').addEventListener('click', () => {
    if (currentIsNew) { showToast('Save the trip first.'); return; }
    localStorage.setItem(LS_ACTIVE, currentTrip.traveller.tripId);
    showToast(`"${currentTrip.traveller.name}" is now the default trip shown in the portal.`);
  });
  document.getElementById('deleteTripBtn').addEventListener('click', () => {
    if (currentIsNew) { goBackFromEditor(); return; }
    const id = currentTrip.traveller.tripId;
    if (!confirm(`Delete "${currentTrip.traveller.name}"? This removes it from this browser.`)) return;
    localStorage.removeItem(tripDataKey(id));
    const removed = JSON.parse(localStorage.getItem(LS_REMOVED) || '[]');
    if (!removed.includes(id)) removed.push(id);
    localStorage.setItem(LS_REMOVED, JSON.stringify(removed));
    let extra = JSON.parse(localStorage.getItem(LS_EXTRA) || '[]').filter(t => t.tripId !== id);
    localStorage.setItem(LS_EXTRA, JSON.stringify(extra));
    if (localStorage.getItem(LS_ACTIVE) === id) localStorage.removeItem(LS_ACTIVE);
    showToast('Trip deleted.');
    goBackFromEditor();
  });

  // Executive editor bindings
  document.getElementById('cancelExecBtn').addEventListener('click', backToExecutives);
  document.getElementById('saveExecBtn').addEventListener('click', saveExec);
  document.getElementById('downloadExecBtn').addEventListener('click', () => {
    collectExecFields();
    download(`${currentExec.execId || 'executive'}.json`, JSON.stringify(currentExec, null, 2));
  });
  document.getElementById('deleteExecBtn').addEventListener('click', () => {
    if (currentExecIsNew) { backToExecutives(); return; }
    if (!confirm(`Delete executive "${currentExec.name}"? This does not delete their past trips.`)) return;
    deleteExecutive(currentExec.execId);
    showToast('Executive deleted.');
    backToExecutives();
  });
  document.getElementById('execNewTripBtn').addEventListener('click', () => {
    const t = blankTrip();
    t.traveller.execId = currentExec.execId;
    t.traveller.name = currentExec.name;
    t.traveller.position = currentExec.position;
    t.traveller.photoInitials = currentExec.photoInitials;
    editorOrigin = 'executives';
    openEditorWithTrip(t, true);
  });

  // Settings: export / import / reset
  document.getElementById('exportAllBtn').addEventListener('click', async () => {
    const idx = await loadTripsIndex();
    const trips = (await Promise.all(idx.trips.map(async (entry) => {
      try { return await loadTripById(entry.tripId, entry.file); } catch (e) { return null; }
    }))).filter(Boolean);
    const execs = await loadExecutivesList(true);
    const bundle = { exportedAt: new Date().toISOString(), executives: execs, trips };
    download(`efl-admin-export-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(bundle, null, 2));
    showToast(`Exported ${trips.length} trip(s) and ${execs.length} executive(s).`);
  });

  const importAllFile = document.getElementById('importAllFile');
  document.getElementById('importAllBtn').addEventListener('click', () => importAllFile.click());
  importAllFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const trips = Array.isArray(data) ? data : (data.trips || []);
        const execs = Array.isArray(data) ? [] : (data.executives || []);
        let tCount = 0, eCount = 0;
        trips.forEach(t => {
          if (!t.traveller || !t.traveller.tripId) return;
          localStorage.setItem(tripDataKey(t.traveller.tripId), JSON.stringify(t));
          upsertIndexEntry(t);
          tCount++;
        });
        execs.forEach(ex => {
          if (!ex.execId) return;
          upsertExecutive(ex);
          eCount++;
        });
        if (!tCount && !eCount) { showToast('No trips or executives found in that file.'); return; }
        showToast(`Imported ${tCount} trip(s) and ${eCount} executive(s).`);
        renderDashboard();
      } catch (err) { showToast('That file is not a valid export bundle.'); }
    };
    reader.readAsText(file);
    importAllFile.value = '';
  });

  document.getElementById('resetLocalBtn').addEventListener('click', () => {
    if (!confirm('Clear all local admin edits in this browser? Trips or executives only saved here (never downloaded) will be lost.')) return;
    Object.keys(localStorage)
      .filter(k => k.startsWith('efl-trip-data-') || k.startsWith('efl-exec-data-') || [LS_EXTRA, LS_REMOVED, LS_ACTIVE, LS_EXEC_EXTRA, LS_EXEC_REMOVED].includes(k))
      .forEach(k => localStorage.removeItem(k));
    EXEC_CACHE = null;
    showToast('Local admin edits cleared.');
    renderDashboard();
  });

  document.getElementById('toastClose').addEventListener('click', () => document.getElementById('toast').classList.remove('show'));

  showView('dashboard');
  renderDashboard();
}

document.addEventListener('DOMContentLoaded', init);
