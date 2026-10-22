// sw.js - Service Worker для KZ Messenger

self.addEventListener('install', (event) => {
    self.skipWaiting(); // Активируем сразу
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Получение Push-сообщения от сервера Firebase
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    
    const title = data.title || 'KZ Messenger';
    const options = {
        body: data.body || 'Новое сообщение от коллеги',
        icon: '/icon.png', // Ссылка на иконку (см. Шаг 3)
        badge: '/icon.png',
        vibrate: [200, 100, 200], // Вибрация pattern
        tag: 'msg-' + Date.now(),
        requireInteraction: false,
        actions: [
            { action: 'open', title: 'Открыть чат' }
        ]
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
                    return client.focus(); // Если вкладка открыта — переключаемся на неё
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/'); // Если нет — открываем новую
            }
        })
    );
});