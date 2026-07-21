/* ==========================================================================
   EFL GLOBAL — Executive Travel Portal
   All content is rendered dynamically from data/trip.json.
   To create a new trip, only trip.json needs to change.
   ========================================================================== */

const ICONS = {
  flight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.5 3.5l7 7-3.5 1.4-3.9-2.5-2.1 2.1 1.6 3-1.4 1.4-3-3.6-3.6-3 1.4-1.4 3 1.6 2.1-2.1-2.5-3.9 1.4-3.5z"/></svg>',
  hotel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21V8l7-4 7 4v13"/><path d="M3 12h18M9 21v-6h4v6"/></svg>',
  itinerary: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 3v3M16 3v3"/></svg>',
  meeting: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/></svg>',
  transport: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 13l1.5-5A2 2 0 0 1 6.4 6.5h11.2A2 2 0 0 1 19.5 8l1.5 5"/><rect x="2" y="13" width="20" height="6" rx="1.5"/><circle cx="6.5" cy="19.5" r="1.5"/><circle cx="17.5" cy="19.5" r="1.5"/></svg>',
  document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 20l-6-3V4l6 3 6-3 6 3v13l-6-3-6 3z"/><path d="M9 4v13M15 7v13"/></svg>',
  contact: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>',
  expense: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 1-3 2.3c0 3 6 1.4 6 4.3 0 1.4-1.3 2.4-3 2.4s-3-1-3-2.4"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l6 6L20 6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  person: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>',
  note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z" opacity="0"/><path d="M6 8h12M6 12h12M6 16h8"/></svg>',
  clip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.5V6a3 3 0 0 0-6 0v9a2 2 0 0 0 4 0V8"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/></svg>',
  call: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.9 2.2z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.1.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.1.2-.3.3-.4.1-.2 0-.3 0-.5s-.6-1.6-.9-2.1c-.2-.5-.5-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.3-.1-.1-.3-.2-.5-.3zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2z"/></svg>',
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>'
};

let TRIP = null;
let TRIP_ID = null;
let CACHE_ON = false;

/* ---------------- Utilities ---------------- */

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastText').textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 3800);
}

/* ---------------- Data load ----------------
   Resolution order for which trip to show:
   1. ?trip=<tripId> in the URL
   2. last trip opened on this device (localStorage 'efl-active-trip')
   3. defaultTripId from data/trips-index.json

   If the admin dashboard has saved a live edit for that trip
   (localStorage 'efl-trip-data-<tripId>'), that takes priority over the
   file on disk — this is what makes "Save" in admin.html instantly
   reflect in the portal for previewing before export/deploy.
---------------------------------------------- */

let TRIPS_INDEX = null;

// Wraps fetch with a hard timeout — on a flaky mobile connection a request
// can otherwise hang indefinitely, which would freeze the whole app on the
// splash screen since everything downstream is waiting on it.
async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

let LOAD_ERROR_DETAIL = null;

async function loadTrip() {
  LOAD_ERROR_DETAIL = null;
  try {
    const idxRes = await fetchWithTimeout('data/trips-index.json', { cache: 'no-store' });
    if (!idxRes.ok) throw new Error(`data/trips-index.json — ${idxRes.status} ${idxRes.statusText}`);
    const idx = await idxRes.json();
    TRIPS_INDEX = idx;

    const params = new URLSearchParams(window.location.search);
    const requested = params.get('trip');
    const remembered = localStorage.getItem('efl-active-trip');
    TRIP_ID = requested || remembered || idx.defaultTripId || (idx.trips[0] && idx.trips[0].tripId);

    const override = localStorage.getItem('efl-trip-data-' + TRIP_ID);
    if (override) {
      TRIP = JSON.parse(override);
      localStorage.setItem('efl-active-trip', TRIP_ID);
      return;
    }

    let entry = idx.trips.find(t => t.tripId === TRIP_ID);
    if (!entry) {
      // The remembered/requested trip isn't in the index — most likely stale
      // from an earlier local-only admin test. Fall back to the real
      // default trip instead of failing outright.
      const fallbackId = idx.defaultTripId || (idx.trips[0] && idx.trips[0].tripId);
      if (fallbackId && fallbackId !== TRIP_ID) {
        console.warn(`Trip "${TRIP_ID}" not found in trips-index.json — falling back to "${fallbackId}".`);
        TRIP_ID = fallbackId;
        entry = idx.trips.find(t => t.tripId === TRIP_ID);
      }
    }
    if (!entry && !idx.trips.length) throw new Error('trips-index.json has no trips listed.');
    const file = entry ? entry.file : `data/trips/${TRIP_ID}.json`;
    const res = await fetchWithTimeout(file, { cache: 'no-store' });
    if (!res.ok) throw new Error(`${file} — ${res.status} ${res.statusText}${!entry ? ' (Trip ID "' + TRIP_ID + '" was not found in trips-index.json — it may be stale from an earlier test.)' : ''}`);
    TRIP = await res.json();
    localStorage.setItem('efl-active-trip', TRIP_ID);
  } catch (err) {
    LOAD_ERROR_DETAIL = err.message || String(err);
    console.error('Failed to load trip data:', LOAD_ERROR_DETAIL);
    TRIP = null;
  }
}

// Other trips belonging to the same traveller (matched by name, since that's
// what stays in sync with the linked executive profile), so the portal can
// offer a switcher instead of only ever showing one trip at a time.
function getTripsForCurrentTraveller() {
  if (!TRIPS_INDEX || !TRIP) return [];
  const name = TRIP.traveller.name;
  return TRIPS_INDEX.trips
    .filter(t => t.travellerName === name)
    .sort((a, b) => (a.status === 'active' ? -1 : 1) - (b.status === 'active' ? -1 : 1));
}

function switchToTrip(tripId) {
  if (tripId === TRIP_ID) return;
  localStorage.setItem('efl-active-trip', tripId);
  window.location.href = window.location.pathname + '?trip=' + encodeURIComponent(tripId);
}

