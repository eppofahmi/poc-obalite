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
            <h3>45</h3>
            <p>Total Courses</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">
            <Users :size="24" />
          </div>
          <div class="stat-content">
            <h3>28</h3>
            <p>Active Lecturers</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">
            <FileText :size="24" />
          </div>
          <div class="stat-content">
            <h3>32</h3>
            <p>RPS Completed</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">
            <CheckCircle :size="24" />
          </div>
          <div class="stat-content">
            <h3>18</h3>
            <p>Assessments Done</p>
          </div>
        </div>
      </template>
      
      <template v-else>
        <div class="stat-card">
          <div class="stat-icon blue">
            <Book :size="24" />
          </div>
          <div class="stat-content">
            <h3>3</h3>
            <p>Assigned Courses</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">
            <Users :size="24" />
          </div>
          <div class="stat-content">
            <h3>85</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">
            <ListChecks :size="24" />
          </div>
          <div class="stat-content">
            <h3>12</h3>
            <p>Pending Assessments</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">
            <FileImage :size="24" />
          </div>
          <div class="stat-content">
            <h3>2</h3>
            <p>Portfolios Generated</p>
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
            <div class="activity-item">
              <div class="activity-icon">
                <Upload :size="20" />
              </div>
              <div class="activity-content">
                <p><strong>Dr. Sari</strong> uploaded grade template for AKT2201</p>
                <span class="activity-time">2 hours ago</span>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon">
                <FileText :size="20" />
              </div>
              <div class="activity-content">
                <p><strong>Admin</strong> created RPS for Akuntansi Sektor Publik</p>
                <span class="activity-time">4 hours ago</span>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon">
                <Printer :size="20" />
              </div>
              <div class="activity-content">
                <p>Question set printed for MNG3201</p>
                <span class="activity-time">1 day ago</span>
              </div>
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
            <div class="course-item" v-for="course in lecturerCourses" :key="course.id">
              <div class="course-info">
                <div class="course-code">{{ course.code }}</div>
                <div class="course-details">
                  <h4>{{ course.name }}</h4>
                  <div class="course-meta">
                    <span><Users :size="16" /> {{ course.students }} students</span>
                    <span><Calendar :size="16" /> {{ course.class }}</span>
                  </div>
                </div>
              </div>
              <div class="course-actions">
                <div class="progress-circle" :data-progress="course.progress">
                  <svg>
                    <circle cx="20" cy="20" r="18"></circle>
                    <circle cx="20" cy="20" r="18" :style="`stroke-dasharray: 113; stroke-dashoffset: ${113 - (course.progress * 113 / 100)};`"></circle>
                  </svg>
                  <span>{{ course.progress }}%</span>
                </div>
                <button class="btn-secondary">Manage</button>
              </div>
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
            <div class="progress-item" v-for="course in courseProgress" :key="course.code">
              <div class="progress-info">
                <span class="course-code">{{ course.code }}</span>
                <span class="course-name">{{ course.name }}</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar">
                  <div class="progress-fill" :style="`width: ${course.progress}%`"></div>
                </div>
                <span class="progress-percentage">{{ course.progress }}%</span>
              </div>
            </div>
          </div>
          
          <div v-else class="task-list">
            <div class="task-item" v-for="task in pendingTasks" :key="task.id" :class="task.priority">
              <div class="task-priority"></div>
              <div class="task-content">
                <h5>{{ task.title }}</h5>
                <p>Due: {{ task.due }}</p>
              </div>
              <div class="task-actions">
                <button class="btn-primary btn-sm">{{ task.action }}</button>
              </div>
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
            <div class="assessment-type" v-for="assessment in assessmentOverview" :key="assessment.name">
              <div class="assessment-header">
                <span class="assessment-name">{{ assessment.name }}</span>
                <span class="assessment-progress">{{ assessment.completed }}/{{ assessment.total }} completed</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="`width: ${(assessment.completed / assessment.total) * 100}%`"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    </div> <!-- End dashboard-content -->
  </div> <!-- End dashboard-layout -->
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import { 
  GraduationCap, Users, FileText, CheckCircle, Book, ListChecks, FileImage,
  Upload, Printer, Calendar, Plus, FileBarChart, Edit, HelpCircle, RotateCcw
} from 'lucide-vue-next'

const userStore = useUserStore()

// Filter states
const selectedPeriod = ref('current')
const selectedFaculty = ref('all')
const selectedCourse = ref('all')

// Methods
const refreshData = () => {
  console.log('Refreshing dashboard data...')
  // Implement refresh logic here
}

const lecturerCourses = ref([
  { id: 1, code: 'AKT2201', name: 'Akuntansi Sektor Publik', students: 30, class: 'Kelas A', progress: 85 },
  { id: 2, code: 'MNG3201', name: 'Manajemen Strategis', students: 28, class: 'Kelas B', progress: 60 },
  { id: 3, code: 'EKO1101', name: 'Mikroekonomi', students: 27, class: 'Kelas A', progress: 40 }
])

const courseProgress = ref([
  { code: 'AKT2201', name: 'Akuntansi Sektor Publik', progress: 85 },
  { code: 'MNG3201', name: 'Manajemen Strategis', progress: 60 },
  { code: 'EKO1101', name: 'Mikroekonomi', progress: 40 }
])

const pendingTasks = ref([
  { id: 1, title: 'Upload UTS Questions - AKT2201', due: 'Tomorrow', priority: 'urgent', action: 'Upload' },
  { id: 2, title: 'Grade Quiz Results - MNG3201', due: '3 days', priority: 'high', action: 'Grade' },
  { id: 3, title: 'Complete Self Evaluation', due: '1 week', priority: 'medium', action: 'Complete' },
  { id: 4, title: 'Upload Participation Scores', due: '1 week', priority: 'medium', action: 'Upload' }
])

const assessmentOverview = ref([
  { name: 'Quiz', completed: 8, total: 12 },
  { name: 'UTS', completed: 2, total: 3 },
  { name: 'Projects', completed: 1, total: 3 },
  { name: 'UAS', completed: 0, total: 3 }
])
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