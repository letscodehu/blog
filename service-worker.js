const CACHE_VERSION = 2;
const CURRENT_CACHES = {
    offline: 'offline-v' + CACHE_VERSION,
};
importScripts('https://unpkg.com/lunr@2.3.9/lunr.js');
importScripts('/documents.js');

// Sample data for indexing
// Initialize Lunr.js
const index = lunr(function() {
    this.ref('id');
    this.field('title');
    this.field('body');

    documents.forEach(function(doc) {
        this.add(doc);
    }, this);
});

// Service Worker for caching resources
self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

// service-worker.js
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CURRENT_CACHES.offline) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Claim clients to activate the new service worker immediately
    self.clients.claim();
});
// Listen for messages from the client to perform search
self.addEventListener('message', event => {
    if (event.data.action === 'search') {
        const query = event.data.query;
        const results = index.search(query);
        for (var i = 0; i < results.length; i++) {
            var ref = results[i]['ref'];
            results[i]['url'] = documents[ref]['url'];
            results[i]['title'] = documents[ref]['title'];
            results[i]['body'] = documents[ref]['body'].substring(0, 160) + '...';
        }
        // Respond to the client with search results
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    action: 'searchResults',
                    term: query,
                    results: results,
                });
            });
        });
    }
});
