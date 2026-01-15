const cache_name = "sr-radio-cache-v1";
const files_to_cache = [
    "/",
    "/index.html",
    "/app.js",
    "/PWA-icon.png",
    "/PWA-icon192x192.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(cache_name).then(cache => {
            return cache.addAll(files_to_cache);
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

