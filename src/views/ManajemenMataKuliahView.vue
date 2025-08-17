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
      <DataTable
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
          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn-cancel">Batal</button>
            <button type="submit" class="btn-save">Simpan</button>
          </div>
        </form>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Search, Edit2, Eye, Trash2 } from 'lucide-vue-next'
import TableLayout from '../components/TableLayout.vue'
import DataTable, { type TableColumn } from '../components/DataTable.vue'
import TablePagination from '../components/TablePagination.vue'

interface MataKuliah {
  id: number
  nama: string
  kode: string
  sks: number
  semester: string
  status: string
  jumlahMahasiswa: number
}

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
const mataKuliahList = ref<MataKuliah[]>([
  {
    id: 1,
    nama: 'Pemrograman Web',
    kode: 'TI301',
    sks: 3,
    semester: 'Ganjil 2024/2025',
    status: 'Aktif',
    jumlahMahasiswa: 35
  },
  {
    id: 2,
    nama: 'Basis Data',
    kode: 'TI302',
    sks: 3,
    semester: 'Ganjil 2024/2025',
    status: 'Aktif',
    jumlahMahasiswa: 42
  },
  {
    id: 3,
    nama: 'Mobile Programming',
    kode: 'TI401',
    sks: 4,
    semester: 'Genap 2024/2025',
    status: 'Persiapan',
    jumlahMahasiswa: 0
  }
])

const newMatkul = ref({
  nama: '',
  kode: '',
  sks: 1,
  semester: ''
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

// Computed properties
const filteredMataKuliahList = computed(() => {
  let filtered = mataKuliahList.value

  // Apply search filter
  if (searchQuery.value) {
    filtered = filtered.filter(matkul => 
      matkul.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      matkul.kode.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(matkul => matkul.status === statusFilter.value)
  }

  // Apply semester filter
  if (semesterFilter.value) {
    filtered = filtered.filter(matkul => matkul.semester === semesterFilter.value)
  }

  // Apply sorting
  if (sortColumn.value) {
    filtered.sort((a, b) => {
      const aVal = a[sortColumn.value as keyof MataKuliah]
      const bVal = b[sortColumn.value as keyof MataKuliah]
      
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
}

const handleRowClick = (item: MataKuliah, index: number) => {
  console.log('Row clicked:', item, index)
}

const editMataKuliah = (matkul: MataKuliah) => {
  console.log('Edit mata kuliah:', matkul.nama)
}

const viewDetail = (matkul: MataKuliah) => {
  console.log('View detail:', matkul.nama)
}

const deleteMataKuliah = (matkul: MataKuliah) => {
  if (confirm(`Apakah Anda yakin ingin menghapus mata kuliah ${matkul.nama}?`)) {
    const index = mataKuliahList.value.findIndex(item => item.id === matkul.id)
    if (index !== -1) {
      mataKuliahList.value.splice(index, 1)
    }
  }
}

const addMataKuliah = () => {
  const id = Math.max(...mataKuliahList.value.map(m => m.id)) + 1
  mataKuliahList.value.push({
    id,
    ...newMatkul.value,
    status: 'Persiapan',
    jumlahMahasiswa: 0
  })
  
  newMatkul.value = { nama: '', kode: '', sks: 1, semester: '' }
  showModal.value = false
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
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--oba-border);
  border-radius: 6px;
  font-size: 0.875rem;
  background: var(--oba-white);
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
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