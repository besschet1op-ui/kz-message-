self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// Обработка входящего PUSH сообщения от сервера
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'KZ Messenger';
    const options = {
        body: data.body || 'Новое сообщение',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/',
            chatId: data.chatId
        },
        tag: data.tag || 'kz-msg-' + Date.now()
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Клик по уведомлению
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            // Если окно открыто, фокусируем его
            for (const client of clientList) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // Иначе открываем новое
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});