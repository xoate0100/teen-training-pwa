// Service Worker for Teen Training PWA
// Provides offline functionality and background sync

const CACHE_NAME = 'teen-training-pwa-v1'
const OFFLINE_URLS = [
  '/',
  '/exercises',
  '/session',
  '/progress',
  '/profile',
  '/offline',
  '/manifest.json'
]

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching offline resources...')
        return cache.addAll(OFFLINE_URLS)
      })
      .then(() => {
        console.log('Service Worker installed successfully')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker installation failed:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse
        }

        // Try to fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response
            const responseToCache = response.clone()

            // Cache the response for future use
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache)
              })

            return response
          })
          .catch(() => {
            // If network fails and it's a navigation request, show offline page
            if (request.mode === 'navigate') {
              return caches.match('/offline')
            }
            
            // For other requests, return a basic offline response
            return new Response(
              JSON.stringify({ 
                error: 'Offline', 
                message: 'No internet connection available' 
              }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' }
              }
            )
          })
      })
  )
})

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'session-sync') {
    event.waitUntil(syncSessionData())
  } else if (event.tag === 'checkin-sync') {
    event.waitUntil(syncCheckInData())
  } else if (event.tag === 'progress-sync') {
    event.waitUntil(syncProgressData())
  }
})

// Sync session data when back online
async function syncSessionData() {
  try {
    console.log('Syncing session data...')
    
    // Get pending session data from IndexedDB
    const pendingSessions = await getPendingData('sessions')
    
    for (const session of pendingSessions) {
      try {
        const response = await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(session)
        })

        if (response.ok) {
          console.log('Session synced successfully:', session.id)
          await removePendingData('sessions', session.id)
        } else {
          console.error('Failed to sync session:', session.id, response.status)
        }
      } catch (error) {
        console.error('Error syncing session:', session.id, error)
      }
    }
  } catch (error) {
    console.error('Error in session sync:', error)
  }
}

// Sync check-in data when back online
async function syncCheckInData() {
  try {
    console.log('Syncing check-in data...')
    
    const pendingCheckIns = await getPendingData('checkins')
    
    for (const checkIn of pendingCheckIns) {
      try {
        const response = await fetch('/api/check-ins', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(checkIn)
        })

        if (response.ok) {
          console.log('Check-in synced successfully:', checkIn.id)
          await removePendingData('checkins', checkIn.id)
        } else {
          console.error('Failed to sync check-in:', checkIn.id, response.status)
        }
      } catch (error) {
        console.error('Error syncing check-in:', checkIn.id, error)
      }
    }
  } catch (error) {
    console.error('Error in check-in sync:', error)
  }
}

// Sync progress data when back online
async function syncProgressData() {
  try {
    console.log('Syncing progress data...')
    
    const pendingProgress = await getPendingData('progress')
    
    for (const progress of pendingProgress) {
      try {
        const response = await fetch('/api/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(progress)
        })

        if (response.ok) {
          console.log('Progress synced successfully:', progress.id)
          await removePendingData('progress', progress.id)
        } else {
          console.error('Failed to sync progress:', progress.id, response.status)
        }
      } catch (error) {
        console.error('Error syncing progress:', progress.id, error)
      }
    }
  } catch (error) {
    console.error('Error in progress sync:', error)
  }
}

// IndexedDB helper functions
async function getPendingData(type) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TeenTrainingPWA', 1)
    
    request.onerror = () => reject(request.error)
    
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['pendingData'], 'readonly')
      const store = transaction.objectStore('pendingData')
      const index = store.index('type')
      const getRequest = index.getAll(type)
      
      getRequest.onsuccess = () => resolve(getRequest.result)
      getRequest.onerror = () => reject(getRequest.error)
    }
    
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains('pendingData')) {
        const store = db.createObjectStore('pendingData', { keyPath: 'id' })
        store.createIndex('type', 'type', { unique: false })
      }
    }
  })
}

async function removePendingData(type, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TeenTrainingPWA', 1)
    
    request.onerror = () => reject(request.error)
    
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['pendingData'], 'readwrite')
      const store = transaction.objectStore('pendingData')
      const deleteRequest = store.delete(id)
      
      deleteRequest.onsuccess = () => resolve()
      deleteRequest.onerror = () => reject(deleteRequest.error)
    }
  })
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
  
  const options = {
    body: event.data ? event.data.text() : 'You have a new notification',
    icon: '/placeholder-logo.png',
    badge: '/placeholder-logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/placeholder-logo.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/placeholder-logo.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('Teen Training PWA', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  } else if (event.action === 'close') {
    // Just close the notification
    return
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
