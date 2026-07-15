/* EFL Global Executive Travel Portal — Service Worker */

const CACHE_NAME = 'efl-travel-portal-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './data/trip.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first for trip.json (always try fresh data), cache-first for everything else.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (url.pathname.endsWith('trip.json')) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});

// Allow the app to request an explicit full cache-refresh (e.g. "Offline Mode" toggle).
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_TRIP') {
    event.waitUntil(
      fetch('./data/trip.json')
        .then((res) => res.json())
        .then((trip) => {
          const urls = new Set(CORE_ASSETS);
          const collect = (obj) => {
            if (!obj) return;
            if (Array.isArray(obj)) return obj.forEach(collect);
            if (typeof obj === 'object') {
              Object.entries(obj).forEach(([k, v]) => {
                if ((k === 'file' || k === 'document') && typeof v === 'string') urls.add(v);
                else collect(v);
              });
            }
          };
          collect(trip);
          return caches.open(CACHE_NAME).then((cache) => cache.addAll([...urls]).catch(() => {}));
        })
    );
  }
});
