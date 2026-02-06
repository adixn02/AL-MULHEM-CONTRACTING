/**
 * Al-Mulhem Contracting - Service Worker
 * Production caching: static assets from cache, HTML network-first for fresh content.
 * Bump CACHE_VERSION when deploying to invalidate old caches.
 */
const CACHE_VERSION = 'v1';
const CACHE_STATIC = 'almulhem-static-' + CACHE_VERSION;
const CACHE_PAGES = 'almulhem-pages-' + CACHE_VERSION;
const CACHE_EXTERNAL = 'almulhem-external-' + CACHE_VERSION;

const STATIC_ASSETS = [
  '/css/style.css',
  '/js/translations.js',
  '/js/lang.js',
  '/js/script.js',
  '/js/sw-register.js'
];

// Install: precache critical static assets
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(function (cache) {
      return cache.addAll(
        STATIC_ASSETS.map(function (url) {
          return new Request(url, { cache: 'reload' });
        }).filter(Boolean)
      ).catch(function () {
        // If any fail (e.g. 404), don't fail install
        return Promise.resolve();
      });
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

// Activate: take control and remove old caches
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return key.startsWith('almulhem-') && key !== CACHE_STATIC && key !== CACHE_PAGES && key !== CACHE_EXTERNAL;
        }).map(function (key) {
          return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

function isSameOrigin(url) {
  try {
    const u = new URL(url);
    return self.location.origin === u.origin;
  } catch (_) {
    return false;
  }
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || (request.method === 'GET' && request.destination === 'document');
}

function isStaticAsset(request) {
  const url = request.url;
  return /\.(css|js|woff2?|ttf|eot)(\?.*)?$/i.test(url) ||
    /\/css\//.test(url) || /\/js\//.test(url);
}

function isImageRequest(request) {
  return request.destination === 'image' || /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i.test(request.url);
}

// Fetch: serve from cache where appropriate
self.addEventListener('fetch', function (event) {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = request.url;
  const sameOrigin = isSameOrigin(url);

  // HTML / navigation: network first, then cache (for offline)
  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request).then(function (response) {
        const clone = response.clone();
        if (response.status === 200 && response.type === 'basic') {
          caches.open(CACHE_PAGES).then(function (cache) {
            cache.put(request, clone);
          });
        }
        return response;
      }).catch(function () {
        return caches.match(request).then(function (cached) {
          return cached || caches.match('/index.html').then(function (index) {
            return index || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
          });
        });
      })
    );
    return;
  }

  // Same-origin static assets (CSS, JS): cache-first
  if (sameOrigin && (isStaticAsset(request) || isImageRequest(request))) {
    event.respondWith(
      caches.match(request).then(function (cached) {
        if (cached) return cached;
        return fetch(request).then(function (response) {
          if (response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_STATIC).then(function (cache) {
              cache.put(request, clone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // External CDN (Bootstrap, fonts, etc.): cache-first for performance
  if (!sameOrigin && (isStaticAsset(request) || isImageRequest(request))) {
    event.respondWith(
      caches.open(CACHE_EXTERNAL).then(function (cache) {
        return cache.match(request).then(function (cached) {
          if (cached) return cached;
          return fetch(request).then(function (response) {
            if (response.status === 200 && response.type === 'basic') {
              const clone = response.clone();
              cache.put(request, clone);
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Everything else: default (no intercept)
});
