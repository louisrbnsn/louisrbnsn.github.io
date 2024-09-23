const CACHE_NOM = 'pwa-cache-v1';
const urlsAEnregistrer = [
  '/',
  '/index.html',
  '/styles.css',
  '/js/nations.js',
  '/icon/192x192.png',
  '/icon/512x512.png'
];

self.addEventListener('install', (evenement) => {
  evenement.waitUntil(
    caches.open(CACHE_NOM)
      .then((cache) => cache.addAll(urlsAEnregistrer))
  );
});

self.addEventListener('fetch', (evenement) => {
  evenement.respondWith(
    caches.match(evenement.request)
      .then((reponse) => reponse || fetch(evenement.request))
  );
});