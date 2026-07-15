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
let currentDay = 0;
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

async function loadTrip() {
  try {
    const idxRes = await fetch('data/trips-index.json', { cache: 'no-store' });
    const idx = await idxRes.json();

    const params = new URLSearchParams(window.location.search);
    const requested = params.get('trip');
    const remembered = localStorage.getItem('efl-active-trip');
    TRIP_ID = requested || remembered || idx.defaultTripId || (idx.trips[0] && idx.trips[0].tripId);
    localStorage.setItem('efl-active-trip', TRIP_ID);

    const override = localStorage.getItem('efl-trip-data-' + TRIP_ID);
    if (override) {
      TRIP = JSON.parse(override);
      return;
    }

    const entry = idx.trips.find(t => t.tripId === TRIP_ID);
    const file = entry ? entry.file : `data/trips/${TRIP_ID}.json`;
    const res = await fetch(file, { cache: 'no-store' });
    TRIP = await res.json();
  } catch (err) {
    console.error('Failed to load trip data', err);
    TRIP = null;
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

  // Next event pass card
  const ne = TRIP.nextEvent;
  const passCard = document.getElementById('nextEventCard');
  if (ne) {
    passCard.innerHTML = `
      <div class="pass-card__top">
        <div class="pass-eyebrow"><span class="dot"></span>${ne.status || 'Confirmed'} · ${ne.date || ''}</div>
        <div class="pass-route">
          <span class="pass-route__plane">${ICONS.flight}</span>
          <span class="pass-route__city">${ne.route}</span>
        </div>
        <div class="pass-flight-id">${ne.airline} ${ne.flightNumber}</div>
      </div>
      <div class="pass-divider"></div>
      <div class="pass-card__bottom">
        <div><div class="pass-stat__label">Departure</div><div class="pass-stat__value">${ne.departure}</div></div>
        <div><div class="pass-stat__label">Gate</div><div class="pass-stat__value">${ne.gate || '—'}</div></div>
        <div><div class="pass-stat__label">Seat</div><div class="pass-stat__value">${ne.seat || '—'}</div></div>
      </div>`;
  } else {
    passCard.innerHTML = `<div class="empty-state">${ICONS.flight}<p>No upcoming events scheduled.</p></div>`;
  }

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

function renderFlights() {
  const wrap = document.getElementById('flightsList');
  const flights = TRIP.flights || [];
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
      <div class="info-card__actions">
        ${f.document ? `<a class="btn btn-primary btn-full" href="${f.document}" target="_blank" rel="noopener">${ICONS.pdf} View Boarding Pass</a>` : ''}
      </div>
    </div>`).join('');
}

/* ---------------- Render: Hotels ---------------- */

function renderHotels() {
  const wrap = document.getElementById('hotelsList');
  const hotels = TRIP.hotels || [];
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

/* ---------------- Render: Itinerary ---------------- */

function renderItinerary() {
  const days = TRIP.itinerary || [];
  const tabs = document.getElementById('dayTabs');
  tabs.innerHTML = '';
  days.forEach((d, i) => {
    const tab = el(`<button class="day-tab ${i === currentDay ? 'active' : ''}">Day ${d.day}</button>`);
    tab.addEventListener('click', () => { currentDay = i; renderItinerary(); });
    tabs.appendChild(tab);
  });

  const list = document.getElementById('timelineList');
  const day = days[currentDay];
  if (!day) { list.innerHTML = emptyState('itinerary', 'No itinerary available.'); return; }

  list.innerHTML = '';
  const heading = el(`<div style="margin:-4px 0 14px; font-size:12.5px; color:var(--ink-500); font-weight:600;">${day.date} · ${day.city}</div>`);
  list.appendChild(heading);

  const timeline = el(`<div class="timeline"></div>`);
  day.events.forEach((ev, idx) => {
    const item = el(`
      <div class="timeline-item">
        <div class="timeline-dot">${ICONS.check}</div>
        <div class="timeline-time">${ev.time}</div>
        <div class="timeline-card">
          <div class="timeline-title">${ev.title}</div>
          <div class="timeline-loc">${ICONS.pin}${ev.location}</div>
          <div class="timeline-tags"><span class="tag">${ev.type}</span></div>
        </div>
      </div>`);
    item.querySelector('.timeline-card').addEventListener('click', () => openEventSheet(ev));
    timeline.appendChild(item);
  });
  list.appendChild(timeline);
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

function renderContacts() {
  const wrap = document.getElementById('contactsList');
  const contacts = TRIP.contacts || [];
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

/* ---------------- Settings ---------------- */

function renderSettings() {
  document.getElementById('settingsTripName').textContent = TRIP.meta.tripName;
  document.getElementById('settingsTraveller').textContent = TRIP.traveller.name;
}

/* ---------------- View routing ---------------- */

const VIEW_TITLES = {
  home: 'Dashboard', flights: 'Flights', hotels: 'Hotels', itinerary: 'Itinerary',
  meetings: 'Meetings', transport: 'Transport', documents: 'Documents', maps: 'Maps',
  contacts: 'Contacts', expenses: 'Expenses', settings: 'Settings'
};
const RENDERERS = {
  home: renderHome, flights: renderFlights, hotels: renderHotels, itinerary: renderItinerary,
  meetings: renderMeetings, transport: renderTransport, documents: renderDocuments, maps: renderMaps,
  contacts: renderContacts, expenses: renderExpenses, settings: renderSettings
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

async function init() {
  await loadTrip();
  if (!TRIP) {
    showToast('Could not load trip data.');
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
  document.getElementById('offlineToggle').addEventListener('change', (e) => applyOffline(e.target.checked));
  applyTheme(localStorage.getItem('efl-theme') === 'dark');
  applyOffline(localStorage.getItem('efl-offline') === '1');

  initInstall();

  // Splash screen
  setTimeout(() => document.getElementById('splash').classList.add('hidden'), 1100);

  // Service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(err => console.warn('SW registration failed', err));
  }
}

document.addEventListener('DOMContentLoaded', init);
