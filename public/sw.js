const CACHE = "ming-menu-v1";

self.addEventListener("install", (e) => e.waitUntil(self.skipWaiting()));
self.addEventListener("activate", (e) =>
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
);

// Stale-while-revalidate: serve the cached copy instantly (works offline / on bad wifi),
// then refresh it from the network in the background so the next visit gets the update.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;

  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      const fresh = fetch(req)
        .then((res) => {
          if (res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || fresh;
    })
  );
});
