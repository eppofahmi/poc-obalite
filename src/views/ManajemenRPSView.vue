<template>
  <TableLayout 
    title="Manajemen RPS" 
    subtitle="Kelola Rencana Pembelajaran Semester (RPS) Anda di sini"
  >
    <!-- Header Actions -->
    <template #headerActions>
      <button class="btn-primary" @click="navigateToAddRPS">
        <Plus :size="18" />
        Tambah RPS Baru
      </button>
    </template>

    <!-- Filters -->
    <template #filters>
      <div class="filter-group">
        <div class="search-box">
          <Search :size="18" class="search-icon" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari mata kuliah..."
            class="search-input"
          />
        </div>
        <select v-model="statusFilter" class="filter-select">
          <option value="">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Draft">Draft</option>
        </select>
        <select v-model="semesterFilter" class="filter-select">
          <option value="">Semua Semester</option>
          <option value="Ganjil 2024/2025">Ganjil 2024/2025</option>
          <option value="Genap 2024/2025">Genap 2024/2025</option>
        </select>
      </div>
    </template>

    <!-- Table -->
    <template #table>
      <DataTable
        :columns="columns"
        :data="paginatedRpsList"
        :row-key="'id'"
        @sort="handleSort"
        @row-click="handleRowClick"
      >
        <!-- Status Column -->
        <template #cell-status="{ value }">
          <span :class="['status-badge', (value as string).toLowerCase()]">
            {{ value }}
          </span>
        </template>

        <!-- Actions Column -->
        <template #cell-actions="{ item }">
          <div class="action-buttons">
            <button class="btn-action btn-edit" @click="editRPS(item)" title="Edit RPS">
              <Edit2 :size="14" />
            </button>
            <button class="btn-action btn-view" @click="viewRPS(item)" title="Lihat Detail">
              <Eye :size="14" />
            </button>
            <button class="btn-action btn-delete" @click="deleteRPS(item)" title="Hapus RPS">
              <Trash2 :size="14" />
            </button>
          </div>
        </template>
      </DataTable>
    </template>

    <!-- Pagination -->
    <template #pagination>
      <TablePagination
        :current-page="currentPage"
        :page-size="itemsPerPage"
        :total="filteredRpsList.length"
        @page-change="currentPage = $event"
      />
    </template>
  </TableLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search, Edit2, Eye, Trash2 } from 'lucide-vue-next'
import TableLayout from '../components/TableLayout.vue'
import DataTable, { type TableColumn } from '../components/DataTable.vue'
import TablePagination from '../components/TablePagination.vue'

const router = useRouter()

interface RPS {
  id: number
  mataKuliah: string
  semester: string
  sks: number
  status: string
}

// Table columns definition
const columns: TableColumn[] = [
  { key: 'mataKuliah', title: 'Mata Kuliah', sortable: true },
  { key: 'semester', title: 'Semester', sortable: true },
  { key: 'sks', title: 'SKS', sortable: true, align: 'center', width: 'sm' },
  { key: 'status', title: 'Status', sortable: true },
  { key: 'actions', title: 'Aksi', width: 'md' }
]

// Reactive data
const rpsList = ref<RPS[]>([
  { id: 1, mataKuliah: 'Pemrograman Web', semester: 'Ganjil 2024/2025', sks: 3, status: 'Aktif' },
  { id: 2, mataKuliah: 'Basis Data', semester: 'Ganjil 2024/2025', sks: 3, status: 'Draft' },
  { id: 3, mataKuliah: 'Algoritma dan Struktur Data', semester: 'Genap 2024/2025', sks: 4, status: 'Aktif' },
  { id: 4, mataKuliah: 'Sistem Operasi', semester: 'Ganjil 2024/2025', sks: 3, status: 'Draft' },
  { id: 5, mataKuliah: 'Jaringan Komputer', semester: 'Genap 2024/2025', sks: 3, status: 'Aktif' },
  { id: 6, mataKuliah: 'Rekayasa Perangkat Lunak', semester: 'Ganjil 2024/2025', sks: 4, status: 'Aktif' },
  { id: 7, mataKuliah: 'Kecerdasan Buatan', semester: 'Genap 2024/2025', sks: 3, status: 'Draft' },
  { id: 8, mataKuliah: 'Grafika Komputer', semester: 'Ganjil 2024/2025', sks: 3, status: 'Aktif' },
])

// Filter and search states
const searchQuery = ref('')
const statusFilter = ref('')
const semesterFilter = ref('')

// Pagination states
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Sorting states
const sortColumn = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Computed properties
const filteredRpsList = computed(() => {
  let filtered = rpsList.value

  // Apply search filter
  if (searchQuery.value) {
    filtered = filtered.filter(rps => 
      rps.mataKuliah.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(rps => rps.status === statusFilter.value)
  }

  // Apply semester filter
  if (semesterFilter.value) {
    filtered = filtered.filter(rps => rps.semester === semesterFilter.value)
  }

  // Apply sorting
  if (sortColumn.value) {
    filtered.sort((a, b) => {
      const aVal = a[sortColumn.value as keyof RPS]
      const bVal = b[sortColumn.value as keyof RPS]
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection.value === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
      }
      
      return 0
    })
  }

  return filtered
})

const paginatedRpsList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRpsList.value.slice(start, end)
})

// Methods
const handleSort = (column: string) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const handleRowClick = (item: RPS, index: number) => {
  console.log('Row clicked:', item, index)
}

const editRPS = (rps: RPS) => {
  console.log('Edit RPS:', rps.mataKuliah)
}

const viewRPS = (rps: RPS) => {
  console.log('View RPS:', rps.mataKuliah)
}

const deleteRPS = (rps: RPS) => {
  if (confirm(`Apakah Anda yakin ingin menghapus RPS ${rps.mataKuliah}?`)) {
    const index = rpsList.value.findIndex(item => item.id === rps.id)
    if (index !== -1) {
      rpsList.value.splice(index, 1)
    }
  }
}

const navigateToAddRPS = () => {
  router.push('/manajemen-rps/tambah')
}
</script>

<style scoped>
/* Filter Group */
.filter-group {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 320px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--oba-text-light);
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid var(--oba-border);
  border-radius: 6px;
  font-size: 0.875rem;
  background: var(--oba-white);
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--oba-primary);
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.filter-select {
  padding: 10px 12px;
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

/* Primary Button */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--oba-primary) 0%, var(--oba-primary-light) 100%);
  color: var(--oba-white);
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(30, 64, 175, 0.2);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-badge.aktif {
  background-color: #dcfce7;
  color: #166534;
}

.status-badge.draft {
  background-color: #fef3c7;
  color: #92400e;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 6px;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-action:hover {
  transform: translateY(-1px);
}

.btn-edit {
  background-color: #3b82f6;
  color: var(--oba-white);
}

.btn-edit:hover {
  background-color: #2563eb;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-view {
  background-color: #6b7280;
  color: var(--oba-white);
}

.btn-view:hover {
  background-color: #4b5563;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
}

.btn-delete {
  background-color: #dc2626;
  color: var(--oba-white);
}

.btn-delete:hover {
  background-color: #b91c1c;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: none;
  }
}
</style>