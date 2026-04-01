/**
 * TaskFlow Pro Service Worker
 * Version: 3.2.1 - Subdirectory hosting fix, reliable install detection
 * 
 * HOSTING NOTE: This SW is designed for subdirectory deployment (e.g., /TaskFlowPro/)
 * All paths are relative to the manifest location.
 */

// ============================================
// ⚙️ VERSION - INCREMENT TO FORCE UPDATES
// ============================================
const CACHE_VERSION = '3.2.1';
const CACHE_NAME = 'taskflow-pro-v' + CACHE_VERSION;

// ============================================
// 📦 FILES TO CACHE (Relative Paths for Subdirectory)
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
// 🔄 INSTALL EVENT
// ============================================
self.addEventListener('install', function(event) {
    console.log('[SW] Installing version:', CACHE_VERSION);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('[SW] Caching assets');
                return Promise.all(
                    STATIC_ASSETS.map(function(url) {
                        return cache.add(url).catch(function(err) {
                            console.warn('[SW] Cache miss (non-critical):', url, err);
                        });
                    })
                );
            })
            .then(() => self.skipWaiting())
    );
});

// ============================================
// ⚡ ACTIVATE EVENT - Clean old caches
// ============================================
self.addEventListener('activate', function(event) {
    console.log('[SW] Activating version:', CACHE_VERSION);
    event.waitUntil(
        caches.keys()
            .then(function(cacheNames) {
                return Promise.all(
                    cacheNames
                        .filter(function(name) {
                            return name.startsWith('taskflow-pro-') && name !== CACHE_NAME;
                        })
                        .map(function(name) {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
            .then(function() {
                return self.clients.matchAll().then(function(clients) {
                    clients.forEach(function(client) {
                        client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION });
                    });
                });
            })
    );
});

// ============================================
// 🌐 FETCH EVENT - Cache-first with network update
// ============================================
self.addEventListener('fetch', function(event) {
    const request = event.request;
    if (request.method !== 'GET') return;
    
    // Only handle same-origin requests
    if (!request.url.startsWith(self.location.origin)) return;
    
    // Navigation requests: network-first
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(function(response) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                    return response;
                })
                .catch(() => caches.match(request).then(r => r || caches.match('./index.html')))
        );
        return;
    }
    
    // Static assets: cache-first with background update
    event.respondWith(
        caches.match(request)
            .then(function(cached) {
                const networkFetch = fetch(request)
                    .then(function(response) {
                        if (response && response.status === 200) {
                            const clone = response.clone();
                            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                        }
                        return response;
                    })
                    .catch(() => cached);
                
                return cached || networkFetch;
            })
    );
});

// ============================================
// 💬 MESSAGE HANDLING
// ============================================
self.addEventListener('message', function(event) {
    if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
    if (event.data?.type === 'CLEAR_CACHE') caches.delete(CACHE_NAME);
});

console.log('[SW] Loaded, version:', CACHE_VERSION, 'scope:', self.registration?.scope || 'pending');
