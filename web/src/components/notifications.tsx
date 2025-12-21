import { useEffect, useRef, useState } from 'react'

interface Notification {
  type: string
  title: string
  message: string
  sender?: string
  txid?: string
  explorerUrl?: string
  timestamp: string
}

interface NotificationProps {
  wsUrl?: string
}

export function useNotifications({ wsUrl = 'wss://blocklotto-notifications.onrender.com' }: NotificationProps = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('📡 Connected to notification service')
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      const notification: Notification = JSON.parse(event.data)
      console.log('🔔 Notification:', notification)
      
      setNotifications(prev => [notification, ...prev].slice(0, 10)) // Keep last 10
      
      // Show browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.txid || notification.type
        })
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.onclose = () => {
      console.log('📡 Disconnected from notification service')
      setIsConnected(false)
      
      // Reconnect after 5 seconds
      setTimeout(() => {
        console.log('Attempting to reconnect...')
        wsRef.current = new WebSocket(wsUrl)
      }, 5000)
    }

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    return () => {
      ws.close()
    }
  }, [wsUrl])

  const clearNotifications = () => {
    setNotifications([])
  }

  return {
    notifications,
    isConnected,
    clearNotifications
  }
}

export function NotificationBell() {
  const { notifications, isConnected } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
        title="Notifications"
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {notifications.length}
          </span>
        )}
        <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <span className="text-xs text-gray-400">
                {isConnected ? '🟢 Live' : '🔴 Offline'}
              </span>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No notifications yet
              </div>
            ) : (
              notifications.map((notif, i) => (
                <div
                  key={`${notif.timestamp}-${i}`}
                  className="p-4 border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="font-semibold text-sm mb-1">{notif.title}</div>
                  <div className="text-xs text-gray-300 mb-2">{notif.message}</div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(notif.timestamp).toLocaleTimeString()}</span>
                    {notif.explorerUrl && (
                      <a
                        href={notif.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View TX →
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
