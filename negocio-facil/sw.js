const CACHE_NAME = 'agenda-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/Imagem do WhatsApp de 2024-11-14 à(s) 21.42.02_a263ffdf.jpg',
    '/Imagem do WhatsApp de 2024-11-14 à(s) 21.42.02_a263ffdf.jpg',
    '/Preview.png',
    '/style.css', // Adicione aqui o nome do seu arquivo CSS, se estiver separado
    // Adicione outros arquivos que você deseja armazenar em cache
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Cache removido:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Retorna a resposta do cache se existir, caso contrário, faz a requisição de rede
                return response || fetch(event.request);
            })
    );
});

// Evento de push
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Notificação';
    const options = {
        body: data.body || 'Você tem uma nova notificação.',
        icon: data.icon || '/default-icon.png', // Substitua pelo caminho do ícone padrão
        data: data.url || '/' // URL para abrir ao clicar na notificação
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Evento de clique na notificação
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const urlToOpen = event.notification.data || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
            const client = clientsArr.find((client) => client.url === urlToOpen && 'focus' in client);
            if (client) {
                return client.focus();
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});