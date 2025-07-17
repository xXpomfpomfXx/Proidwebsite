// Service Worker for Urban Quest PWA
const CACHE_NAME = 'urban-quest-v1.0.0';
const STATIC_CACHE = 'urban-quest-static-v1.0.0';
const DYNAMIC_CACHE = 'urban-quest-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/pages/about.html',
    '/pages/contact.html',
    '/pages/minecraft.html',
    '/pages/partners.html',
    '/pages/quest-stations.html',
    '/pages/rewards.html',
    '/styles/main.css',
    '/styles/animations.css',
    '/styles/chatbot.css',
    '/styles/advanced-features.css',
    '/scripts/main.js',
    '/scripts/background.js',
    '/scripts/balatro.js',
    '/scripts/beams.js',
    '/scripts/beams-bg.js',
    '/scripts/chatbot.js',
    '/scripts/contact.js',
    '/scripts/dynamic-bg.js',
    '/scripts/quest-stations.js',
    '/scripts/progress-tracker.js',
    '/scripts/advanced-chatbot.js',
    '/scripts/minecraft-3d.js',
    '/scripts/advanced-search.js',
    '/manifest.json'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Error caching static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Handle different types of requests
    if (request.destination === 'document' || request.destination === '') {
        // HTML pages
        event.respondWith(handlePageRequest(request));
    } else if (request.destination === 'style' || request.destination === 'script') {
        // CSS and JS files
        event.respondWith(handleStaticRequest(request));
    } else if (request.destination === 'image') {
        // Images
        event.respondWith(handleImageRequest(request));
    } else {
        // Other resources
        event.respondWith(handleOtherRequest(request));
    }
});

// Handle page requests
async function handlePageRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Cache the response
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
    } catch (error) {
        console.log('Network failed for page:', request.url);
    }

    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    // Fallback to offline page
    return caches.match('/offline.html');
}

// Handle static file requests
async function handleStaticRequest(request) {
    // Try cache first for static files
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        // Try network
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Cache the response
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
    } catch (error) {
        console.log('Network failed for static file:', request.url);
    }

    // Return empty response if both cache and network fail
    return new Response('', { status: 404 });
}

// Handle image requests
async function handleImageRequest(request) {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        // Try network
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Cache the response
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
    } catch (error) {
        console.log('Network failed for image:', request.url);
    }

    // Return a placeholder image or empty response
    return new Response('', { status: 404 });
}

// Handle other requests
async function handleOtherRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            return networkResponse;
        }
    } catch (error) {
        console.log('Network failed for other request:', request.url);
    }

    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    // Return empty response
    return new Response('', { status: 404 });
}

// Background sync for offline actions
self.addEventListener('sync', event => {
    console.log('Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// Handle background sync
async function doBackgroundSync() {
    try {
        // Sync any pending data
        const pendingData = await getPendingData();
        
        for (const data of pendingData) {
            try {
                await syncData(data);
                await removePendingData(data.id);
            } catch (error) {
                console.error('Failed to sync data:', error);
            }
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Get pending data from IndexedDB
async function getPendingData() {
    // This would typically use IndexedDB
    // For now, return empty array
    return [];
}

// Sync data to server
async function syncData(data) {
    const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error('Sync failed');
    }
    
    return response.json();
}

// Remove pending data
async function removePendingData(id) {
    // This would typically use IndexedDB
    console.log('Removing pending data:', id);
}

// Push notification handling
self.addEventListener('push', event => {
    console.log('Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New update available!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Explore',
                icon: '/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icons/xmark.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Urban Quest', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked:', event.notification.tag);
    
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        return;
    } else {
        // Default action
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
    console.log('Service Worker received message:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Error handling
self.addEventListener('error', event => {
    console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('Service Worker unhandled rejection:', event.reason);
}); 