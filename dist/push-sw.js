/* Service worker for browser push notifications */

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  let payload = {}

  try {
    payload = event.data ? event.data.json() : {}
  } catch (error) {
    payload = { title: event.data ? event.data.text() : '' }
  }

  const title = payload.title || 'НОО.Платформа'

  event.waitUntil(
    self.registration.showNotification(title, {
      body: payload.body || '',
      icon: '/apple-touch-icon.png',
      badge: '/favicon.ico',
      tag: payload.id || undefined,
      data: { link: payload.link || null }
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const link = (event.notification.data && event.notification.data.link) || '/'
  const url = new URL(link, self.location.origin).href

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        const client = clients.find((c) =>
          c.url.startsWith(self.location.origin)
        )

        if (client) {
          return client.focus().then((c) => c.navigate(url))
        }

        return self.clients.openWindow(url)
      })
  )
})