// Loads the FULL trip object (not just index metadata) for every trip
// belonging to the current traveller — used to power the live Next Event,
// the cross-trip Flights/Hotels/Contacts views, and the itinerary calendar.
// Cached per page load since it's used by several views.
let ALL_MY_TRIPS_CACHE = null;
async function loadAllTripsForTraveller() {
  if (ALL_MY_TRIPS_CACHE) return ALL_MY_TRIPS_CACHE;
  const entries = getTripsForCurrentTraveller();
  const trips = await Promise.all(entries.map(async (entry) => {
    try {
      const override = localStorage.getItem('efl-trip-data-' + entry.tripId);
      if (override) return JSON.parse(override);
      const res = await fetchWithTimeout(entry.file, { cache: 'no-store' });
      return await res.json();
    } catch (err) {
      console.warn('Could not load trip', entry.tripId, err);
      return null;
    }
  }));
  ALL_MY_TRIPS_CACHE = trips.filter(Boolean);
  if (!ALL_MY_TRIPS_CACHE.length && TRIP) ALL_MY_TRIPS_CACHE = [TRIP];
  return ALL_MY_TRIPS_CACHE;
}

// Turns a "YYYY-MM-DD" + "HH:MM" pair into a real Date, or null if unusable.
function toDateTime(dateISO, time) {
  if (!dateISO) return null;
  const d = new Date(`${dateISO}T${time && /^\d{2}:\d{2}/.test(time) ? time : '00:00'}:00`);
  return isNaN(d.getTime()) ? null : d;
}

// Scans every flight and itinerary event across ALL of this traveller's trips
// (not just the one currently open) and returns whichever is chronologically
// next from right now — so the Home card is always "live" regardless of
// which trip happens to be selected.
async function computeLiveNextEvent() {
  const trips = await loadAllTripsForTraveller();
  const now = new Date();
  const candidates = [];

  trips.forEach(trip => {
    (trip.flights || []).forEach(f => {
      const dt = toDateTime(f.dateISO, f.departure);
      if (dt) candidates.push({ kind: 'flight', dt, data: f, trip });
    });
    (trip.itinerary || []).forEach(day => {
      (day.events || []).forEach(ev => {
        const dt = toDateTime(day.dateISO, ev.time);
        if (dt) candidates.push({ kind: 'event', dt, data: ev, trip });
      });
    });
  });

  const upcoming = candidates.filter(c => c.dt >= now).sort((a, b) => a.dt - b.dt);
  return upcoming[0] || null;
}

async function renderNextEventCard() {
  const passCard = document.getElementById('nextEventCard');
  const live = await computeLiveNextEvent();

  if (live) {
    const fromOtherTrip = live.trip.traveller.tripId !== TRIP_ID;
    const tripTag = fromOtherTrip
      ? `<button class="pass-trip-tag" id="passTripSwitchBtn" data-id="${live.trip.traveller.tripId}">${ICONS.pin} via ${live.trip.traveller.destination} — switch trip</button>`
      : '';

    if (live.kind === 'flight') {
      const f = live.data;
      passCard.innerHTML = `
        <div class="pass-card__top">
          <div class="pass-eyebrow"><span class="dot"></span>${f.class || 'Confirmed'} · ${f.date || ''}</div>
          <div class="pass-route">
            <span class="pass-route__plane">${ICONS.flight}</span>
            <span class="pass-route__city">${f.route || ''}</span>
          </div>
          <div class="pass-flight-id">${f.airline || ''} ${f.flightNumber || ''}</div>
          ${tripTag}
        </div>
        <div class="pass-divider"></div>
        <div class="pass-card__bottom">
          <div><div class="pass-stat__label">Departure</div><div class="pass-stat__value">${f.departure || '—'}</div></div>
          <div><div class="pass-stat__label">Class</div><div class="pass-stat__value">${f.class || '—'}</div></div>
          <div><div class="pass-stat__label">Seat</div><div class="pass-stat__value">${f.seat || '—'}</div></div>
        </div>`;
    } else {
      const ev = live.data;
      passCard.innerHTML = `
        <div class="pass-card__top">
          <div class="pass-eyebrow"><span class="dot"></span>${(ev.type || 'Event')} · ${live.dt.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })}</div>
          <div class="pass-route">
            <span class="pass-route__plane">${ICONS[ev.type] || ICONS.itinerary}</span>
            <span class="pass-route__city">${ev.title || ''}</span>
          </div>
          <div class="pass-flight-id">${ev.location || ''}</div>
          ${tripTag}
        </div>
        <div class="pass-divider"></div>
        <div class="pass-card__bottom">
          <div><div class="pass-stat__label">Time</div><div class="pass-stat__value">${ev.time || '—'}</div></div>
          <div><div class="pass-stat__label">Type</div><div class="pass-stat__value" style="text-transform:capitalize;">${ev.type || '—'}</div></div>
          <div><div class="pass-stat__label">Contact</div><div class="pass-stat__value" style="font-size:12px;">${ev.contact || '—'}</div></div>
        </div>`;
    }

    const switchBtn = document.getElementById('passTripSwitchBtn');
    if (switchBtn) switchBtn.addEventListener('click', () => switchToTrip(switchBtn.dataset.id));
    return;
  }

  // Fall back to a legacy static Next Event field for trips that don't have
  // dateISO data yet (older trips created before this feature existed).
  const ne = TRIP.nextEvent;
  if (ne) {
    passCard.innerHTML = `
      <div class="pass-card__top">
        <div class="pass-eyebrow"><span class="dot"></span>${ne.status || 'Confirmed'} · ${ne.date || ''}</div>
        <div class="pass-route">
          <span class="pass-route__plane">${ICONS.flight}</span>
          <span class="pass-route__city">${ne.route || ''}</span>
        </div>
        <div class="pass-flight-id">${ne.airline || ''} ${ne.flightNumber || ''}</div>
      </div>
      <div class="pass-divider"></div>
      <div class="pass-card__bottom">
        <div><div class="pass-stat__label">Departure</div><div class="pass-stat__value">${ne.departure || '—'}</div></div>
        <div><div class="pass-stat__label">Gate</div><div class="pass-stat__value">${ne.gate || '—'}</div></div>
        <div><div class="pass-stat__label">Seat</div><div class="pass-stat__value">${ne.seat || '—'}</div></div>
      </div>`;
  } else {
    passCard.innerHTML = `<div class="empty-state">${ICONS.flight}<p>No upcoming events scheduled.</p></div>`;
  }
}

