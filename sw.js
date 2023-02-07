var cacheStorageKey = 'minimal-pwa-1'

var cacheList = [
  "index.html",
  "manifest.json",
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
self.addEventListener('fetch', function (e) {
  e.respondWith(
    fetch(e.request.url).catch(error => {
      console.log('从网络请求失败', error);
      return caches.match(e.request).catch(error =>{
        console.error('错得离谱',error)
      })
    })
  )
})
