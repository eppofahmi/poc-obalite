<template>
  <TableLayout 
    title="Manajemen Soal" 
    subtitle="Kelola bank soal untuk ujian dan kuis"
  >
    <!-- Header Actions -->
    <template #headerActions>
      <button class="btn-primary" @click="showAddModal = true">
        <Plus :size="18" />
        Tambah Soal
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
            placeholder="Cari soal..."
            class="search-input"
          />
        </div>
        <select v-model="selectedMataKuliah" class="filter-select">
          <option value="">Semua Mata Kuliah</option>
          <option value="TI301">Pemrograman Web</option>
          <option value="TI302">Basis Data</option>
          <option value="TI401">Mobile Programming</option>
        </select>
        <select v-model="selectedJenis" class="filter-select">
          <option value="">Semua Jenis</option>
          <option value="Pilihan Ganda">Pilihan Ganda</option>
          <option value="Essay">Essay</option>
          <option value="Praktik">Praktik</option>
        </select>
        <select v-model="selectedKesulitan" class="filter-select">
          <option value="">Semua Tingkat</option>
          <option value="Mudah">Mudah</option>
          <option value="Sedang">Sedang</option>
          <option value="Sulit">Sulit</option>
        </select>
      </div>
    </template>

    <!-- Table -->
    <template #table>
      <DataTable
        :columns="columns"
        :data="paginatedSoalList"
        :row-key="'id'"
        @sort="handleSort"
        @row-click="handleRowClick"
      >
        <!-- Question Column -->
        <template #cell-pertanyaan="{ value }">
          <div class="question-cell" :title="value as string">
            {{ value }}
          </div>
        </template>

        <!-- Type Column -->
        <template #cell-jenis="{ value }">
          <span :class="['type-badge', (value as string).toLowerCase().replace(' ', '-')]">
            {{ value }}
          </span>
        </template>

        <!-- Difficulty Column -->
        <template #cell-tingkatKesulitan="{ value }">
          <span :class="['difficulty-badge', (value as string).toLowerCase()]">
            {{ value }}
          </span>
        </template>

        <!-- Date Column -->
        <template #cell-tanggalDibuat="{ value }">
          {{ formatDate(value as string) }}
        </template>

        <!-- Actions Column -->
        <template #cell-actions="{ item }">
          <div class="action-buttons">
            <button class="btn-action btn-edit" @click="editSoal(item)" title="Edit Soal">
              <Edit2 :size="14" />
            </button>
            <button class="btn-action btn-view" @click="viewSoal(item)" title="Lihat Detail">
              <Eye :size="14" />
            </button>
            <button class="btn-action btn-delete" @click="deleteSoal(item.id)" title="Hapus Soal">
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
        :total="filteredSoalList.length"
        @page-change="currentPage = $event"
      />
    </template>
  </TableLayout>

    <!-- Modal Add/Edit Soal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h2>{{ showEditModal ? 'Edit Soal' : 'Tambah Soal Baru' }}</h2>
        <form @submit.prevent="saveSoal">
          <div class="form-group">
            <label>Mata Kuliah</label>
            <select v-model="currentSoal.mataKuliah" required>
              <option value="">Pilih Mata Kuliah</option>
              <option value="TI301">Pemrograman Web</option>
              <option value="TI302">Basis Data</option>
              <option value="TI401">Mobile Programming</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Jenis Soal</label>
            <select v-model="currentSoal.jenis" required>
              <option value="">Pilih Jenis</option>
              <option value="Pilihan Ganda">Pilihan Ganda</option>
              <option value="Essay">Essay</option>
              <option value="Praktik">Praktik</option>
            </select>
          </div>

          <div class="form-group">
            <label>Tingkat Kesulitan</label>
            <select v-model="currentSoal.tingkatKesulitan" required>
              <option value="">Pilih Tingkat</option>
              <option value="Mudah">Mudah</option>
              <option value="Sedang">Sedang</option>
              <option value="Sulit">Sulit</option>
            </select>
          </div>

          <div class="form-group">
            <label>Pertanyaan</label>
            <textarea v-model="currentSoal.pertanyaan" rows="4" required placeholder="Tulis pertanyaan di sini..."></textarea>
          </div>

          <div v-if="currentSoal.jenis === 'Pilihan Ganda'" class="form-group">
            <label>Pilihan Jawaban</label>
            <div v-for="(pilihan, index) in currentSoal.pilihan" :key="index" class="pilihan-item">
              <input v-model="currentSoal.pilihan![index]" :placeholder="`Pilihan ${String.fromCharCode(65 + index)}`" required>
            </div>
            <div class="form-group">
              <label>Jawaban Benar</label>
              <select v-model="currentSoal.jawabanBenar" required>
                <option value="">Pilih Jawaban</option>
                <option v-for="(pilihan, index) in currentSoal.pilihan" :key="index" :value="index">
                  {{ String.fromCharCode(65 + index) }}. {{ pilihan }}
                </option>
              </select>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-cancel">Batal</button>
            <button type="submit" class="btn-save">{{ showEditModal ? 'Update' : 'Simpan' }}</button>
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

interface Soal {
  id: number
  mataKuliah: string
  pertanyaan: string
  jenis: string
  tingkatKesulitan: string
  tanggalDibuat: string
  pilihan?: string[]
  jawabanBenar?: number
}

