const CACHE_NAME = 'garbage-guide-cache-v1';
// キャッシュするファイルのリスト
const urlsToCache = [
    '/', // ルートパス (index.html)
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/images/map1.png',
    '/images/map2.png',
    '/images/map3.png',
    '/images/map4.png',
    '/images/map5.png',
    '/images/map6.png',
    '/images/map7.png'
    // 他に必要なアイコンや画像があれば追加
];

// インストールイベント: キャッシュに必要なファイルを追加する
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// フェッチイベント: リクエストをインターセプトし、キャッシュを優先的に返す
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // キャッシュがあればそれを返す
                if (response) {
                    return response;
                }
                // キャッシュがなければネットワークから取得
                return fetch(event.request);
            })
    );
});

// Activateイベント: 古いキャッシュを削除する (オプション)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});