//sw.js
const staticAssets = [
    "/",
    "/index.html",
    "/404.html",
    "/offline.html",
    "audio/article 1",
    "audio/article 2",
    "audio/article 3"
"audio/article 4",
"audio/article 5",
"audio/article 6",
"audio/article 7",
"audio/article 8",
"audio/article 9",
"audio/article 10",
"audio/article 11",
"audio/article 12",
"audio/article 13",
"audio/article 14",
"audio/article 15",
"audio/article 16",
"audio/article 17",
"audio/article 18",
"audio/article 19",
"audio/article 20",
"audio/article 21",
"audio/article 22",
"audio/article 23",
"audio/article 24",
"audio/article 25",
"audio/article 26",
"audio/article 27",
"audio/article 28",
"audio/article 29",
"audio/article 30",
"audio/article 31",
"audio/article 32",
"audio/article 33",
"audio/article 34",
"audio/article 35",
"audio/article 36",
"audio/article 37",
"audio/article 38",
"audio/article 39",
"audio/article 40",
"audio/article 41",
"audio/article 42",
"audio/article 43",
"audio/article 44",
"audio/article 45",
"audio/article 46",
"audio/article 47",
"audio/article 48",
"audio/article 49",
"audio/article 50",
"audio/article 51",
"audio/article 52",
"audio/article 53",
"audio/article 54",
"audio/article 55",
"audio/article 56",
"audio/article 57",
"audio/article 58",
"audio/article 59",
"audio/article 60",
"audio/article 61",
"audio/article 62",
"audio/article 63",
"audio/article 64",
"audio/article 65",
"audio/article 66",
"audio/article 67",
"audio/article 68",
"audio/article 69",
"audio/article 70",
"audio/article 71",
"audio/article 72",
"audio/article 73",
"audio/article 74",
"audio/article 75",
"audio/article 76",
"audio/article 77",
"audio/article 78",
"audio/article 79",
"audio/article 80",
"audio/article 81",
"audio/article 82",
"audio/article 83",
"audio/article 84",
"audio/article 85",
"audio/article 86",
"audio/article 87",
"audio/article 88",
"audio/article 89",
"audio/article 90",
"audio/article 91",
"audio/article 92",
"audio/article 93",
"audio/article 94",
"audio/article 95",
"audio/article 96",
"audio/article 97",
"audio/article 98",
"audio/article 99",

    "photos/Flag-of-Congo-01.svg",
    "photos/images.png",
  ];
  let cacheVersion = 0;
  let cacheName = `cache-v${cacheVersion}`;
  function increment() {
    cacheVersion++;
    cacheName = `cache-v${cacheVersion}`;
  }
  importScripts('https://cdn.jsdelivr.net/npm/idb@4.0.3/build/iife/index-min.js');

let db;

const initializeDatabase = async () => {
  db = await idb.openDB('yourDatabaseName', 1, {
    upgrade(db) {
      db.createObjectStore('staticAssets');
    },
  });
};

const addToCache = async (url, response) => {
  await db.put('staticAssets', response.clone(), url);
  return response;
};

const getFromCache = async (request) => {
  const cachedResponse = await db.get('staticAssets', request.url);
  if (cachedResponse) {
    return cachedResponse;
  }

  return fetch(request);
};

self.addEventListener('install', (event) => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    initializeDatabase()
      .then(() => console.log('Database initialized successfully'))
      .catch((err) => console.error('Error initializing database:', err))
  );
});

self.addEventListener('fetch', (event) => {
  console.log('Fetch event for', event.request.url);

  event.respondWith(
    getFromCache(event.request)
      .then((response) => {
        if (response) {
          console.log('Found', event.request.url, 'in cache');
          return response;
        }

        return fetch(event.request)
          .then((response) => addToCache(event.request.url, response))
          .catch((error) => {
            console.error('Fetching Error:', error);
            return caches.open(cacheName).then((cache) => cache.match('offline.html'));
          });
      })
      .catch((error) => {
        console.error('Error getting from cache:', error);
        return caches.open(cacheName).then((cache) => cache.match('offline.html'));
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Activating new service worker...');
});
