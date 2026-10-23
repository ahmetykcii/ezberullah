// VELUNO service worker — çevrimdışı: yalnızca önbelleğe alınmış uygulama dosyaları + yerel veri.
// Sürüm değişince eski önbellek silinir. Yol bağımsız (GitHub Pages alt dizini için göreli).
const VERSION = 'veluno-v3.1.0';
const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'manifest.json', 'css/style.css',
  'js/app.js', 'js/storage.js', 'js/engine.js', 'js/vocabulary.js', 'js/vocab-ui.js', 'js/learning.js', 'js/review.js',
  'js/exams.js', 'js/statistics.js', 'js/import-export.js', 'js/ui.js', 'js/grammar-data.js', 'js/grammar.js',
  'data/a2.json', 'data/b1.json', 'data/b2.json',
  'assets/icons/icon.svg', 'assets/icons/logo-full.svg', 'assets/icons/apple-touch-icon.png', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/icons/icon-maskable-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION).then((c) =>
      c.addAll(FILES.map((u) => new Request(u, { cache: 'reload' }))).catch(() => c.addAll(FILES))
    )
  );
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', (e) => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

// Stale-while-revalidate (yalnızca aynı kaynak, GET)
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const hit = await cache.match(req, { ignoreSearch: true });
      const net = fetch(req).then((r) => { if (r && r.ok) cache.put(req, r.clone()); return r; }).catch(() => null);
      if (hit) { net.catch(() => {}); return hit; }
      const r = await net;
      return r || (req.mode === 'navigate' ? cache.match('index.html') : new Response('', { status: 504 }));
    })
  );
});
