<template>
  <div class="portofolio">
    <h1>Portofolio</h1>
    <p>Kelola dan tampilkan portofolio akademik Anda.</p>
    
    <div class="portofolio-sections">
      <!-- Publikasi Section -->
      <div class="section">
        <div class="section-header">
          <h2>Publikasi</h2>
          <button class="btn-add" @click="showPublikasiModal = true">+ Tambah</button>
        </div>
        <div class="items-grid">
          <div v-for="publikasi in publikasiList" :key="publikasi.id" class="item-card">
            <div class="item-header">
              <h3>{{ publikasi.judul }}</h3>
              <span :class="['status', publikasi.status.toLowerCase()]">{{ publikasi.status }}</span>
            </div>
            <p><strong>Jurnal:</strong> {{ publikasi.jurnal }}</p>
            <p><strong>Tahun:</strong> {{ publikasi.tahun }}</p>
            <p><strong>Penulis:</strong> {{ publikasi.penulis }}</p>
            <div class="item-actions">
              <button class="btn-edit">Edit</button>
              <button class="btn-view">Lihat</button>
              <button class="btn-delete">Hapus</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Penelitian Section -->
      <div class="section">
        <div class="section-header">
          <h2>Penelitian</h2>
          <button class="btn-add" @click="showPenelitianModal = true">+ Tambah</button>
        </div>
        <div class="items-grid">
          <div v-for="penelitian in penelitianList" :key="penelitian.id" class="item-card">
            <div class="item-header">
              <h3>{{ penelitian.judul }}</h3>
              <span :class="['status', penelitian.status.toLowerCase()]">{{ penelitian.status }}</span>
            </div>
            <p><strong>Jenis:</strong> {{ penelitian.jenis }}</p>
            <p><strong>Tahun:</strong> {{ penelitian.tahunMulai }} - {{ penelitian.tahunSelesai || 'Sedang Berjalan' }}</p>
            <p><strong>Sumber Dana:</strong> {{ penelitian.sumberDana }}</p>
            <div class="item-actions">
              <button class="btn-edit">Edit</button>
              <button class="btn-view">Lihat</button>
              <button class="btn-delete">Hapus</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pengabdian Section -->
      <div class="section">
        <div class="section-header">
          <h2>Pengabdian Masyarakat</h2>
          <button class="btn-add" @click="showPengabdianModal = true">+ Tambah</button>
        </div>
        <div class="items-grid">
          <div v-for="pengabdian in pengabdianList" :key="pengabdian.id" class="item-card">
            <div class="item-header">
              <h3>{{ pengabdian.judul }}</h3>
              <span :class="['status', pengabdian.status.toLowerCase()]">{{ pengabdian.status }}</span>
            </div>
            <p><strong>Lokasi:</strong> {{ pengabdian.lokasi }}</p>
            <p><strong>Tahun:</strong> {{ pengabdian.tahun }}</p>
            <p><strong>Peserta:</strong> {{ pengabdian.jumlahPeserta }} orang</p>
            <div class="item-actions">
              <button class="btn-edit">Edit</button>
              <button class="btn-view">Lihat</button>
              <button class="btn-delete">Hapus</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Publikasi -->
    <div v-if="showPublikasiModal" class="modal-overlay" @click="showPublikasiModal = false">
      <div class="modal" @click.stop>
        <h2>Tambah Publikasi</h2>
        <form @submit.prevent="addPublikasi">
          <div class="form-group">
            <label>Judul</label>
            <input v-model="newPublikasi.judul" type="text" required>
          </div>
          <div class="form-group">
            <label>Jurnal</label>
            <input v-model="newPublikasi.jurnal" type="text" required>
          </div>
          <div class="form-group">
            <label>Tahun</label>
            <input v-model="newPublikasi.tahun" type="number" min="2000" max="2030" required>
          </div>
          <div class="form-group">
            <label>Penulis</label>
            <input v-model="newPublikasi.penulis" type="text" required>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="newPublikasi.status" required>
              <option value="Published">Published</option>
              <option value="Submitted">Submitted</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="showPublikasiModal = false" class="btn-cancel">Batal</button>
            <button type="submit" class="btn-save">Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Penelitian -->
    <div v-if="showPenelitianModal" class="modal-overlay" @click="showPenelitianModal = false">
      <div class="modal" @click.stop>
        <h2>Tambah Penelitian</h2>
        <form @submit.prevent="addPenelitian">
          <div class="form-group">
            <label>Judul</label>
            <input v-model="newPenelitian.judul" type="text" required>
          </div>
          <div class="form-group">
            <label>Jenis</label>
            <select v-model="newPenelitian.jenis" required>
              <option value="Fundamental">Fundamental</option>
              <option value="Terapan">Terapan</option>
              <option value="Pengembangan">Pengembangan</option>
            </select>
          </div>
          <div class="form-group">
            <label>Tahun Mulai</label>
            <input v-model="newPenelitian.tahunMulai" type="number" min="2000" max="2030" required>
          </div>
          <div class="form-group">
            <label>Tahun Selesai</label>
            <input v-model="newPenelitian.tahunSelesai" type="number" min="2000" max="2030">
          </div>
          <div class="form-group">
            <label>Sumber Dana</label>
            <input v-model="newPenelitian.sumberDana" type="text" required>
          </div>
          <div class="modal-actions">
            <button type="button" @click="showPenelitianModal = false" class="btn-cancel">Batal</button>
            <button type="submit" class="btn-save">Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Pengabdian -->
    <div v-if="showPengabdianModal" class="modal-overlay" @click="showPengabdianModal = false">
      <div class="modal" @click.stop>
        <h2>Tambah Pengabdian Masyarakat</h2>
        <form @submit.prevent="addPengabdian">
          <div class="form-group">
            <label>Judul</label>
            <input v-model="newPengabdian.judul" type="text" required>
          </div>
          <div class="form-group">
            <label>Lokasi</label>
            <input v-model="newPengabdian.lokasi" type="text" required>
          </div>
          <div class="form-group">
            <label>Tahun</label>
            <input v-model="newPengabdian.tahun" type="number" min="2000" max="2030" required>
          </div>
          <div class="form-group">
            <label>Jumlah Peserta</label>
            <input v-model="newPengabdian.jumlahPeserta" type="number" min="1" required>
          </div>
          <div class="modal-actions">
            <button type="button" @click="showPengabdianModal = false" class="btn-cancel">Batal</button>
            <button type="submit" class="btn-save">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Publikasi {
  id: number
  judul: string
  jurnal: string
  tahun: number
  penulis: string
  status: string
}

