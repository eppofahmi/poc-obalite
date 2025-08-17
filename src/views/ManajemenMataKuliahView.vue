<template>
  <TableLayout 
    title="Manajemen Mata Kuliah" 
    subtitle="Kelola mata kuliah yang Anda ampu di sini"
  >
    <!-- Header Actions -->
    <template #headerActions>
      <button class="btn-primary" @click="showModal = true">
        <Plus :size="18" />
        Tambah Mata Kuliah
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
          <option value="Persiapan">Persiapan</option>
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
      <div v-if="loading" class="text-center py-8">
        <div class="loading-spinner"></div>
        <p class="text-gray-600 mt-2">Loading mata kuliah...</p>
      </div>
      
      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-600">{{ error }}</p>
        <button @click="fetchMataKuliah" class="btn-primary mt-4">Retry</button>
      </div>
      
      <DataTable
        v-else
        :columns="columns"
        :data="paginatedMataKuliahList"
        :row-key="'id'"
        @sort="handleSort"
        @row-click="handleRowClick"
      >
        <!-- Status Column -->
        <template #cell-status="{ value }">
          <span :class="['status-badge', value.toLowerCase()]">
            {{ value }}
          </span>
        </template>

        <!-- Actions Column -->
        <template #cell-actions="{ item }">
          <div class="action-buttons">
            <button class="btn-action btn-edit" @click="editMataKuliah(item)" title="Edit Mata Kuliah">
              <Edit2 :size="14" />
            </button>
            <button class="btn-action btn-view" @click="viewDetail(item)" title="Lihat Detail">
              <Eye :size="14" />
            </button>
            <button class="btn-action btn-delete" @click="deleteMataKuliah(item)" title="Hapus Mata Kuliah">
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
        :total="filteredMataKuliahList.length"
        @page-change="currentPage = $event"
      />
    </template>
  </TableLayout>

    <!-- Modal untuk menambah mata kuliah -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal" @click.stop>
        <h2>Tambah Mata Kuliah Baru</h2>
        <form @submit.prevent="addMataKuliah">
          <div class="form-group">
            <label>Nama Mata Kuliah</label>
            <input v-model="newMatkul.nama" type="text" required>
          </div>
          <div class="form-group">
            <label>Kode</label>
            <input v-model="newMatkul.kode" type="text" required>
          </div>
          <div class="form-group">
            <label>SKS</label>
            <input v-model="newMatkul.sks" type="number" min="1" max="6" required>
          </div>
          <div class="form-group">
            <label>Semester</label>
            <select v-model="newMatkul.semester" required>
              <option value="">Pilih Semester</option>
              <option value="Ganjil 2024/2025">Ganjil 2024/2025</option>
              <option value="Genap 2024/2025">Genap 2024/2025</option>
            </select>
          </div>
          <div class="form-group">
            <label>Deskripsi (Opsional)</label>
            <textarea v-model="newMatkul.deskripsi" rows="3" placeholder="Deskripsi mata kuliah..."></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn-cancel">Batal</button>
            <button type="submit" class="btn-save">Simpan</button>
          </div>
        </form>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Plus, Search, Edit2, Eye, Trash2 } from 'lucide-vue-next'
import TableLayout from '../components/TableLayout.vue'
import DataTable, { type TableColumn } from '../components/DataTable.vue'
import TablePagination from '../components/TablePagination.vue'
import { mataKuliahApi } from '../services/api'
import type { MataKuliah, CreateMataKuliahRequest, FilterParams } from '../types/api'

// Table columns definition
const columns: TableColumn[] = [
  { key: 'kode', title: 'Kode', sortable: true, width: 'sm' },
  { key: 'nama', title: 'Nama Mata Kuliah', sortable: true },
  { key: 'sks', title: 'SKS', sortable: true, align: 'center', width: 'sm' },
  { key: 'semester', title: 'Semester', sortable: true },
  { key: 'jumlahMahasiswa', title: 'Mahasiswa', sortable: true, align: 'center', width: 'sm' },
  { key: 'status', title: 'Status', sortable: true },
  { key: 'actions', title: 'Aksi', width: 'md' }
]

