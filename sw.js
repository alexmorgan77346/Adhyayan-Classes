/* ==========================================
   ADHYAYAN CLASSES — sw.js  (Service Worker)
   v9 — Fast offline, stale-while-revalidate
   ========================================== */

const CACHE_NAME = 'adhyayan-v12';

const PRECACHE = [
  './',
  './index.html',
  './login.html',
  './signup.html',
  './style.css',
  './script.js',
  './firebase.js',
  './manifest.json',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.allSettled(
        PRECACHE.map(url =>
          cache.add(url).catch(e => console.warn('Precache miss:', url, e))
        )
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;

  // Firebase Auth/Firestore API — never intercept
  if (
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('securetoken.googleapis.com') ||
    url.hostname.includes('firestore.googleapis.com') ||
    (url.hostname.includes('googleapis.com') && url.pathname.includes('firestore'))
  ) return;

  // PDF files — network-first, cache fallback
  if (url.pathname.endsWith('.pdf')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          if (res.ok) caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
          return res;
        })
        .catch(() => caches.match(event.request).then(cached => cached ||
          new Response(
            '<html><body style="font-family:sans-serif;text-align:center;padding:3rem"><h2>📄 PDF Offline नहीं है</h2><p>यह PDF cached नहीं है। Online होने पर खोलें।</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          )
        ))
    );
    return;
  }

  // App shell (HTML/CSS/JS/JSON) — stale-while-revalidate
  if (
    url.pathname.endsWith('.html') || url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js')   || url.pathname.endsWith('.json') ||
    url.pathname === '/' || url.pathname.endsWith('/')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          const fetchPromise = fetch(event.request).then(res => {
            if (res && res.status === 200 && res.type !== 'opaque') cache.put(event.request, res.clone());
            return res;
          }).catch(() => null);
          return cached || fetchPromise || caches.match('./index.html');
        })
      )
    );
    return;
  }

  // CDN/Firebase SDK/Fonts — cache-first
  if (
    url.hostname.includes('gstatic.com') || url.hostname.includes('cdnjs.cloudflare.com') ||
    url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(res => {
          if (res && res.status === 200) caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
          return res;
        });
      })
    );
    return;
  }

  // Default — network with cache fallback
  event.respondWith(
    fetch(event.request)
      .then(res => {
        if (res && res.status === 200 && res.type !== 'opaque')
          caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
        return res;
      })
      .catch(() => caches.match(event.request).then(c => c || caches.match('./index.html')))
  );
});
