cat > README.md << 'EOF'
# KZ Messenger

Корпоративный мессенджер — single-file веб-приложение.

## Возможности
- 💬 Личные чаты (DM) и групповые каналы
- 🔐 Ролевая модель: admin / manager / employee (RBAC на каналах)
- ⚡ Realtime между вкладками через BroadcastChannel
- 📎 Вложения файлов (до 10 МБ)
- 😀 Реакции, ответы (reply), редактирование, удаление
- ✓✓ Read-receipts и typing indicators
- 🔍 Глобальный поиск + поиск внутри чата
- 📥 Экспорт переписки в .txt
- 🌗 Тёмная / светлая тема
- 🌍 Локализация RU / EN
- 🔔 Браузерные уведомления
- 📱 Адаптивный дизайн (mobile-friendly)
- ⚙️ PWA-ready (manifest + service worker)

## Запуск

### Вариант 1: Просто открыть файл
Двойной клик по `index.html` — работает сразу, без сервера.

### Вариант 2: Через локальный сервер (рекомендуется для realtime)
```bash
npx serve .
# или
python3 -m http.server 8080