/* ---------------- Render: Home / Dashboard ---------------- */

function renderHome() {
  if (!TRIP) return;
  const t = TRIP.traveller;
  document.getElementById('homeAvatar').textContent = t.photoInitials || initials(t.name);
  document.getElementById('homeName').textContent = t.name;
  document.getElementById('homeRole').textContent = t.position;
  document.getElementById('homeRole2').textContent = t.position;
  document.getElementById('homeDestination').textContent = t.destination;
  document.getElementById('homeDates').textContent = t.dates;
  document.getElementById('topnavAvatar').textContent = t.photoInitials || initials(t.name);

  // Trip switcher — only shown when this traveller has more than one trip
  const switcherSection = document.getElementById('tripSwitcherSection');
  const switcherWrap = document.getElementById('tripSwitcher');
  const myTrips = getTripsForCurrentTraveller();
  if (myTrips.length > 1) {
    switcherSection.hidden = false;
    switcherWrap.innerHTML = '';
    myTrips.forEach(entry => {
      const chip = el(`<button class="trip-chip ${entry.tripId === TRIP_ID ? 'active' : ''}">
        <div class="trip-chip__dest">${entry.destination || entry.tripId}</div>
        <div class="trip-chip__dates">${entry.dates || ''}</div>
        <div class="trip-chip__badge">${entry.status || 'upcoming'}</div>
      </button>`);
      chip.addEventListener('click', () => switchToTrip(entry.tripId));
      switcherWrap.appendChild(chip);
    });
  } else {
    switcherSection.hidden = true;
  }

  // Next event pass card — live, computed across all of this traveller's trips
  renderNextEventCard();

  // Quick access grid
  const grid = document.getElementById('quickGrid');
  grid.innerHTML = '';
  (TRIP.quickAccess || []).forEach(item => {
    const tile = el(`<button class="quick-tile" data-view="${item.id}">
      <div class="quick-tile__icon">${ICONS[item.icon] || ICONS.document}</div>
      <div class="quick-tile__label">${item.label}</div>
    </button>`);
    tile.addEventListener('click', () => switchView(item.id));
    grid.appendChild(tile);
  });

  // Stat grid (Soft-UI style mini cards)
  const s = TRIP.status || {};
  const statGrid = document.getElementById('statGrid');
  const flightCount = (TRIP.flights || []).length;
  const docCount = Object.values(TRIP.documents || {}).reduce((a, arr) => a + arr.length, 0);
  statGrid.innerHTML = '';
  [
    { label: 'Flights Booked', value: flightCount, icon: 'flight' },
    { label: 'Documents', value: docCount, icon: 'document', gold: true },
    { label: 'Itinerary Days', value: (TRIP.itinerary || []).length, icon: 'itinerary' }
  ].forEach(c => {
    statGrid.appendChild(el(`<div class="stat-card">
      <div class="stat-card__text">
        <div class="stat-card__label">${c.label}</div>
        <div class="stat-card__value">${c.value}</div>
      </div>
      <div class="stat-card__icon ${c.gold ? 'gold' : ''}">${ICONS[c.icon]}</div>
    </div>`));
  });

  // Checklist (dynamic — falls back to the older fixed status object for trips saved before this existed)
  const statusCard = document.getElementById('statusCard');
  const checklist = Array.isArray(TRIP.checklist) ? TRIP.checklist : [
    { label: 'Documents Ready', done: !!s.documentsReady },
    { label: 'Hotels Confirmed', done: !!s.hotelsConfirmed },
    { label: 'Transport Arranged', done: !!s.transportArranged }
  ];
  if (!checklist.length) {
    statusCard.innerHTML = `<div class="status-row"><div class="status-text" style="color:var(--ink-500)">No checklist items for this trip.</div></div>`;
  } else {
    statusCard.innerHTML = checklist.map(item => `
      <div class="status-row">
        <div class="status-check" style="${item.done ? '' : 'background:var(--line-soft);color:var(--ink-300);'}">${ICONS.check}</div>
        <div class="status-text">${item.label}</div>
      </div>`).join('');
  }
}

/* ---------------- Render: Flights ---------------- */

async function renderFlights() {
  const wrap = document.getElementById('flightsList');
  wrap.innerHTML = `<div class="empty-state">${ICONS.flight}<p>Loading flights…</p></div>`;
  const trips = await loadAllTripsForTraveller();
  const flights = [];
  trips.forEach(t => (t.flights || []).forEach(f => flights.push({ ...f, _tripDest: t.traveller.destination })));
  flights.sort((a, b) => {
    const da = toDateTime(a.dateISO, a.departure), db = toDateTime(b.dateISO, b.departure);
    if (da && db) return da - db;
    if (da) return -1;
    if (db) return 1;
    return 0;
  });
  if (!flights.length) { wrap.innerHTML = emptyState('flight', 'No flights on file.'); return; }
  wrap.innerHTML = flights.map(f => `
    <div class="info-card">
      <div class="info-card__head">
        <div class="info-card__title">${f.airline} ${f.flightNumber}</div>
        <div class="info-card__badge">${f.class}</div>
      </div>
      <div class="info-card__route">${f.route}</div>
      <div class="info-card__meta">
        <div>Date<strong>${f.date}</strong></div>
        <div>Departs<strong>${f.departure}</strong></div>
        <div>Arrives<strong>${f.arrival}</strong></div>
        <div>Seat<strong>${f.seat}</strong></div>
        <div>PNR<strong>${f.pnr}</strong></div>
      </div>
      ${trips.length > 1 ? `<div class="info-card__trip-tag">${f._tripDest}</div>` : ''}
      <div class="info-card__actions">
        ${f.document ? `<a class="btn btn-primary btn-full" href="${f.document}" target="_blank" rel="noopener">${ICONS.pdf} View Boarding Pass</a>` : ''}
      </div>
    </div>`).join('');
}

