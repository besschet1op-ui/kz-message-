// sw.js - Service Worker для KZ Messenger

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Получение Push-сообщения от сервера Firebase
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    
    const title = data.title || 'KZ Messenger';
    const options = {
        body: data.body || 'Новое сообщение',
        icon: '/icon.png', // Убедись, что у тебя есть иконка в корне
        badge: '/icon.png',
        vibrate: [200, 100, 200],
        tag: data.tag || 'msg-' + Date.now(),
        requireInteraction: false,
        actions: [
            { action: 'open', title: 'Открыть чат' }
        ],
        sound: data.sound || 'default' 
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if ('focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});