<template>
  <div class="dashboard-layout">
    <!-- Fixed Header with Dashboard Title and Filters -->
    <div class="dashboard-header">
      <div class="header-title">
        <h1>{{ userStore.user?.role === 'admin' ? 'Dashboard' : 'Lecturer Dashboard' }}</h1>
      </div>
      
      <div class="header-filters">
        <select v-model="selectedPeriod" class="filter-select">
          <option value="current">Current Semester</option>
          <option value="ganjil2024">Ganjil 2024/2025</option>
          <option value="genap2024">Genap 2024/2025</option>
        </select>
        
        <select v-if="userStore.user?.role === 'admin'" v-model="selectedFaculty" class="filter-select">
          <option value="all">All Faculties</option>
          <option value="ekonomi">Fakultas Ekonomi</option>
          <option value="hukum">Fakultas Hukum</option>
          <option value="teknik">Fakultas Teknik</option>
        </select>
        
        <select v-if="userStore.user?.role === 'dosen'" v-model="selectedCourse" class="filter-select">
          <option value="all">All Courses</option>
          <option value="akt2201">AKT2201</option>
          <option value="mng3201">MNG3201</option>
          <option value="eko1101">EKO1101</option>
        </select>
        
        <button class="refresh-btn" @click="refreshData" title="Refresh Data">
          <RotateCcw :size="18" />
        </button>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="dashboard-content">

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <template v-if="userStore.user?.role === 'admin'">
        <div class="stat-card">
          <div class="stat-icon blue">
            <GraduationCap :size="24" />
          </div>
          <div class="stat-content">
            <h3>{{ adminStats?.totalMataKuliah || 0 }}</h3>
            <p>Total Courses</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">
            <Users :size="24" />
          </div>
          <div class="stat-content">
            <h3>{{ adminStats?.totalDosen || 0 }}</h3>
            <p>Active Lecturers</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">
            <FileText :size="24" />
          </div>
          <div class="stat-content">
            <h3>{{ adminStats?.totalRPS || 0 }}</h3>
            <p>RPS Completed</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">
            <CheckCircle :size="24" />
          </div>
          <div class="stat-content">
            <h3>{{ adminStats?.totalSoal || 0 }}</h3>
            <p>Total Questions</p>
          </div>
        </div>
      </template>
      
      <template v-else>
        <div class="stat-card">
          <div class="stat-icon blue">
            <Book :size="24" />
          </div>
          <div class="stat-content">
            <h3>{{ dosenStats?.totalMataKuliah || 0 }}</h3>
            <p>Assigned Courses</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">
            <Users :size="24" />
          </div>
          <div class="stat-content">
            <h3>{{ dosenStats?.mataKuliahAktif?.reduce((sum, mk) => sum + mk.jumlahMahasiswa, 0) || 0 }}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">
            <ListChecks :size="24" />
          </div>
          <div class="stat-content">
            <h3>{{ dosenStats?.totalSoal || 0 }}</h3>
            <p>Total Questions</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">
            <FileImage :size="24" />
          </div>
          <div class="stat-content">
            <h3>{{ dosenStats?.totalPortofolio || 0 }}</h3>
            <p>Portfolio Items</p>
          </div>
        </div>
      </template>
    </div>

    <!-- Dashboard Grid -->
    <div class="dashboard-grid">
      <!-- Recent Activities (Admin) / My Courses (Lecturer) -->
      <div class="card" v-if="userStore.user?.role === 'admin'">
        <div class="card-header">
          <h3>Recent Activities</h3>
          <button class="btn-secondary">View All</button>
        </div>
        <div class="card-content">
          <div class="activity-list">
            <div v-if="loading" class="text-center py-4">
              Loading activities...
            </div>
            <div v-else-if="error" class="text-center py-4 text-red-600">
              {{ error }}
            </div>
            <div v-else-if="adminStats?.aktivitasTerkini" class="activity-item" v-for="activity in adminStats.aktivitasTerkini" :key="activity.id">
              <div class="activity-icon">
                <Upload :size="20" />
              </div>
              <div class="activity-content">
                <p><strong>{{ activity.user }}</strong> {{ activity.action }} {{ activity.resource }}</p>
                <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
              </div>
            </div>
            <div v-else class="text-center py-4 text-gray-500">
              No recent activities
            </div>
          </div>
        </div>
      </div>

      <!-- My Courses (Lecturer) -->
      <div class="card course-card" v-if="userStore.user?.role === 'dosen'">
        <div class="card-header">
          <h3>My Courses</h3>
          <span class="semester-info">Semester Genap 2024/2025</span>
        </div>
        <div class="card-content">
          <div class="course-list">
            <div v-if="loading" class="text-center py-4">
              Loading courses...
            </div>
            <div v-else-if="error" class="text-center py-4 text-red-600">
              {{ error }}
            </div>
            <div v-else-if="dosenStats?.mataKuliahAktif" class="course-item" v-for="course in dosenStats.mataKuliahAktif" :key="course.id">
              <div class="course-info">
                <div class="course-code">{{ course.kode }}</div>
                <div class="course-details">
                  <h4>{{ course.nama }}</h4>
                  <div class="course-meta">
                    <span><Users :size="16" /> {{ course.jumlahMahasiswa }} students</span>
                    <span><Calendar :size="16" /> {{ course.semester }}</span>
                  </div>
                </div>
              </div>
              <div class="course-actions">
                <div class="progress-circle" :data-progress="dosenStats?.rpsProgress || 0">
                  <svg>
                    <circle cx="20" cy="20" r="18"></circle>
                    <circle cx="20" cy="20" r="18" :style="`stroke-dasharray: 113; stroke-dashoffset: ${113 - ((dosenStats?.rpsProgress || 0) * 113 / 100)};`"></circle>
                  </svg>
                  <span>{{ dosenStats?.rpsProgress || 0 }}%</span>
                </div>
                <button class="btn-secondary">Manage</button>
              </div>
            </div>
            <div v-else class="text-center py-4 text-gray-500">
              No active courses
            </div>
          </div>
        </div>
      </div>

      <!-- Course Progress (Admin) / Pending Tasks (Lecturer) -->
      <div class="card">
        <div class="card-header">
          <h3>{{ userStore.user?.role === 'admin' ? 'Course Assessment Progress' : 'Pending Tasks' }}</h3>
          <span v-if="userStore.user?.role === 'dosen'" class="task-count">8 tasks</span>
        </div>
        <div class="card-content">
          <div v-if="userStore.user?.role === 'admin'" class="progress-list">
            <div v-if="loading" class="text-center py-4">
              Loading progress...
            </div>
            <div v-else-if="error" class="text-center py-4 text-red-600">
              {{ error }}
            </div>
            <div v-else-if="adminStats?.rpsPerStatus" class="progress-item" v-for="(count, status) in adminStats.rpsPerStatus" :key="status">
              <div class="progress-info">
                <span class="course-code">{{ status }}</span>
                <span class="course-name">RPS Status</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar">
                  <div class="progress-fill" :style="`width: ${(count / adminStats.totalRPS) * 100}%`"></div>
                </div>
                <span class="progress-percentage">{{ count }}</span>
              </div>
            </div>
            <div v-else class="text-center py-4 text-gray-500">
              No progress data available
            </div>
          </div>
          
          <div v-else class="task-list">
            <div v-if="loading" class="text-center py-4">
              Loading tasks...
            </div>
            <div v-else-if="error" class="text-center py-4 text-red-600">
              {{ error }}
            </div>
            <div v-else-if="dosenStats?.deadlineTerdekat" class="task-item" v-for="task in dosenStats.deadlineTerdekat" :key="task.id" :class="task.priority.toLowerCase()">
              <div class="task-priority"></div>
              <div class="task-content">
                <h5>{{ task.title }}</h5>
                <p>Due: {{ formatDate(task.dueDate) }}</p>
              </div>
              <div class="task-actions">
                <button class="btn-primary btn-sm">View</button>
              </div>
            </div>
            <div v-else class="text-center py-4 text-gray-500">
              No pending tasks
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <div class="card-header">
          <h3>Quick Actions</h3>
        </div>
        <div class="card-content">
          <div class="quick-actions-grid">
            <template v-if="userStore.user?.role === 'admin'">
              <button class="action-btn">
                <Plus :size="24" />
                <span>Buat RPS</span>
              </button>
              <button class="action-btn">
                <Upload :size="24" />
                <span>Upload Data</span>
              </button>
              <button class="action-btn">
                <FileBarChart :size="24" />
                <span>Generate Report</span>
              </button>
              <button class="action-btn">
                <Printer :size="24" />
                <span>Print Queue</span>
              </button>
            </template>
            
            <template v-else>
              <button class="action-btn">
                <Book :size="24" />
                <span>Kelola Mata Kuliah</span>
              </button>
              <button class="action-btn">
                <HelpCircle :size="24" />
                <span>Buat Soal</span>
              </button>
              <button class="action-btn">
                <Edit :size="24" />
                <span>Input Nilai</span>
              </button>
              <button class="action-btn">
                <FileImage :size="24" />
                <span>Generate Portofolio</span>
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- System Status (Admin) / Assessment Overview (Lecturer) -->
      <div class="card">
        <div class="card-header">
          <h3>{{ userStore.user?.role === 'admin' ? 'System Status' : 'Assessment Overview' }}</h3>
        </div>
        <div class="card-content">
          <div v-if="userStore.user?.role === 'admin'" class="status-list">
            <div class="status-item">
              <div class="status-indicator online"></div>
              <span>Database Connection</span>
              <span class="status-label online">Online</span>
            </div>
            <div class="status-item">
              <div class="status-indicator online"></div>
              <span>File Storage</span>
              <span class="status-label online">Available</span>
            </div>
            <div class="status-item">
              <div class="status-indicator warning"></div>
              <span>Backup Status</span>
              <span class="status-label warning">Pending</span>
            </div>
          </div>
          
          <div v-else class="assessment-overview">
            <div v-if="loading" class="text-center py-4">
              Loading assessment data...
            </div>
            <div v-else-if="error" class="text-center py-4 text-red-600">
              {{ error }}
            </div>
            <div v-else-if="dosenStats" class="assessment-type">
              <div class="assessment-header">
                <span class="assessment-name">RPS Progress</span>
                <span class="assessment-progress">{{ dosenStats.rpsProgress }}% completed</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="`width: ${dosenStats.rpsProgress}%`"></div>
              </div>
            </div>
            <div v-else class="text-center py-4 text-gray-500">
              No assessment data available
            </div>
          </div>
        </div>
      </div>
    </div>
    
    </div> <!-- End dashboard-content -->
  </div> <!-- End dashboard-layout -->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { dashboardApi } from '../services/api'
