/* Service worker — Treino Vocal (Keila Chrischner)
   Guarda o app em cache para funcionar offline depois do primeiro acesso. */
var CACHE = 'treino-vocal-v1';
var ARQUIVOS = [
  './',
  './index.html',
  './engine.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return c.addAll(ARQUIVOS).catch(function(){ /* segue mesmo se algum falhar */ });
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k !== CACHE) return caches.delete(k);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function(hit){
      if(hit) return hit;
      return fetch(e.request).then(function(res){
        /* guarda cópia do que veio da mesma origem */
        try{
          if(res && res.status === 200 && new URL(e.request.url).origin === location.origin){
            var copia = res.clone();
            caches.open(CACHE).then(function(c){ c.put(e.request, copia); });
          }
        }catch(err){}
        return res;
      }).catch(function(){
        return caches.match('./index.html');
      });
    })
  );
});
