// Service Worker for Travel Itinerary Planner
const CACHE_NAME = 'travel-itinerary-cache-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/offline',
  '/styles/globals.css',
  '/favicon.ico',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Don't cache API requests
                if (!event.request.url.includes('/api/')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        ).catch(() => {
          // If both cache and network fail, show offline page
          if (event.request.mode === 'navigate') {
            return caches.match('/offline');
          }
        });
      })
  );
});

// Handle offline sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-itinerary-changes') {
    event.waitUntil(syncItineraryChanges());
  }
});

// Function to sync offline changes when back online
async function syncItineraryChanges() {
  try {
    const offlineChanges = JSON.parse(localStorage.getItem('offlineChanges') || '[]');
    if (offlineChanges.length === 0) return;

    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ changes: offlineChanges }),
    });

    if (response.ok) {
      localStorage.removeItem('offlineChanges');
      console.log('Successfully synced offline changes');
    }
  } catch (error) {
    console.error('Failed to sync offline changes:', error);
  }
}

// Global CSS Styles
