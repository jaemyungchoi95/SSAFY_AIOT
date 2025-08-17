/* global clients */

const CACHE_NAME = 'areuhot-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/pwa/service-worker.js', // 서비스워커 경로 추가
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    // API 요청은 캐싱 없이 그대로 전달
    if (event.request.url.includes('/api/')) {
        event.respondWith(fetch(event.request));
        return;
    }
    
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // 클릭 시 특정 URL 열기
  event.waitUntil(
    clients.openWindow("/issue") // 예시: 위험 알림이면 이슈 페이지로
  );
});