// Reactive data
const showModal = ref(false)
const mataKuliahList = ref<MataKuliah[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const newMatkul = ref<CreateMataKuliahRequest>({
  nama: '',
  kode: '',
  sks: 1,
  semester: '',
  deskripsi: ''
})

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

// API methods
const fetchMataKuliah = async () => {
  loading.value = true
  error.value = null
  
  try {
    const filters: FilterParams = {
      search: searchQuery.value || undefined,
      status: statusFilter.value || undefined,
      semester: semesterFilter.value || undefined,
      page: currentPage.value,
      limit: itemsPerPage.value,
      sortBy: sortColumn.value || undefined,
      sortOrder: sortDirection.value
    }
    
    const response = await mataKuliahApi.getAll(filters)
    mataKuliahList.value = response.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch mata kuliah'
    console.error('Fetch mata kuliah error:', err)
  } finally {
    loading.value = false
  }
}

// Computed properties  
const filteredMataKuliahList = computed(() => {
  // Since we're using API filtering, return the data as-is
  return mataKuliahList.value
})

const paginatedMataKuliahList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredMataKuliahList.value.slice(start, end)
})

// Methods
const handleSort = (column: string) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
  
  // Refetch data with new sorting
  fetchMataKuliah()
}

const handleRowClick = (item: MataKuliah, index: number) => {
  console.log('Row clicked:', item, index)
}

// Watch for filter changes and refetch data
const debounceTimer = ref<NodeJS.Timeout | null>(null)

const debouncedFetch = () => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  
  debounceTimer.value = setTimeout(() => {
    currentPage.value = 1 // Reset to first page when filtering
    fetchMataKuliah()
  }, 300)
}

// Watch for filter changes
watch(searchQuery, () => debouncedFetch())
watch(statusFilter, () => fetchMataKuliah())
watch(semesterFilter, () => fetchMataKuliah())
watch(currentPage, () => fetchMataKuliah())

const editMataKuliah = (matkul: MataKuliah) => {
  console.log('Edit mata kuliah:', matkul.nama)
}

const viewDetail = (matkul: MataKuliah) => {
  console.log('View detail:', matkul.nama)
}

const deleteMataKuliah = async (matkul: MataKuliah) => {
  if (confirm(`Apakah Anda yakin ingin menghapus mata kuliah ${matkul.nama}?`)) {
    try {
      await mataKuliahApi.delete(matkul.id)
      // Remove from local list or refetch data
      const index = mataKuliahList.value.findIndex(item => item.id === matkul.id)
      if (index !== -1) {
        mataKuliahList.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete mata kuliah'
      console.error('Delete mata kuliah error:', err)
    }
  }
}

const addMataKuliah = async () => {
  try {
    const response = await mataKuliahApi.create(newMatkul.value)
    mataKuliahList.value.push(response.data)
    
    // Reset form
    newMatkul.value = { nama: '', kode: '', sks: 1, semester: '', deskripsi: '' }
    showModal.value = false
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to create mata kuliah'
    console.error('Create mata kuliah error:', err)
  }
}

// Initialize data
onMounted(() => {
  fetchMataKuliah()
})
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

.status-badge.persiapan {
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--oba-white);
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--oba-border);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.25);
}

.modal h2 {
  margin-bottom: 20px;
  color: var(--oba-text);
  font-size: 1.25rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: var(--oba-text);
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--oba-border);
  border-radius: 6px;
  font-size: 0.875rem;
  background: var(--oba-white);
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--oba-primary);
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-cancel {
  background-color: #6b7280;
  color: var(--oba-white);
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background-color: #4b5563;
}

.btn-save {
  background-color: #059669;
  color: var(--oba-white);
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-save:hover {
  background-color: #047857;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
}

/* Loading Spinner */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--oba-border);
  border-top: 4px solid var(--oba-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

@media (max-width: 640px) {
  .modal {
    margin: 20px;
    padding: 20px;
  }
  
  .modal-actions {
    flex-direction: column-reverse;
  }
  
  .btn-cancel,
  .btn-save {
    width: 100%;
    justify-content: center;
  }
}
</style>