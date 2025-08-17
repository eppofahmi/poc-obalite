import { ref, readonly } from 'vue'

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

const notifications = ref<Notification[]>([])

export const useNotifications = () => {
  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const notification: Notification = { id, message, type, duration }
    
    notifications.value.push(notification)
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
    
    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const showSuccess = (message: string, duration?: number) => {
    return addNotification(message, 'success', duration)
  }

  const showError = (message: string, duration?: number) => {
    return addNotification(message, 'error', duration)
  }

  const showInfo = (message: string, duration?: number) => {
    return addNotification(message, 'info', duration)
  }

  const clearAll = () => {
    notifications.value = []
  }

  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    clearAll
  }
}