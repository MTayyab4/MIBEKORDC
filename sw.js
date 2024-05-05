const staticAssets = [
    "/",
    "/index.html",
    "audio/article1.mp3",
    "audio/article2.mp3",
    // Add other audio files here
    "photos/Flag-of-Congo-01.svg",
    "photos/images.png"
];

const cacheName = 'cache-v1';

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                return cache.addAll(staticAssets);
            })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((storedCacheName) => {
                    if (storedCacheName !== cacheName) {
                        return caches.delete(storedCacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then((fetchResponse) => {
                        return caches.open(cacheName)
                            .then((cache) => {
                                cache.put(event.request, fetchResponse.clone());
                                return fetchResponse;
                            });
                    });
            })
            .catch(() => {
                return caches.match('offline.html');
            })
    );
});
