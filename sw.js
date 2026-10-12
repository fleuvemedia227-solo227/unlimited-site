// Service worker Unlimited Niger : l'application s'ouvre même sans réseau (écran, logos, images),
// et se met à jour toute seule dès qu'il y a du réseau. Les données personnelles (/api) ne sont jamais mises en cache ici.
const VERSION = 'un-2026-10-11-revue-1';
// Au premier lancement : seulement l'écran et les icônes. Les logos se gardent au fur et à mesure qu'ils s'affichent.
const SHELL = ['/', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png', '/UnlimitedNiger-icone.png', '/icon-sante.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => Promise.all(SHELL.map((u) => c.add(new Request(u, { cache: 'reload' })).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request; const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/')) return;   // jamais les données
  // Pages (accueil, admin) : d'abord le réseau (toujours la dernière version), sinon la copie gardée
  if (req.mode === 'navigate') {
    const key = url.pathname.startsWith('/admin') ? '/admin' : '/';
    e.respondWith(fetch(req).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(VERSION).then((c) => c.put(key, cp)); } return res; })
      .catch(() => caches.match(key).then((r) => r || caches.match('/'))));
    return;
  }
  // Images, logos, icônes : la copie gardée tout de suite, mise à jour en arrière-plan
  if (/\.(png|jpe?g|svg|webp|webmanifest)$/i.test(url.pathname)) {
    e.respondWith(caches.open(VERSION).then((c) => c.match(req).then((hit) => {
      const net = fetch(req).then((res) => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })));
  }
});
