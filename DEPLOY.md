# Production deployment – Al-Mulhem Contracting

## Caching & optimization (already set up)

- **Service Worker** (`sw.js`): Caches CSS, JS, and images. HTML uses network-first so users see updates. Registers only on **HTTPS** or localhost.
- **Scripts**: Load with `defer` so the page is not blocked.
- **Critical CSS**: Main stylesheet is preloaded on the homepage.

## After deploying

1. **Cache bust when you change CSS/JS**  
   Either:
   - Bump `CACHE_VERSION` in `sw.js` (e.g. `v1` → `v2`) and redeploy, so returning users get the new worker and fresh assets, or  
   - Add a query string to CSS/JS in your HTML, e.g. `css/style.css?v=2`, and update the number when you change files.

2. **Hosting**
   - **Netlify**: Uses `_headers` for cache and security headers. No extra config needed.
   - **Apache**: Uses `.htaccess` for cache and security. Ensure `AllowOverride All` is set for the site directory.
   - **Other hosts**: Configure equivalent cache headers (e.g. 1 year for `/css/*`, `/js/*`, `/Images/*`, `/images/*`; short or no cache for HTML).

3. **HTTPS**  
   The Service Worker only registers over HTTPS (or localhost). Use HTTPS in production.

4. **Testing**
   - Open DevTools → Application → Service Workers to confirm registration.
   - Application → Cache Storage to see caches after browsing.
   - Reload the site and check Network: CSS/JS/images should show “from ServiceWorker” or “from disk cache” on repeat visits.
