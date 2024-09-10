const CACHE_NAME = 'static-cache-v6';
const FILES_TO_CACHE = [
    './index.html',
    './support.html',
    './tarif.html',
    './css/styles.css',
    './js/main.js',
    './img/icon_192.png',
    './img/icon_512.png',
    './img/icon_144.png',
    './img/icon_96.png'
];

self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');
    evt.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[ServiceWorker] Pre-caching offline resources');
                return cache.addAll(FILES_TO_CACHE).catch((error) => {
                    console.error('[ServiceWorker] Failed to cache files:', error);
                });
            })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
    console.log('[ServiceWorker] Fetch', evt.request.url);
    evt.respondWith(
        caches.match(evt.request)
            .then((response) => {
                return response || fetch(evt.request);
            })
            .catch((error) => {
                console.error('[ServiceWorker] Fetch error:', error);
            })
    );
});