// Table columns definition
const columns: TableColumn[] = [
  { key: 'mataKuliah', title: 'Mata Kuliah', sortable: true, width: 'md' },
  { key: 'pertanyaan', title: 'Pertanyaan', sortable: true },
  { key: 'jenis', title: 'Jenis', sortable: true, align: 'center', width: 'sm' },
  { key: 'tingkatKesulitan', title: 'Kesulitan', sortable: true, align: 'center', width: 'sm' },
  { key: 'tanggalDibuat', title: 'Dibuat', sortable: true, width: 'sm' },
  { key: 'actions', title: 'Aksi', width: 'md' }
]

// Reactive data
const selectedMataKuliah = ref('')
const selectedJenis = ref('')
const selectedKesulitan = ref('')
const searchQuery = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)

// Pagination states
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Sorting states
const sortColumn = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')

const soalList = ref<Soal[]>([
  {
    id: 1,
    mataKuliah: 'TI301',
    pertanyaan: 'Apa kepanjangan dari HTML?',
    jenis: 'Pilihan Ganda',
    tingkatKesulitan: 'Mudah',
    tanggalDibuat: '2024-01-15',
    pilihan: ['HyperText Markup Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language', 'HyperText Machine Language'],
    jawabanBenar: 0
  },
  {
    id: 2,
    mataKuliah: 'TI302',
    pertanyaan: 'Jelaskan perbedaan antara PRIMARY KEY dan FOREIGN KEY dalam database!',
    jenis: 'Essay',
    tingkatKesulitan: 'Sedang',
    tanggalDibuat: '2024-01-14'
  },
  {
    id: 3,
    mataKuliah: 'TI401',
    pertanyaan: 'Buat aplikasi mobile sederhana dengan Flutter yang menampilkan daftar item',
    jenis: 'Praktik',
    tingkatKesulitan: 'Sulit',
    tanggalDibuat: '2024-01-13'
  }
])

const currentSoal = ref<Partial<Soal>>({
  mataKuliah: '',
  pertanyaan: '',
  jenis: '',
  tingkatKesulitan: '',
  pilihan: ['', '', '', ''],
  jawabanBenar: undefined
})

// Computed properties
const filteredSoalList = computed(() => {
  let filtered = soalList.value

  // Apply search filter
  if (searchQuery.value) {
    filtered = filtered.filter(soal => 
      soal.pertanyaan.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      soal.mataKuliah.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Apply mata kuliah filter
  if (selectedMataKuliah.value) {
    filtered = filtered.filter(soal => soal.mataKuliah === selectedMataKuliah.value)
  }

  // Apply jenis filter
  if (selectedJenis.value) {
    filtered = filtered.filter(soal => soal.jenis === selectedJenis.value)
  }

  // Apply kesulitan filter
  if (selectedKesulitan.value) {
    filtered = filtered.filter(soal => soal.tingkatKesulitan === selectedKesulitan.value)
  }

  // Apply sorting
  if (sortColumn.value) {
    filtered.sort((a, b) => {
      const aVal = a[sortColumn.value as keyof Soal]
      const bVal = b[sortColumn.value as keyof Soal]
      
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

const paginatedSoalList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredSoalList.value.slice(start, end)
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

const handleRowClick = (item: Soal, index: number) => {
  console.log('Row clicked:', item, index)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID')
}

const editSoal = (soal: Soal) => {
  currentSoal.value = { ...soal }
  if (!currentSoal.value.pilihan) {
    currentSoal.value.pilihan = ['', '', '', '']
  }
  showEditModal.value = true
}

const viewSoal = (soal: Soal) => {
  console.log('View soal:', soal.pertanyaan)
}

const deleteSoal = (id: number) => {
  if (confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
    soalList.value = soalList.value.filter(soal => soal.id !== id)
  }
}

const saveSoal = () => {
  if (showEditModal.value) {
    const index = soalList.value.findIndex(s => s.id === currentSoal.value.id)
    if (index !== -1) {
      soalList.value[index] = { ...currentSoal.value } as Soal
    }
  } else {
    const newId = Math.max(...soalList.value.map(s => s.id)) + 1
    soalList.value.push({
      ...currentSoal.value,
      id: newId,
      tanggalDibuat: new Date().toISOString().split('T')[0]
    } as Soal)
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  currentSoal.value = {
    mataKuliah: '',
    pertanyaan: '',
    jenis: '',
    tingkatKesulitan: '',
    pilihan: ['', '', '', ''],
    jawabanBenar: undefined
  }
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

/* Question Cell */
.question-cell {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: help;
}

/* Type Badge */
.type-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.type-badge.pilihan-ganda {
  background-color: #dbeafe;
  color: #1e40af;
}

.type-badge.essay {
  background-color: #fef3c7;
  color: #92400e;
}

.type-badge.praktik {
  background-color: #ecfdf5;
  color: #059669;
}

/* Difficulty Badge */
.difficulty-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.difficulty-badge.mudah {
  background-color: #dcfce7;
  color: #166534;
}

.difficulty-badge.sedang {
  background-color: #fef3c7;
  color: #92400e;
}

.difficulty-badge.sulit {
  background-color: #fecaca;
  color: #991b1b;
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
  max-width: 600px;
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
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--oba-primary);
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.pilihan-item {
  margin-bottom: 8px;
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