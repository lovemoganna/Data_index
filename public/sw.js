/**
 * Service Worker for MECE Risk Ontology Platform
 * Provides offline functionality and caching
 */

const CACHE_NAME = 'mece-risk-ontology-v2.0.0';
const STATIC_CACHE = 'mece-static-v2.0.0';
const DYNAMIC_CACHE = 'mece-dynamic-v2.0.0';

// 静态资源缓存列表
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  // 字体和图标
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
  // 外部资源（根据实际需要添加）
];

// 动态缓存的 API 路径
const API_CACHE_PATTERNS = [
  /\/api\//,
  /indexeddb/,
  /localStorage/
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 网络请求拦截
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过非 GET 请求和外部域名
  if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }

  // API 请求使用网络优先策略
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // 静态资源使用缓存优先策略
  if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // 其他资源使用陈旧缓存同时重新验证策略
  event.respondWith(staleWhileRevalidateStrategy(request));
});

// 缓存优先策略
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    // 返回离线页面
    return caches.match('/index.html');
  }
}

// 网络优先策略
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('Network first strategy failed:', error);

    // 尝试从缓存返回
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // 返回离线错误页面
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: '网络不可用，请检查网络连接'
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// 陈旧缓存同时重新验证策略
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch((error) => {
    console.error('Stale while revalidate fetch failed:', error);
  });

  // 如果有缓存，先返回缓存内容，然后异步更新
  if (cachedResponse) {
    fetchPromise.then(() => {
      console.log('Background cache update completed for:', request.url);
    });
    return cachedResponse;
  }

  // 没有缓存，等待网络响应
  try {
    return await fetchPromise;
  } catch (error) {
    // 返回离线页面
    return caches.match('/index.html');
  }
}

// 后台同步 - 数据同步
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);

  if (event.tag === 'data-sync') {
    event.waitUntil(syncData());
  }
});

// 数据同步函数
async function syncData() {
  try {
    // 这里可以实现数据同步逻辑
    // 例如：将本地变更同步到服务器，或从服务器拉取最新数据
    console.log('Performing data synchronization');

    // 通知所有客户端同步完成
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETED',
        timestamp: Date.now()
      });
    });
  } catch (error) {
    console.error('Data synchronization failed:', error);
  }
}

// 推送消息处理
self.addEventListener('push', (event) => {
  console.log('Push message received:', event);

  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: data.data || {}
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// 通知点击处理
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  event.waitUntil(
    clients.matchAll().then((clientList) => {
      // 如果应用已经打开，聚焦到现有窗口
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }

      // 否则打开新窗口
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// 定期清理缓存
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    cleanOldCache();
  }
});

// 缓存清理函数
async function cleanOldCache() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const keys = await cache.keys();

    // 删除超过7天的缓存
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7天
    const now = Date.now();

    await Promise.all(
      keys.map(async (request) => {
        const response = await cache.match(request);
        if (response) {
          const date = response.headers.get('date');
          if (date && (now - new Date(date).getTime()) > maxAge) {
            await cache.delete(request);
          }
        }
      })
    );

    console.log('Cache cleanup completed');
  } catch (error) {
    console.error('Cache cleanup failed:', error);
  }
}
