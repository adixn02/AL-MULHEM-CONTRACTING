/**
 * Register Service Worker for production caching.
 * Only registers on HTTPS or localhost (browser requirement).
 */
(function () {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  var isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (!isSecure) return;

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(function (reg) {
        if (typeof reg.update === 'function') {
          setInterval(function () { reg.update(); }, 60 * 60 * 1000);
        }
      })
      .catch(function () {});
  });
})();