/* ---------------- Render: Hotels ---------------- */

async function renderHotels() {
  const wrap = document.getElementById('hotelsList');
  wrap.innerHTML = `<div class="empty-state">${ICONS.hotel}<p>Loading hotels…</p></div>`;
  const trips = await loadAllTripsForTraveller();
  const hotels = [];
  trips.forEach(t => (t.hotels || []).forEach(h => hotels.push({ ...h, _tripDest: t.traveller.destination })));
  if (!hotels.length) { wrap.innerHTML = emptyState('hotel', 'No hotel reservations on file.'); return; }
  wrap.innerHTML = hotels.map(h => `
    <div class="info-card">
      <div class="info-card__head">
        <div class="info-card__title">${h.name}</div>
        <div class="info-card__badge">Confirmed</div>
      </div>
      <div class="info-card__route">${h.address}</div>
      <div class="info-card__meta">
        <div>Check-in<strong>${h.checkIn}</strong></div>
        <div>Check-out<strong>${h.checkOut}</strong></div>
        <div>Room<strong>${h.room}</strong></div>
        <div>Confirmation<strong>${h.confirmation}</strong></div>
      </div>
      ${trips.length > 1 ? `<div class="info-card__trip-tag">${h._tripDest}</div>` : ''}
      <div class="info-card__actions">
        ${h.document ? `<a class="btn btn-primary" href="${h.document}" target="_blank" rel="noopener">${ICONS.pdf} Confirmation</a>` : ''}
        <a class="btn btn-outline" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.mapQuery || h.name)}" target="_blank" rel="noopener">${ICONS.pin} Map</a>
      </div>
    </div>`).join('');
}

/* ---------------- Render: Meetings ---------------- */

function renderMeetings() {
  const wrap = document.getElementById('meetingsList');
  const meetings = TRIP.meetings || [];
  if (!meetings.length) { wrap.innerHTML = emptyState('meeting', 'No meetings scheduled.'); return; }
  wrap.innerHTML = meetings.map(m => `
    <div class="info-card">
      <div class="info-card__head">
        <div class="info-card__title">${m.title}</div>
      </div>
      <div class="info-card__meta">
        <div>With<strong>${m.with}</strong></div>
        <div>When<strong>${m.date}</strong></div>
        <div>Where<strong>${m.location}</strong></div>
      </div>
      <div class="info-card__actions">
        ${m.document ? `<a class="btn btn-primary btn-full" href="${m.document}" target="_blank" rel="noopener">${ICONS.pdf} Meeting Brief</a>` : ''}
      </div>
    </div>`).join('');
}

/* ---------------- Render: Transport ---------------- */

function renderTransport() {
  const wrap = document.getElementById('transportList');
  const transport = TRIP.transport || [];
  if (!transport.length) { wrap.innerHTML = emptyState('transport', 'No transport arranged.'); return; }
  wrap.innerHTML = transport.map(tr => `
    <div class="info-card">
      <div class="info-card__head">
        <div class="info-card__title">${tr.type}</div>
      </div>
      <div class="info-card__meta">
        <div>Driver<strong>${tr.driver}</strong></div>
        <div>Phone<strong>${tr.phone}</strong></div>
        <div>Vehicle<strong>${tr.vehicle}</strong></div>
      </div>
      <div class="info-card__meta" style="margin-top:2px"><div style="width:100%">Notes<strong style="font-weight:500">${tr.notes}</strong></div></div>
      <div class="info-card__actions">
        <a class="btn btn-primary btn-full" href="tel:${tr.phone.replace(/\s/g,'')}">${ICONS.call} Call Driver</a>
      </div>
    </div>`).join('');
}

/* ---------------- Render: Itinerary (calendar, cross-trip) ---------------- */

let calendarMonth = null;   // Date (day always 1) — which month the calendar is showing
let selectedDateISO = null; // "YYYY-MM-DD" — which day's timeline is shown below the calendar
let ITINERARY_DAY_MAP = null; // dateISO -> { days: [{day, trip}], flights: [{flight, trip}] }

function buildItineraryDayMap(trips) {
  const map = {};
  trips.forEach(trip => {
    (trip.itinerary || []).forEach(day => {
      if (!day.dateISO) return;
      if (!map[day.dateISO]) map[day.dateISO] = { days: [], flights: [] };
      map[day.dateISO].days.push({ day, trip });
    });
    (trip.flights || []).forEach(flight => {
      if (!flight.dateISO) return;
      if (!map[flight.dateISO]) map[flight.dateISO] = { days: [], flights: [] };
      map[flight.dateISO].flights.push({ flight, trip });
    });
  });
  return map;
}

async function renderItinerary() {
  const trips = await loadAllTripsForTraveller();
  ITINERARY_DAY_MAP = buildItineraryDayMap(trips);
  const allDates = Object.keys(ITINERARY_DAY_MAP).sort();
  const todayISO = new Date().toISOString().slice(0, 10);

  if (!calendarMonth) {
    const anchor = allDates.find(d => d >= todayISO) || allDates[allDates.length - 1] || todayISO;
    calendarMonth = new Date(anchor + 'T00:00:00');
    calendarMonth.setDate(1);
  }
  if (!selectedDateISO) {
    selectedDateISO = allDates.find(d => d >= todayISO) || allDates[allDates.length - 1] || todayISO;
  }

  renderCalendarGrid();
  renderSelectedDayTimeline();
}

