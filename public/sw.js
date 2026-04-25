const CACHE_NAME = 'license-plate-cache-v1';

// Install the service worker immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Take control of the page immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Intercept network requests
self.addEventListener('fetch', (event) => {
  // We only want to cache standard GET requests (like images and scripts)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If the network request works, save a copy to the cache for later
        if (!response || (response.status !== 200 && response.type !== 'opaque')) {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // IF THE NETWORK FAILS (OFFLINE), PULL DIRECTLY FROM CACHE
        return caches.match(event.request);
      })
  );
});
