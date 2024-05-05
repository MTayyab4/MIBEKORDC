//sw.js
const staticAssets = [
    "/",
    "/index.html",
    "/404.html",
    "/offline.html",
    "audio/article_1.mp3",
    "audio/article 2.mp3",
     "audio/article 3.mp3",
"audio/article 4.mp3",
"audio/article 5.mp3",
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
    "photos/Flag-of-Congo-01.svg",
    "photos/images.png"
  ];
  let cacheVersion = 0;
  let cacheName = `cache-v${cacheVersion}`;
  function increment() {
    cacheVersion++;
    cacheName = `cache-v${cacheVersion}`;
  }
  
  //Add cache while installing Sw
  self.addEventListener("install", (event) => {
    console.log("Attempting to install service worker and cache static assets");
    event.waitUntil(
      caches
        .open(cacheName)
        .then((cache) => {
          //Update version
          console.log("previous version", cacheVersion)
          increment();
          console.log("new version", cacheVersion)
          //add files to the cache
          console.log("adding cache" , cache.addAll(staticAssets))
  
          return cache.addAll(staticAssets);
        })
        .catch((err) => console.log(err))
    );
  });
  
  self.addEventListener("activate", (event) => {
    console.log("Activating new service worker...");
  
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        console.log("activating cacheName ", cacheName)
        return Promise.all(
          cacheNames.map((storedCacheName) => {
            if (storedCacheName !== cacheName) {
              console.log("Deleting old cache ", storedCacheName)
              return caches.delete(storedCacheName);
            }
          })
        );
      })
    );
  });
  
  self.addEventListener("fetch", (event) => {
    console.log("Fetch event for", event.request.url);
  
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => {
          //If the response is found in the cache
          console.log("fetch response", response);
          if (response) {
            console.log("Found ", event.request.url, " in cache");
            return response;
          }
  
          return fetch(event.request).then((response) => {
            // If a response is not found
            console.log("fetch if (404) response", response);
  
            if (response.status === 404) {
              return caches.open(cacheName).then((cache) => {
                console.log("fetch return (404) response", response);
  
                return cache.match("404.html");
              });
            }
  
            //Caching and returning the response if it doesn't exist in the cache
            return caches.open(cacheName).then((cache) => {
              console.log("fetch cache.put & Cloning",cache)
              cache.put(event.request.url, response.clone());
              return response;
            });
          });
        })
        .catch(async (error) => {
          console.log("Fetching Error, ", error);
          //If page is offline/ Network failure
          return caches.open(cacheName).then((cache) => {
            console.log("Page not found ", cache)
            return cache.match("offline.html");
          });
        })
    );
  });
