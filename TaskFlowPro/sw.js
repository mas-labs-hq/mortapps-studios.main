/**
 * TaskFlow Pro Service Worker
 * Version: 3.1.0 - Wavy background, PWA install fix, auto-update system
 * 
 * HOW UPDATES WORK:
 * 1. Change CACHE_VERSION below when you update any file
 * 2. Users will automatically get the new version on next visit
 * 3. The old cache is cleaned up automatically
 * 4. PWA users will receive updates automatically
 * 
 * AUTO-REFRESH:
 * - PWA checks for SW updates on each visit
 * - If SW version changed, app auto-reloads
 * 
 * ALL APP LOGIC IS IN script.js - Edit there for functionality changes
 */

// ============================================
// ⚙️ CHANGE THIS VERSION WHEN YOU UPDATE THE APP
// ============================================
const CACHE_VERSION = '3.1.0';
const CACHE_NAME = 'taskflow-pro-v' + CACHE_VERSION;

// ============================================
// 📦 FILES TO CACHE FOR OFFLINE USE
// ============================================
const STATIC_ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './wide-screenshot.png',
    './icons/android-chrome-192x192.png',
    './icons/android-chrome-512x512.png',
    './icons/apple-touch-icon.png',
    './icons/favicon-16x16.png',
    './icons/favicon-32x32.png',
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// ============================================
// 🔄 INSTALL EVENT - Cache static assets
// ============================================
self.addEventListener('install', function(event) {
    console.log('[SW] Installing version:', CACHE_VERSION);
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('[SW] Caching static assets');
                // Cache files individually to handle failures gracefully
                return Promise.all(
                    STATIC_ASSETS.map(function(url) {
                        return cache.add(url).catch(function(err) {
                            console.warn('[SW] Failed to cache:', url, err);
                        });
                    })
                );
            })
            .then(function() {
                console.log('[SW] All assets cached');
                // Force activation of new service worker immediately
                return self.skipWaiting();
            })
    );
});

// ============================================
// ⚡ ACTIVATE EVENT - Clean old caches & Take control
// ============================================
self.addEventListener('activate', function(event) {
    console.log('[SW] Activating version:', CACHE_VERSION);
    
    event.waitUntil(
        caches.keys()
            .then(function(cacheNames) {
                return Promise.all(
                    cacheNames
                        .filter(function(cacheName) {
                            // Delete any cache that isn't our current version
                            return cacheName.startsWith('taskflow-pro-') && cacheName !== CACHE_NAME;
                        })
                        .map(function(cacheName) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(function() {
                console.log('[SW] Old caches cleared');
                // Take control of all pages immediately
                return self.clients.claim();
            })
            .then(function() {
                // Notify all clients that a new version is available
                return self.clients.matchAll().then(function(clients) {
                    clients.forEach(function(client) {
                        client.postMessage({
                            type: 'SW_UPDATED',
                            version: CACHE_VERSION
                        });
                    });
                });
            })
    );
});

// ============================================
// 🌐 FETCH EVENT - Cache-first for static assets
// ============================================
self.addEventListener('fetch', function(event) {
    const request = event.request;
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Skip cross-origin requests (like APIs, CDN, etc.)
    if (!request.url.startsWith(self.location.origin)) return;
    
    // For navigation requests (HTML pages), use network-first strategy
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(function(response) {
                    // Clone response before caching
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(function() {
                    // If network fails, try cache
                    return caches.match(request)
                        .then(function(response) {
                            return response || caches.match('./index.html');
                        });
                })
        );
        return;
    }
    
    // For static assets, use cache-first strategy with network update
    event.respondWith(
        caches.match(request)
            .then(function(cachedResponse) {
                // Return cached version immediately if available
                const fetchPromise = fetch(request)
                    .then(function(networkResponse) {
                        // Update cache with fresh version
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME).then(function(cache) {
                                cache.put(request, responseClone);
                            });
                        }
                        return networkResponse;
                    })
                    .catch(function() {
                        // Network failed, rely on cache
                        return cachedResponse;
                    });
                
                // Return cache immediately, but update in background
                return cachedResponse || fetchPromise;
            })
    );
});

// ============================================
// 💬 MESSAGE HANDLING - For manual cache clear and skip waiting
// ============================================
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('[SW] Skip waiting requested');
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME).then(function() {
            console.log('[SW] Cache cleared');
        });
    }
});

// ============================================
// 🔄 BACKGROUND SYNC - For future offline features
// ============================================
self.addEventListener('sync', function(event) {
    if (event.tag === 'sync-tasks') {
        event.waitUntil(syncPendingTasks());
    }
});

function syncPendingTasks() {
    // Placeholder for future offline task sync functionality
    console.log('[SW] Syncing pending tasks...');
    return Promise.resolve();
}

console.log('[SW] Service Worker loaded, version:', CACHE_VERSION);