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

let currentTrip = null;
let currentIsNew = false;

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
    traveller: { name: '', position: '', photoInitials: '', destination: '', dates: '', tripId: '' },
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
    card.querySelector('[data-act="edit"]').addEventListener('click', () => openEditor(id));
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
    fields.forEach(f => {
      const val = esc(item[f.key]);
      const inputHtml = f.type === 'textarea'
        ? `<textarea class="f-input" data-k="${f.key}">${item[f.key] || ''}</textarea>`
        : `<input class="f-input" type="${f.type || 'text'}" data-k="${f.key}" value="${val}" placeholder="${f.placeholder || ''}" />`;
      const field = el(`<div class="field ${f.span2 ? 'span-2' : ''}"><label>${f.label}</label>${inputHtml}</div>`);
      field.querySelector('[data-k]').addEventListener('input', (e) => {
        let v = e.target.value;
        if (f.type === 'number') v = v === '' ? 0 : Number(v);
        item[f.key] = v;
        if (opts.onChange) opts.onChange();
        const titleEl = card.querySelector('.repeat-card__title');
        if (titleEl) titleEl.textContent = opts.title(item, idx);
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
    { key: 'airline', label: 'Airline' }, { key: 'flightNumber', label: 'Flight Number' },
    { key: 'route', label: 'Route', span2: true, placeholder: 'Nairobi (NBO) → Entebbe (EBB)' },
    { key: 'date', label: 'Date' }, { key: 'departure', label: 'Departure' }, { key: 'arrival', label: 'Arrival' },
    { key: 'class', label: 'Class' }, { key: 'seat', label: 'Seat' }, { key: 'pnr', label: 'PNR' },
    { key: 'document', label: 'Document Path', span2: true, placeholder: 'documents/boarding-pass.pdf' }
  ],
  hotel: [
    { key: 'name', label: 'Hotel Name', span2: true }, { key: 'address', label: 'Address', span2: true },
    { key: 'checkIn', label: 'Check-in' }, { key: 'checkOut', label: 'Check-out' },
    { key: 'room', label: 'Room Type' }, { key: 'confirmation', label: 'Confirmation No.' },
    { key: 'mapQuery', label: 'Map Search Query', span2: true },
    { key: 'document', label: 'Document Path', span2: true, placeholder: 'documents/hotel-confirmation.pdf' }
  ],
  meeting: [
    { key: 'title', label: 'Title', span2: true }, { key: 'with', label: 'With' }, { key: 'date', label: 'Date / Time' },
    { key: 'location', label: 'Location', span2: true },
    { key: 'document', label: 'Document Path', span2: true, placeholder: 'documents/meeting-brief.pdf' }
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
    { key: 'file', label: 'File Path', span2: true, placeholder: 'documents/file.pdf' }
  ]
};

function renderSimpleSections() {
  renderRepeatList(document.getElementById('flightsList'), currentTrip.flights, FIELD_SCHEMAS.flight,
    { title: (i) => `${i.airline || 'Flight'} ${i.flightNumber || ''}`.trim() || 'New Flight', emptyText: 'No flights added.' });

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
            <input class="f-input" data-k="day" type="number" value="${esc(day.day)}" placeholder="Day #" style="max-width:90px" />
            <input class="f-input" data-k="date" value="${esc(day.date)}" placeholder="Mon, 20 Jul 2026" />
            <input class="f-input" data-k="city" value="${esc(day.city)}" placeholder="City / Route" />
          </div>
          <button class="repeat-card__remove" type="button">Remove Day</button>
        </div>
        <div class="events-wrap"></div>
        <button class="btn btn-outline btn-sm" type="button">+ Add Event</button>
      </div>`);

    dayCard.querySelectorAll('[data-k]').forEach(inp => {
      inp.addEventListener('input', () => { day[inp.dataset.k] = inp.type === 'number' ? Number(inp.value) : inp.value; });
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
          <input class="f-input" placeholder="documents/file.pdf" value="${esc(f.file)}" data-role="file" />
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

/* ---------------- Editor: load / bind / save ---------------- */

function openEditorWithTrip(trip, isNew) {
  currentTrip = trip;
  currentIsNew = !!isNew;
  if (!currentTrip.expenses) currentTrip.expenses = { currency: 'USD', perDiem: 0, items: [] };
  if (!currentTrip.documents) currentTrip.documents = {};
  if (!currentTrip.meta.stage) currentTrip.meta.stage = 'upcoming';

  document.getElementById('editorHeading').textContent = isNew ? 'New Trip' : `Edit — ${trip.traveller.name || trip.traveller.tripId}`;

  const f = (id) => document.getElementById(id);
  f('f_tripId').value = trip.traveller.tripId || '';
  f('f_tripId').readOnly = !isNew;
  f('f_tripId').title = isNew ? '' : 'Trip ID cannot be changed after creation — duplicate the trip to fork it.';
  f('f_stage').value = trip.meta.stage;
  f('f_tripName').value = trip.meta.tripName || '';
  f('f_companyName').value = trip.meta.companyName || 'EFL Global';
  f('f_travellerName').value = trip.traveller.name || '';
  f('f_position').value = trip.traveller.position || '';
  f('f_initials').value = trip.traveller.photoInitials || '';
  f('f_destination').value = trip.traveller.destination || '';
  f('f_dates').value = trip.traveller.dates || '';

  const ne = trip.nextEvent || {};
  f('ne_airline').value = ne.airline || '';
  f('ne_flightNumber').value = ne.flightNumber || '';
  f('ne_status').value = ne.status || 'On Time';
  f('ne_route').value = ne.route || '';
  f('ne_date').value = ne.date || '';
  f('ne_departure').value = ne.departure || '';
  f('ne_arrival').value = ne.arrival || '';
  f('ne_terminal').value = ne.terminal || '';
  f('ne_gate').value = ne.gate || '';
  f('ne_seat').value = ne.seat || '';

  f('st_documents').checked = !!trip.status.documentsReady;
  f('st_hotels').checked = !!trip.status.hotelsConfirmed;
  f('st_transport').checked = !!trip.status.transportArranged;

  f('exp_currency').value = trip.expenses.currency || 'USD';
  f('exp_perDiem').value = trip.expenses.perDiem || 0;

  renderItinerary();
  renderSimpleSections();
  renderDocuments();

  document.getElementById('view-list').hidden = true;
  document.getElementById('view-editor').hidden = false;
  document.getElementById('topnavTitle').textContent = isNew ? 'New Trip' : 'Edit Trip';
  document.getElementById('backBtn').classList.remove('hidden');
  window.scrollTo({ top: 0 });
}

async function openEditor(id) {
  try {
    const trip = await loadTripById(id);
    openEditorWithTrip(trip, false);
  } catch (e) {
    showToast('Could not load that trip.');
  }
}

function collectBasicFieldsIntoTrip() {
  const f = (id) => document.getElementById(id);
  currentTrip.traveller.tripId = f('f_tripId').value.trim() || newTripId(f('f_travellerName').value);
  currentTrip.meta.stage = f('f_stage').value;
  currentTrip.meta.tripName = f('f_tripName').value;
  currentTrip.meta.companyName = f('f_companyName').value || 'EFL Global';
  currentTrip.traveller.name = f('f_travellerName').value;
  currentTrip.traveller.position = f('f_position').value;
  currentTrip.traveller.photoInitials = f('f_initials').value || initials(f('f_travellerName').value);
  currentTrip.traveller.destination = f('f_destination').value;
  currentTrip.traveller.dates = f('f_dates').value;

  const hasNextEvent = f('ne_airline').value || f('ne_flightNumber').value || f('ne_route').value;
  currentTrip.nextEvent = hasNextEvent ? {
    type: 'flight',
    airline: f('ne_airline').value, flightNumber: f('ne_flightNumber').value, status: f('ne_status').value,
    route: f('ne_route').value, date: f('ne_date').value, departure: f('ne_departure').value, arrival: f('ne_arrival').value,
    terminal: f('ne_terminal').value, gate: f('ne_gate').value, seat: f('ne_seat').value
  } : null;

  currentTrip.status.documentsReady = f('st_documents').checked;
  currentTrip.status.hotelsConfirmed = f('st_hotels').checked;
  currentTrip.status.transportArranged = f('st_transport').checked;

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

/* ---------------- Init ---------------- */

function openSidebar() { document.getElementById('sidebar').classList.add('open'); document.getElementById('sidebarOverlay').classList.add('open'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebarOverlay').classList.remove('open'); }

function backToList() {
  document.getElementById('view-editor').hidden = true;
  document.getElementById('view-list').hidden = false;
  document.getElementById('topnavTitle').textContent = 'All Trips';
  document.getElementById('backBtn').classList.add('hidden');
  currentTrip = null;
  renderTripsList();
}

function init() {
  document.getElementById('menuBtn').addEventListener('click', openSidebar);
  document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);
  document.getElementById('backBtn').addEventListener('click', backToList);
  document.querySelector('.sidebar-link[data-view="list"]').addEventListener('click', backToList);

  document.getElementById('newTripBtn').addEventListener('click', () => openEditorWithTrip(blankTrip(), true));
  document.getElementById('navNewTrip').addEventListener('click', () => openEditorWithTrip(blankTrip(), true));

  const importFile = document.getElementById('importFile');
  document.getElementById('importBtn').addEventListener('click', () => importFile.click());
  document.getElementById('navImport').addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const trip = JSON.parse(reader.result);
        if (!trip.traveller || !trip.traveller.tripId) trip.traveller.tripId = newTripId(trip.traveller?.name);
        openEditorWithTrip(trip, false);
        showToast('Imported — review and Save to keep it.');
      } catch (err) { showToast('That file is not valid trip JSON.'); }
    };
    reader.readAsText(file);
    importFile.value = '';
  });

  document.getElementById('cancelEditBtn').addEventListener('click', backToList);
  document.getElementById('saveTripBtn').addEventListener('click', saveTrip);
  document.getElementById('clearNextEventBtn').addEventListener('click', () => {
    ['ne_airline','ne_flightNumber','ne_route','ne_date','ne_departure','ne_arrival','ne_terminal','ne_gate','ne_seat'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('ne_status').value = 'On Time';
    showToast('Next Event cleared — Save to apply.');
  });

  document.getElementById('addDayBtn').addEventListener('click', () => {
    currentTrip.itinerary.push({ day: currentTrip.itinerary.length + 1, date: '', city: '', events: [] });
    renderItinerary();
  });
  document.getElementById('addFlightBtn').addEventListener('click', () => { currentTrip.flights.push({ airline: '', flightNumber: '', route: '', date: '', departure: '', arrival: '', class: 'Business', seat: '', pnr: '', document: '' }); renderSimpleSections(); });
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
    if (currentIsNew) { backToList(); return; }
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
    backToList();
  });

  document.getElementById('toastClose').addEventListener('click', () => document.getElementById('toast').classList.remove('show'));

  renderTripsList();
}

document.addEventListener('DOMContentLoaded', init);
