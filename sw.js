const CACHE = 'phono-tango-eiken-v1';
const ASSETS = ['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c)=>Promise.allSettled(ASSETS.map((a)=>c.add(a)))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks)=>Promise.all(ks.filter((k)=>k!==CACHE).map((k)=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  const isHTML = req.mode === 'navigate' || (req.headers.get('accept')||'').includes('text/html');
  if (isHTML) {
    e.respondWith(fetch(req).then((res)=>{const c=res.clone();caches.open(CACHE).then((ca)=>ca.put('./',c)).catch(()=>{});return res;}).catch(()=>caches.match(req).then((h)=>h||caches.match('./'))));
  } else {
    e.respondWith(caches.match(req).then((h)=>h||fetch(req).then((res)=>{const c=res.clone();caches.open(CACHE).then((ca)=>ca.put(req,c)).catch(()=>{});return res;})));
  }
});
