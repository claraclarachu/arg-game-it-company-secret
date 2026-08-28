const CACHE = 'cc-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/css/themes.css',
  '/assets/css/vscode.css',
  '/assets/css/jira.css',
  '/assets/css/whatsapp.css',
  '/assets/css/search.css',
  '/assets/css/responsive.css',
  '/assets/js/main.js'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(r => r || fetch(event.request).catch(()=>caches.match('/index.html'))));
});
