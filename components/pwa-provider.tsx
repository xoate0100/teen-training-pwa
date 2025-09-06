'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { pwaManager, PWAStatus } from '@/lib/utils/pwa'

interface PWAContextType {
  status: PWAStatus
  install: () => Promise<boolean>
  showNotification: (title: string, options?: NotificationOptions) => Promise<void>
  saveForSync: (type: 'session' | 'checkin' | 'progress', data: any) => Promise<void>
  triggerSync: () => Promise<void>
}

const PWAContext = createContext<PWAContextType | undefined>(undefined)

export function PWAProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<PWAStatus>(pwaManager.getStatus())

  useEffect(() => {
    // Subscribe to PWA status changes
    const unsubscribe = pwaManager.subscribe(setStatus)

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration)
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }

    return unsubscribe
  }, [])

  const install = async () => {
    return await pwaManager.install()
  }

  const showNotification = async (title: string, options?: NotificationOptions) => {
    await pwaManager.showNotification(title, options)
  }

  const saveForSync = async (type: 'session' | 'checkin' | 'progress', data: any) => {
    await pwaManager.saveForSync(type, data)
  }

  const triggerSync = async () => {
    await pwaManager.triggerBackgroundSync()
  }

  const value: PWAContextType = {
    status,
    install,
    showNotification,
    saveForSync,
    triggerSync
  }

  return (
    <PWAContext.Provider value={value}>
      {children}
    </PWAContext.Provider>
  )
}

export function usePWA() {
  const context = useContext(PWAContext)
  if (context === undefined) {
    throw new Error('usePWA must be used within a PWAProvider')
  }
  return context
}
