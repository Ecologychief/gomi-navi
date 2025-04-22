const CACHE_NAME = 'garbage-guide-cache-v1'; // キャッシュバージョン
// キャッシュするファイルのリスト
const urlsToCache = [
  '.', // ルート (index.html相当)
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'images/map1.png',
  'images/map2.png',
  'images/map3.png',
  'images/map4.png',
  'images/map5.png',
  'images/map6.png',
  'images/map7.png',
  'images/icon-192x192.png',
  'images/icon-512x512.png'
];

// Service Worker インストール処理
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        // 指定されたファイルをキャッシュに追加
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
          console.error('Failed to cache resources during install:', error);
      })
  );
});

// Service Worker アクティベート処理 (古いキャッシュの削除)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // 有効なキャッシュ名リスト
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // ホワイトリストに含まれない古いキャッシュを削除
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
   // 新しいService Workerをすぐに有効化する
  return self.clients.claim();
});

// Fetch イベント (リクエスト перехват)
self.addEventListener('fetch', event => {
  // GETリクエスト以外は無視
  if (event.request.method !== 'GET') {
      return;
  }

  event.respondWith(
    caches.match(event.request) // キャッシュ内にリクエストと一致するものがあるか確認
      .then(response => {
        // キャッシュがあればそれを返す (オフライン対応)
        if (response) {
          // console.log('Serving from cache:', event.request.url);
          return response;
        }

        // キャッシュがなければネットワークにリクエストを試みる
        // console.log('Fetching from network:', event.request.url);
        return fetch(event.request).then(
            networkResponse => {
                // ネットワークから取得成功した場合、レスポンスを返す
                 // console.log('Successfully fetched from network:', event.request.url);
                 return networkResponse;
            }
        ).catch(error => {
            // ネットワークエラー時 (オフラインでキャッシュもない場合)
            console.error('Fetch failed; returning offline page instead.', error);
            // ここで代替のオフラインページやメッセージを返すことも可能
            // 例: return caches.match('/offline.html');
            // 今回は特に何もしない (ブラウザのデフォルトエラー表示になる)
        });
      })
  );
});