interface Penelitian {
  id: number
  judul: string
  jenis: string
  tahunMulai: number
  tahunSelesai?: number
  sumberDana: string
  status: string
}

interface Pengabdian {
  id: number
  judul: string
  lokasi: string
  tahun: number
  jumlahPeserta: number
  status: string
}

const showPublikasiModal = ref(false)
const showPenelitianModal = ref(false)
const showPengabdianModal = ref(false)

const publikasiList = ref<Publikasi[]>([
  {
    id: 1,
    judul: 'Machine Learning Approaches for Educational Data Mining',
    jurnal: 'International Journal of Educational Technology',
    tahun: 2024,
    penulis: 'Dr. John Doe, Jane Smith',
    status: 'Published'
  },
  {
    id: 2,
    judul: 'Web-based Learning Management System Design',
    jurnal: 'Journal of Computer Science Education',
    tahun: 2023,
    penulis: 'Dr. John Doe',
    status: 'Published'
  }
])

const penelitianList = ref<Penelitian[]>([
  {
    id: 1,
    judul: 'Pengembangan Sistem Pembelajaran Adaptif Berbasis AI',
    jenis: 'Terapan',
    tahunMulai: 2024,
    sumberDana: 'Kemenristekdikti',
    status: 'Berjalan'
  },
  {
    id: 2,
    judul: 'Analisis Performa Database NoSQL untuk Big Data',
    jenis: 'Fundamental',
    tahunMulai: 2023,
    tahunSelesai: 2024,
    sumberDana: 'Internal Universitas',
    status: 'Selesai'
  }
])

