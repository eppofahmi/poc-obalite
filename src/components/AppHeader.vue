<template>
  <header class="header">
    <div class="header-left">
      <div class="logo-container">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/LOGO_UNU_YOGYAKARTA.png/500px-LOGO_UNU_YOGYAKARTA.png" alt="UNU Yogyakarta" class="logo">
        <div class="brand-text">
          <h1>OBA System</h1>
          <p>Outcome-Based Assessment</p>
        </div>
      </div>
    </div>
    <div class="header-right">
      <div class="user-info">
        <span class="user-role">{{ getRoleLabel(userStore.user?.role) }}</span>
        <div class="user-avatar">
          <User :size="20" />
        </div>
        <div class="dropdown">
          <button class="dropdown-btn">
            <span>{{ userStore.user?.name }}</span>
            <ChevronDown :size="16" />
          </button>
          <div class="dropdown-content">
            <a href="#profile"><UserCog :size="16" /> Profile</a>
            <a href="#settings"><Settings :size="16" /> Settings</a>
            <a href="#logout" @click.prevent="handleLogout"><LogOut :size="16" /> Logout</a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { User, ChevronDown, UserCog, Settings, LogOut } from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()

const getRoleLabel = (role?: string) => {
  switch (role) {
    case 'admin':
      return 'Administrator'
    case 'dosen':
      return 'Dosen'
    default:
      return ''
  }
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 1000;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  height: 45px;
  width: auto;
}

.brand-text h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e40af;
  margin: 0;
}

.brand-text p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-role {
  font-size: 0.875rem;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  background-color: #dbeafe;
  border-radius: 0.5rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background-color: #1e40af;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.dropdown {
  position: relative;
}

.dropdown-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.dropdown-btn:hover {
  background-color: #f3f4f6;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 200px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 0.5rem;
  display: none;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #374151;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.dropdown-content a:hover {
  background-color: #f3f4f6;
}
</style>