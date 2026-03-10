// ============================================================
//  service-worker.js — PWA Offline Caching
//  King Trading Co.
// ============================================================

const CACHE_NAME    = "king-trading-v1";
const OFFLINE_URL   = "index.html";

// Files to cache on install
const PRECACHE_URLS = [
  "index.html",
  "cart.html",
  "css/style.css",
  "js/app.js",
  "js/cart.js",
  "js/firebase.js",
  "manifest.json"
];

// ── Install: pre-cache shell ──
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// ── Activate: clean old caches ──
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch: network-first for API, cache-first for assets ──
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Skip non-GET and Firebase API requests
  if (event.request.method !== "GET") return;
  if (url.hostname.includes("firestore.googleapis.com")) return;
  if (url.hostname.includes("firebase")) return;
  if (url.hostname.includes("gstatic.com")) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached || caches.match(OFFLINE_URL));

      return cached || fetchPromise;
    })
  );
});