const pengabdianList = ref<Pengabdian[]>([
  {
    id: 1,
    judul: 'Pelatihan Web Development untuk UMKM',
    lokasi: 'Bandung, Jawa Barat',
    tahun: 2024,
    jumlahPeserta: 50,
    status: 'Selesai'
  },
  {
    id: 2,
    judul: 'Workshop Digital Marketing untuk Guru',
    lokasi: 'Jakarta',
    tahun: 2023,
    jumlahPeserta: 75,
    status: 'Selesai'
  }
])

const newPublikasi = ref({
  judul: '',
  jurnal: '',
  tahun: new Date().getFullYear(),
  penulis: '',
  status: 'Draft'
})

const newPenelitian = ref({
  judul: '',
  jenis: '',
  tahunMulai: new Date().getFullYear(),
  tahunSelesai: undefined as number | undefined,
  sumberDana: ''
})

const newPengabdian = ref({
  judul: '',
  lokasi: '',
  tahun: new Date().getFullYear(),
  jumlahPeserta: 1
})

const addPublikasi = () => {
  const id = Math.max(...publikasiList.value.map(p => p.id)) + 1
  publikasiList.value.push({ id, ...newPublikasi.value })
  newPublikasi.value = { judul: '', jurnal: '', tahun: new Date().getFullYear(), penulis: '', status: 'Draft' }
  showPublikasiModal.value = false
}

const addPenelitian = () => {
  const id = Math.max(...penelitianList.value.map(p => p.id)) + 1
  const status = newPenelitian.value.tahunSelesai ? 'Selesai' : 'Berjalan'
  penelitianList.value.push({ id, ...newPenelitian.value, status })
  newPenelitian.value = { judul: '', jenis: '', tahunMulai: new Date().getFullYear(), tahunSelesai: undefined, sumberDana: '' }
  showPenelitianModal.value = false
}

const addPengabdian = () => {
  const id = Math.max(...pengabdianList.value.map(p => p.id)) + 1
  pengabdianList.value.push({ id, ...newPengabdian.value, status: 'Selesai' })
  newPengabdian.value = { judul: '', lokasi: '', tahun: new Date().getFullYear(), jumlahPeserta: 1 }
  showPengabdianModal.value = false
}
</script>

<style scoped>
.portofolio {
  padding: 24px;
}

.portofolio h1 {
  color: #374151;
  margin-bottom: 16px;
}

.portofolio p {
  color: #6b7280;
  margin-bottom: 32px;
}

.portofolio-sections {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  margin: 0;
  color: #374151;
  font-size: 1.25rem;
}

.btn-add {
  background-color: #059669;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
}

.btn-add:hover {
  background-color: #047857;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.item-card {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px;
  background: #f9fafb;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
}

.item-header h3 {
  margin: 0;
  color: #374151;
  font-size: 1rem;
  flex: 1;
  margin-right: 12px;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.status.published {
  background-color: #dcfce7;
  color: #166534;
}

.status.submitted {
  background-color: #fef3c7;
  color: #92400e;
}

.status.draft {
  background-color: #f3f4f6;
  color: #374151;
}

.status.berjalan {
  background-color: #dbeafe;
  color: #1e40af;
}

.status.selesai {
  background-color: #dcfce7;
  color: #166534;
}

.item-card p {
  margin-bottom: 8px;
  color: #6b7280;
  font-size: 0.875rem;
}

.item-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.btn-edit, .btn-view, .btn-delete {
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

.btn-view {
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