// sw.js - Service Worker для KZ Messenger
// Этот файл должен лежать в корне проекта рядом с index.html

self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    self.skipWaiting(); // Активируем сразу без ожидания старых версий
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    event.waitUntil(clients.claim());
});

// Обработка входящего Push-сообщения от Firebase Cloud Messaging
self.addEventListener('push', (event) => {
    console.log('[SW] Push received:', event.data);
    
    let data = {};
    try {
        data = event.data ? event.data.json() : {};
    } catch (e) {
        console.error('[SW] Error parsing push data:', e);
    }

    const title = data.title || 'KZ Messenger';
    const options = {
        body: data.body || 'Новое сообщение от коллеги',
        icon: '/icon.png', // Иконка приложения (должна быть в корне)
        badge: '/icon.png',
        vibrate: [200, 100, 200], // Вибрация: 200мс вибро, 100мс пауза, 200мс вибро
        tag: data.tag || 'msg-' + Date.now(),
        requireInteraction: false, // Не требует взаимодействия, исчезнет само
        actions: [
            { action: 'open', title: 'Открыть чат' },
            { action: 'dismiss', title: 'Игнорировать' }
        ],
        // Для iOS Safari поддержка кастомных звуков ограничена, 
        // но мы указываем default для совместимости
        sound: data.sound || 'default' 
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.action);
    event.notification.close();

    // Если пользователь нажал "Игнорировать", ничего не делаем
    if (event.action === 'dismiss') {
        return;
    }

    // Логика открытия приложения
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // 1. Проверяем, есть ли уже открытая вкладка нашего сайта
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if ('focus' in client) {
                    // Если вкладка найдена — переключаемся на неё
                    return client.focus();
                }
            }
            
            // 2. Если вкладки нет — открываем новую
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});