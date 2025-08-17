<template>
  <aside class="app-sidebar">
    <nav class="sidebar-nav">
      <div class="menu-list">
        <div class="nav-item">
          <RouterLink to="/dashboard" class="menu-item">
            <BarChart3 :size="20" />
            <span class="menu-text">Dashboard</span>
          </RouterLink>
        </div>
        
        <!-- Admin Menu -->
        <template v-if="userStore.user?.role === 'admin'">
          <div class="nav-item">
            <RouterLink to="/manajemen-rps" class="menu-item">
              <FileText :size="20" />
              <span class="menu-text">Manajemen RPS</span>
            </RouterLink>
          </div>
        </template>

        <!-- Dosen Menu -->
        <template v-if="userStore.user?.role === 'dosen'">
          <div class="nav-item">
            <RouterLink to="/manajemen-mata-kuliah" class="menu-item">
              <Book :size="20" />
              <span class="menu-text">Manajemen Mata Kuliah</span>
            </RouterLink>
          </div>
          <div class="nav-item">
            <RouterLink to="/manajemen-soal" class="menu-item">
              <HelpCircle :size="20" />
              <span class="menu-text">Manajemen Soal</span>
            </RouterLink>
          </div>
          <div class="nav-item">
            <RouterLink to="/portofolio" class="menu-item">
              <FileImage :size="20" />
              <span class="menu-text">Portofolio</span>
            </RouterLink>
          </div>
        </template>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUserStore } from '../stores/user'
import { BarChart3, FileText, Book, HelpCircle, FileImage } from 'lucide-vue-next'

const userStore = useUserStore()
</script>

<style scoped>
/* Sidebar */
.app-sidebar {
  position: fixed;
  top: 70px;
  left: 0;
  width: 260px;
  height: calc(100vh - 70px);
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 1.5rem;
  overflow-y: auto;
}

.menu-list {
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-bottom: 0.25rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  text-decoration: none;
  color: #4b5563;
  border-radius: 0.75rem;
  transition: all 0.2s;
  font-weight: 500;
}

.menu-item:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.nav-item.active .menu-item,
.menu-item.router-link-active {
  background-color: #dbeafe;
  color: #1e40af;
}

.menu-item svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.menu-text {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>