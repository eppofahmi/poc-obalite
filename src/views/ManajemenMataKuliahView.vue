<template>
  <div class="manajemen-mata-kuliah">
    <h1>Manajemen Mata Kuliah</h1>
    <p>Kelola mata kuliah yang Anda ampu di sini.</p>
    
    <div class="actions">
      <button class="btn-primary" @click="showModal = true">Tambah Mata Kuliah</button>
    </div>

    <div class="mata-kuliah-grid">
      <div v-for="matkul in mataKuliahList" :key="matkul.id" class="mata-kuliah-card">
        <div class="card-header">
          <h3>{{ matkul.nama }}</h3>
          <span :class="['status', matkul.status.toLowerCase()]">{{ matkul.status }}</span>
        </div>
        <div class="card-body">
          <p><strong>Kode:</strong> {{ matkul.kode }}</p>
          <p><strong>SKS:</strong> {{ matkul.sks }}</p>
          <p><strong>Semester:</strong> {{ matkul.semester }}</p>
          <p><strong>Jumlah Mahasiswa:</strong> {{ matkul.jumlahMahasiswa }}</p>
        </div>
        <div class="card-actions">
          <button class="btn-edit">Edit</button>
          <button class="btn-detail">Detail</button>
          <button class="btn-delete">Hapus</button>
        </div>
      </div>
    </div>

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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface MataKuliah {
  id: number
  nama: string
  kode: string
  sks: number
  semester: string
  status: string
  jumlahMahasiswa: number
}

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
.manajemen-mata-kuliah {
  padding: 24px;
}

.manajemen-mata-kuliah h1 {
  color: #374151;
  margin-bottom: 16px;
}

.manajemen-mata-kuliah p {
  color: #6b7280;
  margin-bottom: 32px;
}

.actions {
  margin-bottom: 24px;
}

.btn-primary {
  background-color: #1e40af;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.mata-kuliah-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.mata-kuliah-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 16px;
}

.card-header h3 {
  margin: 0;
  color: #374151;
  font-size: 1.125rem;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status.aktif {
  background-color: #dcfce7;
  color: #166534;
}

.status.persiapan {
  background-color: #fef3c7;
  color: #92400e;
}

.card-body {
  margin-bottom: 16px;
}

.card-body p {
  margin-bottom: 8px;
  color: #6b7280;
  font-size: 0.875rem;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.btn-edit, .btn-detail, .btn-delete {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  flex: 1;
}

.btn-edit {
  background-color: #3b82f6;
  color: white;
}

.btn-detail {
  background-color: #6b7280;
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
  max-width: 500px;
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
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
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