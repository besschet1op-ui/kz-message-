// sw.js

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    
    const title = data.title || 'KZ Messenger';
    const options = {
        body: data.body || 'Новое сообщение',
        icon: '/icon.png', // Убедись, что файл icon.png есть в корне
        badge: '/icon.png',
        vibrate: [200, 100, 200],
        tag: 'msg-' + Date.now(),
        actions: [{ action: 'open', title: 'Открыть чат' }]
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            for (let client of clientList) {
                if ('focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow('/');
        })
    );
});