import type { DashboardStats } from '../types/api'
import { useNotifications } from '../composables/useNotifications'
import { 
  GraduationCap, Users, FileText, CheckCircle, Book, ListChecks, FileImage,
  Upload, Printer, Calendar, Plus, FileBarChart, Edit, HelpCircle, RotateCcw
} from 'lucide-vue-next'

const userStore = useUserStore()
const { showError } = useNotifications()

// Filter states
const selectedPeriod = ref('current')
const selectedFaculty = ref('all')
const selectedCourse = ref('all')

// Dashboard data
const dashboardData = ref<DashboardStats['admin'] | DashboardStats['dosen'] | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Computed properties based on user role
const adminStats = computed(() => {
  if (userStore.user?.role === 'admin' && dashboardData.value) {
    return dashboardData.value as DashboardStats['admin']
  }
  return null
})

const dosenStats = computed(() => {
  if (userStore.user?.role === 'dosen' && dashboardData.value) {
    return dashboardData.value as DashboardStats['dosen']
  }
  return null
})

// Methods
const fetchDashboardData = async () => {
  if (!userStore.user?.role) return
  
  loading.value = true
  error.value = null
  
  try {
    const response = await dashboardApi.getStats(userStore.user.role)
    dashboardData.value = response.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch dashboard data'
    showError(err instanceof Error ? err.message : 'Gagal memuat data dashboard')
    console.error('Dashboard data fetch error:', err)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchDashboardData()
}

// Utility functions
const formatTime = (timestamp: string): string => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} days ago`
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Tomorrow'
  if (diffInDays > 1 && diffInDays <= 7) return `${diffInDays} days`
  
  return date.toLocaleDateString()
}

// Initialize dashboard data
onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
/* Dashboard Layout */
.dashboard-layout {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
  background-color: var(--oba-background);
  overflow: hidden;
}

/* Fixed Header */
.dashboard-header {
  background: var(--oba-background);
  padding: 24px 32px;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-filters {
  display: flex;
  gap: 16px;
  align-items: center;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--oba-border);
  border-radius: 6px;
  font-size: 0.875rem;
  background: var(--oba-white);
  color: var(--oba-text);
  cursor: pointer;
  min-width: 160px;
}

.filter-select:focus {
  outline: none;
  border-color: var(--oba-primary);
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--oba-border);
  background: var(--oba-white);
  color: var(--oba-text-light);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  border-color: var(--oba-primary);
  color: var(--oba-primary);
  background: rgba(30, 64, 175, 0.05);
}

.header-title h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--oba-text);
  margin: 0;
}

/* Scrollable Content */
.dashboard-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: var(--oba-white);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid var(--oba-border);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #ffffff;
}

.stat-icon.blue { background-color: #1e40af; }
.stat-icon.green { background-color: #10b981; }
.stat-icon.orange { background-color: #f59e0b; }
.stat-icon.purple { background-color: #8b5cf6; }

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--oba-text);
  margin: 0;
}

.stat-content p {
  font-size: 0.875rem;
  color: var(--oba-text-light);
  margin: 0;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

/* Cards */
.card {
  background-color: var(--oba-white);
  border-radius: 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid var(--oba-border);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--oba-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--oba-text);
  margin: 0;
}

.card-content {
  padding: 1.5rem;
}

.course-card .card-content {
  padding: 0;
}

/* Semester Info */
.semester-info {
  font-size: 0.875rem;
  color: var(--oba-text-light);
  background-color: var(--oba-background);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
}

/* Course List */
.course-list {
  display: flex;
  flex-direction: column;
}

.course-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--oba-border);
}

.course-item:last-child {
  border-bottom: none;
}

.course-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.course-code {
  background-color: #1e40af;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
}

.course-details h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.course-meta {
  display: flex;
  gap: 1.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.course-meta span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.course-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Progress Circle */
.progress-circle {
  position: relative;
  width: 40px;
  height: 40px;
}

.progress-circle svg {
  width: 40px;
  height: 40px;
  transform: rotate(-90deg);
}

.progress-circle circle {
  fill: none;
  stroke-width: 3;
}

.progress-circle circle:first-child {
  stroke: #e5e7eb;
}

.progress-circle circle:last-child {
  stroke: #10b981;
  transition: stroke-dashoffset 0.5s ease;
}

.progress-circle span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
}

/* Task Count */
.task-count {
  background-color: #f59e0b;
  color: #ffffff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Task List */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #f9fafb;
}

.task-priority {
  width: 4px;
  height: 40px;
  border-radius: 2px;
}

.task-item.urgent .task-priority {
  background-color: #ef4444;
}

.task-item.high .task-priority {
  background-color: #f59e0b;
}

.task-item.medium .task-priority {
  background-color: #3b82f6;
}

.task-content {
  flex: 1;
}

.task-content h5 {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: #374151;
}

.task-content p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.btn-sm {
  padding: 0.25rem 1rem;
  font-size: 0.875rem;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
}

.activity-icon {
  width: 40px;
  height: 40px;
  background-color: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e40af;
  flex-shrink: 0;
}

.activity-icon svg {
  width: 20px;
  height: 20px;
}

.activity-content p {
  margin: 0 0 0.25rem 0;
  color: #374151;
}

.activity-time {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Progress List */
.progress-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-info {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
}

.progress-info .course-code {
  background-color: #1e40af;
  color: #ffffff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.75rem;
}

.course-name {
  color: #4b5563;
  font-size: 0.875rem;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #10b981;
  transition: width 0.3s ease;
}

.progress-percentage {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  min-width: 40px;
}

/* Assessment Overview */
.assessment-overview {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.assessment-type {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.assessment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.assessment-name {
  font-weight: 600;
  color: #374151;
}

.assessment-progress {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Quick Actions Grid */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.action-btn {
  padding: 1.5rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #374151;
}

.action-btn:hover {
  background-color: #dbeafe;
  border-color: #1e40af;
  color: #1e40af;
}

.action-btn svg {
  width: 24px;
  height: 24px;
}

/* Status List */
.status-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-indicator.online {
  background-color: #10b981;
}

.status-indicator.warning {
  background-color: #f59e0b;
}

.status-label {
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
}

.status-label.online {
  background-color: #dcfce7;
  color: #166534;
}

.status-label.warning {
  background-color: #fef3c7;
  color: #92400e;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .dashboard-header {
    padding: 20px;
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .header-title {
    text-align: left;
  }
  
  .header-filters {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  
  .dashboard-content {
    padding: 20px;
  }
}

@media (max-width: 640px) {
  .header-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-select {
    min-width: auto;
  }
  
  .refresh-btn {
    align-self: flex-start;
  }
}

/* Buttons */
.btn-primary {
  background-color: #1e40af;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #3b82f6;
}

.btn-secondary {
  background-color: #ffffff;
  color: #1e40af;
  border: 1px solid #1e40af;
  padding: 0.5rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #dbeafe;
}
</style>