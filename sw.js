self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));

self.addEventListener('push',e=>{
const data=e.data?e.data.json():{};
e.waitUntil(self.registration.showNotification(data.title||'KZ Messenger',{
body:data.body||'Новое сообщение',
icon:data.icon||'/icon-192.png',
badge:'/icon-192.png',
tag:data.tag||'kz-push',
data:{url:data.url||'./index.html'},
requireInteraction:false,
vibrate:[200,100,200]
}));
});

self.addEventListener('notificationclick',e=>{
e.notification.close();
e.waitUntil(clients.matchAll({type:'window'}).then(list=>{
for(const client of list){if('focus'in client)return client.focus();}
if(clients.openWindow)return clients.openWindow('./index.html');
}));
});