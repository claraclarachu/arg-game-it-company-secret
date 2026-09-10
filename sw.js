const CACHE = 'cc-v2';
self.addEventListener('install', event => {
  // Skip caching at install; let fetch handler populate cache on demand
  event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  const req = event.request;
  // Bypass for Vite HMR and dev server
  if (req.url.includes('/@vite/') || req.url.includes('/__vite')) return;
  // For navigation requests (HTML), use network-first
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req).then(res => {
        // Cache successful navigation response
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(req, clone));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('/index.html')))
    );
    return;
  }
  // For other assets (JS/CSS/images), use stale-while-revalidate
  event.respondWith(
    caches.match(req).then(cached => {
      const fetched = fetch(req).then(networkRes => {
        if (networkRes && networkRes.ok) {
          const clone = networkRes.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
        }
        return networkRes;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