function renderCalendarGrid() {
  const wrap = document.getElementById('itineraryCalendar');
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // Monday-first grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayISO = new Date().toISOString().slice(0, 10);

  let cells = '';
  for (let i = 0; i < startOffset; i++) cells += `<div class="cal-cell empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const hasData = !!ITINERARY_DAY_MAP[iso];
    cells += `<button class="cal-cell ${hasData ? 'has-data' : ''} ${iso === selectedDateISO ? 'selected' : ''} ${iso === todayISO ? 'today' : ''}" data-iso="${iso}">
      <span class="cal-cell__num">${d}</span>
      ${hasData ? `<span class="cal-cell__dot"></span>` : ''}
    </button>`;
  }

  wrap.innerHTML = `
    <div class="cal-head">
      <button class="cal-nav" id="calPrev" aria-label="Previous month">${ICONS.chevron}</button>
      <div class="cal-title">${calendarMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</div>
      <button class="cal-nav next" id="calNext" aria-label="Next month">${ICONS.chevron}</button>
    </div>
    <div class="cal-weekdays">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(w => `<div>${w}</div>`).join('')}</div>
    <div class="cal-grid">${cells}</div>`;

  document.getElementById('calPrev').addEventListener('click', () => { calendarMonth.setMonth(calendarMonth.getMonth() - 1); renderCalendarGrid(); });
  document.getElementById('calNext').addEventListener('click', () => { calendarMonth.setMonth(calendarMonth.getMonth() + 1); renderCalendarGrid(); });
  wrap.querySelectorAll('.cal-cell[data-iso]').forEach(cell => {
    cell.addEventListener('click', () => {
      selectedDateISO = cell.dataset.iso;
      renderCalendarGrid();
      renderSelectedDayTimeline();
    });
  });
}

function renderSelectedDayTimeline() {
  const list = document.getElementById('timelineList');
  const info = ITINERARY_DAY_MAP[selectedDateISO];
  const prettyDate = new Date(selectedDateISO + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  list.innerHTML = '';
  const heading = el(`<div style="margin:-4px 0 14px; font-size:12.5px; color:var(--ink-500); font-weight:600;">${prettyDate}</div>`);
  list.appendChild(heading);

  if (!info || (!info.days.length && !info.flights.length)) {
    const empty = el(emptyState('itinerary', 'No trip activity on this day.'));
    list.appendChild(empty);
    return;
  }

  const showTripTag = getTripsForCurrentTraveller().length > 1;
  const entries = [];
  info.flights.forEach(({ flight, trip }) => entries.push({
    time: flight.departure || '', title: `${flight.airline || ''} ${flight.flightNumber || ''}`.trim(),
    location: flight.route || '', type: 'flight', trip, raw: flight, isFlight: true
  }));
  info.days.forEach(({ day, trip }) => (day.events || []).forEach(ev => entries.push({
    time: ev.time || '', title: ev.title, location: ev.location, type: ev.type, trip, raw: ev, isFlight: false
  })));
  entries.sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  const timeline = el(`<div class="timeline"></div>`);
  entries.forEach(entry => {
    const item = el(`
      <div class="timeline-item">
        <div class="timeline-dot">${ICONS.check}</div>
        <div class="timeline-time">${entry.time}</div>
        <div class="timeline-card">
          <div class="timeline-title">${entry.title}</div>
          <div class="timeline-loc">${ICONS.pin}${entry.location || ''}</div>
          <div class="timeline-tags"><span class="tag">${entry.type}</span></div>
          ${showTripTag ? `<div class="info-card__trip-tag" style="margin-top:8px;">${entry.trip.traveller.destination}</div>` : ''}
        </div>
      </div>`);
    item.querySelector('.timeline-card').addEventListener('click', () => {
      if (entry.isFlight) openFlightSheet(entry.raw, entry.trip);
      else openEventSheet(entry.raw);
    });
    timeline.appendChild(item);
  });
  list.appendChild(timeline);
}

function openFlightSheet(f, trip) {
  const content = document.getElementById('sheetContent');
  content.innerHTML = `
    <h3>${f.airline || ''} ${f.flightNumber || ''}</h3>
    <div style="font-size:12.5px;color:var(--ink-500);margin-bottom:6px;">${f.date || ''} · Departs ${f.departure || '—'}</div>
    <div class="sheet-row">
      <div class="sheet-row__icon">${ICONS.flight}</div>
      <div><div class="sheet-row__label">Route</div><div class="sheet-row__value">${f.route || '—'}</div></div>
    </div>
    <div class="sheet-row">
      <div class="sheet-row__icon">${ICONS.itinerary}</div>
      <div><div class="sheet-row__label">Seat / Class</div><div class="sheet-row__value">${f.seat || '—'} · ${f.class || '—'}</div></div>
    </div>
    <div class="sheet-row">
      <div class="sheet-row__icon">${ICONS.pin}</div>
      <div><div class="sheet-row__label">Trip</div><div class="sheet-row__value">${trip.traveller.destination}</div></div>
    </div>
    <div class="sheet-actions">
      ${f.document ? `<a class="btn btn-primary" href="${f.document}" target="_blank" rel="noopener">${ICONS.pdf} Boarding Pass</a>` : ''}
      <button class="btn btn-ghost" id="sheetCloseBtn">Close</button>
    </div>`;
  document.getElementById('sheetCloseBtn').addEventListener('click', closeSheet);
  document.getElementById('sheetBackdrop').classList.add('open');
}

function openEventSheet(ev) {
  const content = document.getElementById('sheetContent');
  content.innerHTML = `
    <h3>${ev.title}</h3>
    <div style="font-size:12.5px;color:var(--ink-500);margin-bottom:6px;">${ev.time}</div>
    <div class="sheet-row">
      <div class="sheet-row__icon">${ICONS.pin}</div>
      <div><div class="sheet-row__label">Location</div><div class="sheet-row__value">${ev.location}</div></div>
    </div>
    <div class="sheet-row">
      <div class="sheet-row__icon">${ICONS.person}</div>
      <div><div class="sheet-row__label">Contact</div><div class="sheet-row__value">${ev.contact || '—'}</div></div>
    </div>
    ${ev.notes ? `<div class="sheet-row">
      <div class="sheet-row__icon">${ICONS.note}</div>
      <div><div class="sheet-row__label">Notes</div><div class="sheet-row__value">${ev.notes}</div></div>
    </div>` : ''}
    ${(ev.attachments && ev.attachments.length) ? ev.attachments.map(a => `
    <div class="sheet-row">
      <div class="sheet-row__icon">${ICONS.clip}</div>
      <div><div class="sheet-row__label">Attachment</div><div class="sheet-row__value"><a href="${a.file}" target="_blank" rel="noopener" style="color:var(--navy-800);font-weight:600;">${a.name}</a></div></div>
    </div>`).join('') : ''}
    <div class="sheet-actions">
      ${ev.mapQuery ? `<a class="btn btn-primary" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.mapQuery)}" target="_blank" rel="noopener">${ICONS.pin} Open Map</a>` : ''}
      <button class="btn btn-ghost" id="sheetCloseBtn">Close</button>
    </div>`;
  document.getElementById('sheetCloseBtn').addEventListener('click', closeSheet);
  document.getElementById('sheetBackdrop').classList.add('open');
}
function closeSheet() { document.getElementById('sheetBackdrop').classList.remove('open'); }

/* ---------------- Render: Documents ---------------- */

const DOC_CAT_ICON = {
  'Flight Documents': 'flight', 'Hotel Reservations': 'hotel', 'Visa & Passport': 'document',
  'Insurance': 'document', 'Meeting Documents': 'meeting', 'Expense Documents': 'expense'
};

function renderDocuments() {
  const wrap = document.getElementById('docsList');
  const docs = TRIP.documents || {};
  wrap.innerHTML = '';
  Object.entries(docs).forEach(([cat, files], i) => {
    const details = el(`
      <details class="doc-category" ${i === 0 ? 'open' : ''}>
        <summary>
          <div class="doc-category-icon">${ICONS[DOC_CAT_ICON[cat]] || ICONS.document}</div>
          <div class="doc-category-name">${cat}</div>
          <div class="doc-category-count">${files.length}</div>
          <div class="doc-category-chevron">${ICONS.chevron}</div>
        </summary>
        <div class="doc-list">
          ${files.map(f => `
            <a class="doc-row" href="${f.file}" target="_blank" rel="noopener">
              <div class="doc-row__icon">${ICONS.pdf}</div>
              <div class="doc-row__name">${f.name}</div>
              <div class="doc-row__open">${ICONS.chevron}</div>
            </a>`).join('')}
        </div>
      </details>`);
    wrap.appendChild(details);
  });
}

/* ---------------- Render: Maps ---------------- */

function renderMaps() {
  const wrap = document.getElementById('mapsList');
  const maps = TRIP.maps || [];
  wrap.innerHTML = maps.map(m => `
    <a class="map-card" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.query)}" target="_blank" rel="noopener">
      <div class="map-card__icon">${ICONS.pin}</div>
      <div style="flex:1; min-width:0;">
        <div class="map-card__cat">${m.category}</div>
        <div class="map-card__name">${m.name}</div>
        <div class="map-card__addr">${m.address}</div>
      </div>
      <div class="map-card__go">${ICONS.chevron}</div>
    </a>`).join('');
}

/* ---------------- Render: Contacts ---------------- */

async function renderContacts() {
  const wrap = document.getElementById('contactsList');
  wrap.innerHTML = `<div class="empty-state">${ICONS.contact}<p>Loading contacts…</p></div>`;
  const trips = await loadAllTripsForTraveller();
  const seen = new Map();
  trips.forEach(t => (t.contacts || []).forEach(c => {
    const key = (c.name || '').toLowerCase().trim() + '|' + (c.phone || '').replace(/\s/g, '');
    if (!seen.has(key)) seen.set(key, c);
  }));
  const contacts = Array.from(seen.values());
  if (!contacts.length) { wrap.innerHTML = emptyState('contact', 'No contacts on file.'); return; }
  wrap.innerHTML = contacts.map(c => `
    <div class="contact-card">
      <div class="contact-top">
        <div class="contact-avatar">${initials(c.name)}</div>
        <div>
          <div class="contact-name">${c.name}</div>
          <div class="contact-role">${c.role}</div>
          <div class="contact-company">${c.company}</div>
        </div>
      </div>
      <div class="contact-actions">
        <a class="icon-btn" href="tel:${c.phone}">${ICONS.call}<span>Call</span></a>
        <a class="icon-btn" href="https://wa.me/${c.whatsapp}" target="_blank" rel="noopener">${ICONS.whatsapp}<span>WhatsApp</span></a>
        <a class="icon-btn" href="mailto:${c.email}">${ICONS.email}<span>Email</span></a>
      </div>
    </div>`).join('');
}

/* ---------------- Render: Expenses ---------------- */

function renderExpenses() {
  const wrap = document.getElementById('expensesWrap');
  const exp = TRIP.expenses || { items: [], currency: 'USD', perDiem: 0 };
  const total = exp.items.reduce((a, i) => a + i.amount, 0);
  wrap.innerHTML = `
    <div class="expense-summary">
      <div>
        <div class="expense-summary__label">Total Logged</div>
        <div class="expense-summary__value">${exp.currency} ${total.toLocaleString()}</div>
        <div class="expense-summary__sub">Per diem: ${exp.currency} ${exp.perDiem}/day</div>
      </div>
      <div class="stat-card__icon gold">${ICONS.expense}</div>
    </div>
    <div class="section-head"><h2>Logged Items</h2></div>
    <div class="info-card" style="padding:4px 16px;">
      ${exp.items.map(i => `
        <div class="expense-row">
          <div class="expense-row__cat">${ICONS.expense}</div>
          <div>
            <div class="expense-row__desc">${i.description}</div>
            <div class="expense-row__date">${i.date} · ${i.category}</div>
          </div>
          <div class="expense-row__amount">${exp.currency} ${i.amount}</div>
        </div>`).join('')}
    </div>`;
}

function emptyState(icon, text) {
  return `<div class="empty-state">${ICONS[icon] || ICONS.document}<p>${text}</p></div>`;
}

/* ---------------- Render: Travel Policy ---------------- */

let POLICY_CACHE = null;

function policyTable(headers, rows) {
  return `<div class="policy-table-wrap"><table class="policy-table">
    <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`;
}

async function renderPolicy() {
  const wrap = document.getElementById('policyContent');
  wrap.innerHTML = `<div class="empty-state">${ICONS.document}<p>Loading policy…</p></div>`;

  try {
    if (!POLICY_CACHE) {
      const res = await fetchWithTimeout('data/travel-policy.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('travel-policy.json — ' + res.status);
      POLICY_CACHE = await res.json();
    }
    const p = POLICY_CACHE;

    wrap.innerHTML = `
      <div class="info-card">
        <div class="info-card__head">
          <div class="info-card__title">${p.policyName}</div>
          <div class="info-card__badge">v${p.version}</div>
        </div>
        <div class="info-card__route">Effective ${p.effectiveDate}</div>
        ${p.fullPolicyDocument ? `<div class="info-card__actions"><a class="btn btn-primary btn-full" href="${p.fullPolicyDocument}" target="_blank" rel="noopener">${ICONS.pdf} View Full Policy (PDF)</a></div>` : ''}
      </div>

      <div class="section-head" style="margin-top:22px"><h2>Class of Service</h2></div>
      <div class="info-card">
        ${policyTable(['Level', '≤6 hrs', '>6 hrs'], p.classOfService.rows.map(r => [r.level, r.shortHaul, r.longHaul]))}
        <p class="policy-note">${p.classOfService.note}</p>
      </div>

      <div class="section-head"><h2>Meal Per Diem by Zone</h2></div>
      <div class="info-card">
        ${policyTable(['Zone', 'Countries', 'Daily Limit'], p.perDiemByZone.rows.map(r => [r.zone, r.countries, `<strong>${r.dailyLimit}</strong>`]))}
        <p class="policy-note">${p.perDiemByZone.note}</p>
      </div>

      <div class="section-head"><h2>Hotel Limits by Zone</h2></div>
      <div class="info-card">
        ${policyTable(['Zone', 'Per Day'], p.hotelLimitsByZone.rows.map(r => [r.zone, `<strong>${r.range}</strong>`]))}
        <p class="policy-note">${p.hotelLimitsByZone.note}</p>
      </div>

      <div class="section-head"><h2>Other Limits</h2></div>
      <div class="info-card">
        ${policyTable(['Item', 'Limit'], p.otherLimits.map(r => [r.item, `<strong>${r.limit}</strong>`]))}
      </div>

      <div class="section-head"><h2>Key Rules</h2></div>
      <div class="status-card">
        ${p.keyRules.map(rule => `
          <div class="status-row">
            <div class="status-check">${ICONS.check}</div>
            <div class="status-text">${rule}</div>
          </div>`).join('')}
      </div>

      <div class="section-head"><h2>Approval Matrix</h2></div>
      <div class="info-card">
        ${policyTable(['Entity', 'Category', 'First Approval', 'Final Approval'], p.approvalMatrix.rows.map(r => [r.entityType, r.category, r.firstApproval, r.finalApproval]))}
        <p class="policy-note">${p.approvalMatrix.note}</p>
      </div>
    `;
  } catch (err) {
    console.error('Failed to load travel policy', err);
    wrap.innerHTML = emptyState('document', 'Could not load the travel policy. Check your connection and try again.');
  }
}

/* ---------------- Settings ---------------- */

function renderSettings() {
  document.getElementById('settingsTripName').textContent = TRIP.meta.tripName;
  document.getElementById('settingsTraveller').textContent = TRIP.traveller.name;

  const section = document.getElementById('settingsTripSwitcherSection');
  const wrap = document.getElementById('settingsTripSwitcher');
  const myTrips = getTripsForCurrentTraveller();
  if (myTrips.length > 1) {
    section.hidden = false;
    wrap.innerHTML = myTrips.map(entry => `
      <div class="settings-row" style="cursor:pointer;" data-id="${entry.tripId}">
        <div class="settings-row__icon">${ICONS.itinerary}</div>
        <div class="settings-row__text">
          <div class="settings-row__label">${entry.destination || entry.tripId}${entry.tripId === TRIP_ID ? ' (current)' : ''}</div>
          <div class="settings-row__value">${entry.dates || ''} · ${entry.status || 'upcoming'}</div>
        </div>
      </div>`).join('');
    wrap.querySelectorAll('.settings-row[data-id]').forEach(row => {
      row.addEventListener('click', () => switchToTrip(row.dataset.id));
    });
  } else {
    section.hidden = true;
  }
}

/* ---------------- View routing ---------------- */

const VIEW_TITLES = {
  home: 'Dashboard', flights: 'Flights', hotels: 'Hotels', itinerary: 'Itinerary',
  meetings: 'Meetings', transport: 'Transport', documents: 'Documents', maps: 'Maps',
  contacts: 'Contacts', expenses: 'Expenses', policy: 'Travel Policy', settings: 'Settings'
};
const RENDERERS = {
  home: renderHome, flights: renderFlights, hotels: renderHotels, itinerary: renderItinerary,
  meetings: renderMeetings, transport: renderTransport, documents: renderDocuments, maps: renderMaps,
  contacts: renderContacts, expenses: renderExpenses, policy: renderPolicy, settings: renderSettings
};

function switchView(name) {
  if (!VIEW_TITLES[name]) return;
  document.querySelectorAll('.view').forEach(v => v.hidden = true);
  const target = document.getElementById('view-' + name);
  if (target) target.hidden = false;

  document.getElementById('topnavTitle').textContent = VIEW_TITLES[name];
  document.getElementById('backBtn').classList.toggle('hidden', name === 'home');

  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.toggle('active', link.dataset.view === name);
  });

  if (RENDERERS[name]) RENDERERS[name]();
  closeSidebar();
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

/* ---------------- Sidebar (mobile off-canvas) ---------------- */

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

/* ---------------- Theme / offline toggles ---------------- */

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.getElementById('darkModeToggle').checked = dark;
  localStorage.setItem('efl-theme', dark ? 'dark' : 'light');
}

function applyOffline(on) {
  CACHE_ON = on;
  document.getElementById('offlineToggle').checked = on;
  document.getElementById('offlineStatusText').textContent = on
    ? 'Trip data cached for offline access'
    : 'Cache trip for offline access';
  localStorage.setItem('efl-offline', on ? '1' : '0');
  if (on && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(reg => {
      reg.active && reg.active.postMessage({ type: 'CACHE_TRIP', tripId: TRIP_ID });
    });
    showToast('Trip cached for offline access.');
  }
}

/* ---------------- PWA install ---------------- */

let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

function initInstall() {
  document.getElementById('installRow').addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (outcome === 'accepted') showToast('EFL Travel Portal installed.');
    } else {
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      showToast(isIOS
        ? 'Tap the Share icon, then "Add to Home Screen".'
        : 'Use your browser menu, then "Install app" or "Add to Home Screen".');
    }
  });
}

/* ---------------- Init ---------------- */

function hideSplash() {
  const splash = document.getElementById('splash');
  if (splash) splash.classList.add('hidden');
}

// Shown in place of the dashboard if the trip data genuinely couldn't be
// loaded (e.g. no signal) — so the person sees a clear retry action instead
// of a frozen, empty-looking app.
function renderLoadError() {
  const homeView = document.getElementById('view-home');
  if (!homeView) return;
  const detail = LOAD_ERROR_DETAIL
    ? `<pre style="font-size:11px; color:var(--danger); background:var(--line-soft); border-radius:var(--r-sm); padding:10px 12px; max-width:320px; white-space:pre-wrap; text-align:left; margin:0 0 20px;">${LOAD_ERROR_DETAIL}</pre>`
    : '';
  homeView.innerHTML = `
    <div style="min-height:60vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:32px 20px;">
      <div style="width:56px;height:56px;border-radius:16px;background:var(--line-soft);display:flex;align-items:center;justify-content:center;margin-bottom:16px;color:var(--ink-500);">
        ${ICONS.document}
      </div>
      <h2 style="font-family:var(--font-display); font-size:17px; margin:0 0 8px; color:var(--ink-900);">Couldn't load your trip</h2>
      <p style="font-size:13.5px; color:var(--ink-500); max-width:280px; margin:0 0 14px;">This is usually a weak connection, or a trip that no longer exists. Details below.</p>
      ${detail}
      <div style="display:flex; gap:10px;">
        <button class="btn btn-primary" id="retryLoadBtn">Try Again</button>
        <button class="btn btn-outline" id="resetLoadBtn">Reset &amp; Reload</button>
      </div>
    </div>`;
  document.getElementById('retryLoadBtn').addEventListener('click', () => window.location.reload());
  document.getElementById('resetLoadBtn').addEventListener('click', () => {
    localStorage.removeItem('efl-active-trip');
    const url = new URL(window.location.href);
    url.searchParams.delete('trip');
    window.location.href = url.toString();
  });
}

async function init() {
  // Absolute failsafe: whatever else happens below, never leave the splash
  // on screen for more than a few seconds — this is what was causing the
  // app to look "stuck" on mobile when a request stalled or failed.
  const failsafe = setTimeout(hideSplash, 6000);

  try {
    await loadTrip();

    if (!TRIP) {
      showToast(LOAD_ERROR_DETAIL ? `Could not load trip data: ${LOAD_ERROR_DETAIL}` : 'Could not load trip data.');
      renderLoadError();
      return;
    }

    switchView('home');
    document.querySelectorAll('.sidebar-link[data-view]').forEach(btn => {
      btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    document.getElementById('menuBtn').addEventListener('click', openSidebar);
    document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);
    document.getElementById('backBtn').addEventListener('click', () => switchView('home'));

    document.getElementById('sheetBackdrop').addEventListener('click', (e) => {
      if (e.target.id === 'sheetBackdrop') closeSheet();
    });
    document.getElementById('toastClose').addEventListener('click', () => document.getElementById('toast').classList.remove('show'));

    document.getElementById('darkModeToggle').addEventListener('change', (e) => applyTheme(e.target.checked));
    document.getElementById('policyRow').addEventListener('click', () => switchView('policy'));
    document.getElementById('offlineToggle').addEventListener('change', (e) => applyOffline(e.target.checked));
    applyTheme(localStorage.getItem('efl-theme') === 'dark');
    applyOffline(localStorage.getItem('efl-offline') === '1');

    initInstall();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js').catch(err => console.warn('SW registration failed', err));
    }
  } catch (err) {
    console.error('App failed to initialise', err);
    showToast('Something went wrong loading the app.');
    renderLoadError();
  } finally {
    clearTimeout(failsafe);
    // Keep the short, deliberate splash animation on a normal successful
    // load; on failure, drop it immediately rather than making someone
    // wait out the animation just to see an error.
    if (TRIP) setTimeout(hideSplash, 1100);
    else hideSplash();
  }
}

document.addEventListener('DOMContentLoaded', init);
