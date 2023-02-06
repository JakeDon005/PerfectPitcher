var cacheStorageKey = 'minimal-pwa-1'

var cacheList = [
    "index.html",
    "./modules/vue.global.js",
    "./modules/ion.rangeSlider.css",
    "./modules/ion.rangeSlider.min.js",
    "./modules/jquery-3.6.3.min.js",
    "./js-css/style.css",
    "./js-css/program.js",
    "./scr/pitcherLogo.ico"
]
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheStorageKey)
            .then(cache => cache.addAll(cacheList))
            .then(() => self.skipWaiting())
    )
})
self.addEventListener('fetch', function(e) {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        if (response != null) {
          return response
        }else{
            return fetch(e.request.url)  .catch(error => {
                console.log('There has been a problem with your fetch operation:', error);})
        }

      })
    )
  })