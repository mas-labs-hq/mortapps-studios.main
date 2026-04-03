/**
 * ============================================================
 * TaskFlow Pro — Service Worker
 * MortApps Studios
 *
 * HOW TO PUSH UPDATES TO ALL INSTALLED PWA USERS:
 * ─────────────────────────────────────────────────
 * 1. Make your changes to the app files.
 * 2. Increment CACHE_VERSION below (e.g. '4.0' → '4.1').
 * 3. Deploy / upload all files to your server.
 *
 * What happens automatically:
 * • The browser detects the new SW file has changed.
 * • It installs the new SW and caches all fresh assets.
 * • It activates, deletes the old cache, and posts a
 *   SW_UPDATED message to every open tab.
 * • The app receives that message, shows a "Updating…"
 *   toast, and reloads within 2.5 seconds — seamlessly.
 * ============================================================
 */

// ── CHANGE THIS EVERY TIME YOU DEPLOY AN UPDATE ──────────
const CACHE_VERSION = '4.0';
// ─────────────────────────────────────────────────────────

const CACHE_NAME = 'taskflow-pro-v' + CACHE_VERSION;

// All files that must be cached for the app to work offline.
// If you add new files (icons, screenshots, etc.) add them here too.
const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './wide-screenshot.png',
    // Icons — add any sizes you have in your /icons/ folder
    './icons/android-chrome-192x192.png',
    './icons/android-chrome-512x512.png',
    './icons/apple-touch-icon.png',
    './icons/favicon-32x32.png',
    './icons/favicon-16x16.png',
    // External CDN — cached on first visit so the app works offline afterwards
    'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// ── INSTALL ──────────────────────────────────────────────
// Fires when this SW version is first detected.
// Opens a new cache and pre-caches every asset.
// skipWaiting() makes it take over immediately without waiting
// for existing tabs to close.
self.addEventListener('install', event => {
    console.log('[SW] Installing version:', CACHE_VERSION);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => Promise.all(
                STATIC_ASSETS.map(url =>
                    cache.add(url).catch(err =>
                        console.warn('[SW] Could not cache:', url, err)
                    )
                )
            ))
            .then(() => {
                console.log('[SW] All assets cached.');
                return self.skipWaiting(); // activate immediately
            })
    );
});

// ── ACTIVATE ─────────────────────────────────────────────
// Fires after install. Deletes every old cache that belongs
// to this app but isn't the current version, then claims all
// open clients so they're controlled by this SW right away.
// Finally, broadcasts SW_UPDATED so the app can show a toast
// and reload to serve the freshly cached files.
self.addEventListener('activate', event => {
    console.log('[SW] Activating version:', CACHE_VERSION);
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(k => k.startsWith('taskflow-pro-') && k !== CACHE_NAME)
                    .map(k => {
                        console.log('[SW] Deleting stale cache:', k);
                        return caches.delete(k);
                    })
            ))
            .then(() => self.clients.claim()) // take control of all tabs
            .then(() =>
                // Notify every open tab that a new version is live
                self.clients.matchAll({ includeUncontrolled: true, type: 'window' })
                    .then(clients => {
                        clients.forEach(client =>
                            client.postMessage({
                                type: 'SW_UPDATED',
                                version: CACHE_VERSION
                            })
                        );
                    })
            )
    );
});

// ── FETCH ─────────────────────────────────────────────────
// Two strategies:
//   • HTML navigation requests  → Network-first (always try to get the
//     freshest page; fall back to cache if offline).
//   • Everything else (CSS, JS, fonts, images) → Cache-first with a
//     background network update so the cache stays warm.
self.addEventListener('fetch', event => {
    const req = event.request;

    // Only handle GET requests
    if (req.method !== 'GET') return;

    // ── Strategy A: Network-first for HTML navigation ──
    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req)
                .then(response => {
                    // Store a fresh copy in cache before returning
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(c => c.put(req, clone));
                    return response;
                })
                .catch(() =>
                    // Network failed — serve cached page or shell
                    caches.match(req)
                        .then(cached => cached || caches.match('./index.html'))
                )
        );
        return;
    }

    // ── Strategy B: Cache-first for static assets ──
    event.respondWith(
        caches.match(req).then(cached => {
            // Kick off a background network request to refresh the cache
            const networkFetch = fetch(req)
                .then(response => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(c => c.put(req, clone));
                    }
                    return response;
                })
                .catch(() => cached); // network failed, we'll use cache below

            // Return cached version instantly; network updates cache in background
            return cached || networkFetch;
        })
    );
});

// ── MESSAGES ─────────────────────────────────────────────
// The app can send messages to the SW for manual control.
self.addEventListener('message', event => {
    if (event.data?.type === 'SKIP_WAITING') {
        // Force this SW to activate even if tabs are still open
        self.skipWaiting();
    }
    if (event.data?.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME).then(() =>
            console.log('[SW] Cache cleared on request.')
        );
    }
});

// ── BACKGROUND SYNC ──────────────────────────────────────
// Placeholder — extend this for future offline-queue features
self.addEventListener('sync', event => {
    if (event.tag === 'sync-tasks') {
        event.waitUntil(
            Promise.resolve().then(() =>
                console.log('[SW] Background sync: sync-tasks (placeholder)')
            )
        );
    }
});

console.log('[SW] Service Worker loaded. Version:', CACHE_VERSION);