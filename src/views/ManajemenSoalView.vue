<template>
  <div class="manajemen-soal">
    <h1>Manajemen Soal</h1>
    <p>Kelola bank soal untuk ujian dan kuis.</p>
    
    <div class="filters">
      <div class="filter-group">
        <label>Mata Kuliah:</label>
        <select v-model="selectedMataKuliah">
          <option value="">Semua Mata Kuliah</option>
          <option value="TI301">Pemrograman Web</option>
          <option value="TI302">Basis Data</option>
          <option value="TI401">Mobile Programming</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Jenis Soal:</label>
        <select v-model="selectedJenis">
          <option value="">Semua Jenis</option>
          <option value="Pilihan Ganda">Pilihan Ganda</option>
          <option value="Essay">Essay</option>
          <option value="Praktik">Praktik</option>
        </select>
      </div>
      <button class="btn-primary" @click="showAddModal = true">Tambah Soal</button>
    </div>

    <div class="soal-table">
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Mata Kuliah</th>
            <th>Pertanyaan</th>
            <th>Jenis</th>
            <th>Tingkat Kesulitan</th>
            <th>Dibuat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(soal, index) in filteredSoal" :key="soal.id">
            <td>{{ index + 1 }}</td>
            <td>{{ soal.mataKuliah }}</td>
            <td class="question-cell">{{ soal.pertanyaan }}</td>
            <td>
              <span :class="['badge', soal.jenis.toLowerCase().replace(' ', '-')]">
                {{ soal.jenis }}
              </span>
            </td>
            <td>
              <span :class="['difficulty', soal.tingkatKesulitan.toLowerCase()]">
                {{ soal.tingkatKesulitan }}
              </span>
            </td>
            <td>{{ formatDate(soal.tanggalDibuat) }}</td>
            <td>
              <button class="btn-edit" @click="editSoal(soal)">Edit</button>
              <button class="btn-delete" @click="deleteSoal(soal.id)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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

const selectedMataKuliah = ref('')
const selectedJenis = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)

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

const filteredSoal = computed(() => {
  return soalList.value.filter(soal => {
    const matchMatkul = !selectedMataKuliah.value || soal.mataKuliah === selectedMataKuliah.value
    const matchJenis = !selectedJenis.value || soal.jenis === selectedJenis.value
    return matchMatkul && matchJenis
  })
})

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
.manajemen-soal {
  padding: 24px;
}

.manajemen-soal h1 {
  color: #374151;
  margin-bottom: 16px;
}

.manajemen-soal p {
  color: #6b7280;
  margin-bottom: 32px;
}

.filters {
  display: flex;
  gap: 20px;
  align-items: end;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.filter-group select {
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  min-width: 150px;
}

.btn-primary {
  background-color: #1e40af;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  height: fit-content;
}

.soal-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.question-cell {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge.pilihan-ganda {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge.essay {
  background-color: #fef3c7;
  color: #92400e;
}

.badge.praktik {
  background-color: #ecfdf5;
  color: #059669;
}

.difficulty {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.difficulty.mudah {
  background-color: #dcfce7;
  color: #166534;
}

.difficulty.sedang {
  background-color: #fef3c7;
  color: #92400e;
}

.difficulty.sulit {
  background-color: #fecaca;
  color: #991b1b;
}

.btn-edit, .btn-delete {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  margin-right: 8px;
}

.btn-edit {
  background-color: #3b82f6;
  color: white;
}

.btn-delete {
  background-color: #dc2626;
  color: white;
}

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
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 {
  margin-bottom: 20px;
  color: #374151;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  color: #374151;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.pilihan-item {
  margin-bottom: 8px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-cancel {
  background-color: #6b7280;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-save {
  background-color: #059669;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>