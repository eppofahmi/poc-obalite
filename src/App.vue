<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/user'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import NotificationToast from './components/NotificationToast.vue'

const userStore = useUserStore()

// Initialize auth state from localStorage
onMounted(() => {
  userStore.initializeAuth()
})
</script>

<template>
  <div class="app">
    <template v-if="userStore.isAuthenticated">
      <AppHeader />
      <AppSidebar />
      <main class="main-content">
        <RouterView />
      </main>
    </template>
    <template v-else>
      <RouterView />
    </template>
    
    <!-- Global Notification System -->
    <NotificationToast />
  </div>
</template>

<style scoped>
.app {
  height: 100vh;
  background-color: #f9fafb;
  overflow: hidden;
}

.main-content {
  margin-left: 260px;
  margin-top: 70px;
  height: calc(100vh - 70px);
  overflow: hidden;
}
</style>
