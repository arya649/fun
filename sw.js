const CACHE = 'daily-wtf-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
  scheduleNotification();
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE') {
    scheduleNotification();
  }
});

function scheduleNotification() {
  // Clear any existing alarm
  if (self._timer) clearTimeout(self._timer);

  const now = new Date();
  const next = new Date();
  next.setHours(8, 30, 0, 0);

  // If 8:30 already passed today, schedule for tomorrow
  if (now >= next) {
    next.setDate(next.getDate() + 1);
  }

  const delay = next.getTime() - now.getTime();

  self._timer = setTimeout(() => {
    fireNotification();
    // Reschedule for next day
    setTimeout(scheduleNotification, 1000);
  }, delay);
}

function fireNotification() {
  const messages = [
    "something weird is waiting for you today",
    "your daily chaos has arrived",
    "a new message you didn't ask for",
    "the oracle has spoken. probably.",
    "new day. new nonsense. open it.",
    "you've been selected for something unclear",
    "daily.wtf is ready. are you?"
  ];

  const msg = messages[new Date().getDate() % messages.length];

  self.registration.showNotification('daily.wtf', {
    body: msg,
    icon: '/icon.png',
    badge: '/icon.png',
    tag: 'daily-wtf',
    renotify: true,
    data: { url: self.location.origin }
  });
}

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      for (const c of list) {
        if (c.url === '/' && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
