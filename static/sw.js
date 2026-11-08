/**
 * Wheat Doctor AI — Offline Service Worker (sw.js)
 * Caches core application shell, styles, vision engine, and calibrated wheat samples
 * for 100% offline field operation on Android phones.
 */
const CACHE_NAME = 'wheat-doctor-v2.0.0';
const OFFLINE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './static/style.css',
  './static/vision_engine.js',
  './static/app.js',
  './static/icons/icon-192.png',
  './static/icons/icon-512.png',
  './static/samples/wheat_healthy.jpg',
  './static/samples/wheat_stripe_rust.jpg',
  './static/samples/wheat_leaf_rust.jpg',
  './static/samples/wheat_powdery_mildew.jpg',
  './static/samples/wheat_septoria_blotch.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
