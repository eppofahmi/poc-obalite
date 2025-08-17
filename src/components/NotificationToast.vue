<template>
  <Teleport to="body">
    <div v-if="notifications.length > 0" class="notification-container">
      <TransitionGroup name="notification" tag="div">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          :class="['notification', notification.type]"
        >
          <div class="notification-content">
            <component :is="getIcon(notification.type)" :size="20" class="notification-icon" />
            <span class="notification-message">{{ notification.message }}</span>
          </div>
          <button @click="removeNotification(notification.id)" class="notification-close">
            <X :size="16" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-vue-next'

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

const notifications = ref<Notification[]>()

const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 4000) => {
  const id = Date.now().toString()
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

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return CheckCircle
    case 'error': return AlertCircle
    default: return Info
  }
}

// Expose methods for external use
defineExpose({
  addNotification,
  removeNotification
})
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.notification {
  background: var(--oba-white);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--oba-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
}

.notification.success {
  border-left: 4px solid #10b981;
}

.notification.error {
  border-left: 4px solid #ef4444;
}

.notification.info {
  border-left: 4px solid #3b82f6;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.notification-icon {
  flex-shrink: 0;
}

.notification.success .notification-icon {
  color: #10b981;
}

.notification.error .notification-icon {
  color: #ef4444;
}

.notification.info .notification-icon {
  color: #3b82f6;
}

.notification-message {
  font-size: 0.875rem;
  color: var(--oba-text);
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: var(--oba-text-light);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.notification-close:hover {
  background: var(--oba-background);
  color: var(--oba-text);
}

/* Transition animations */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease;
}

/* Responsive design */
@media (max-width: 640px) {
  .notification-container {
    left: 20px;
    right: 20px;
    max-width: none;
  }
  
  .notification {
    min-width: auto;
  }
}
</style>