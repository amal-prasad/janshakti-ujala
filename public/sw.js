// Service worker for जनशक्ति उजाला (Janshakti Ujala).
// Policy: this is a NEWS site — stale content is the enemy.
// - Cache-first ONLY for immutable/hashed assets (/_next/static/, app icons).
// - Navigations are network-first; cache is an offline fallback only.
// - /api/ and everything else: network only (never intercepted).

const STATIC_CACHE = "ju-static-v1";
const PAGES_CACHE = "ju-pages-v1";
const CACHES = [STATIC_CACHE, PAGES_CACHE];

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !CACHES.includes(k)).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

// Hashed Next.js build assets and app icons — safe to serve cache-first forever.
function isImmutableAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    /^\/icon-(192|512)\.png$/.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // API and data routes: network only — breaking news must never be stale.
  if (url.pathname.startsWith("/api/")) return;

  if (isImmutableAsset(url)) {
    // Cache-first, populated at runtime (hashed filenames aren't knowable ahead of time).
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then(
          (cached) =>
            cached ||
            fetch(request).then((response) => {
              if (response.ok) cache.put(request, response.clone());
              return response;
            })
        )
      )
    );
    return;
  }

  if (request.mode === "navigate") {
    // Network-first: fresh HTML always wins; cache is only the offline fallback.
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(PAGES_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
  // Everything else: fall through to the network untouched.
});
