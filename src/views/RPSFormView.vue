<template>
  <StandardLayout title="FORM RENCANA PEMBELAJARAN SEMESTER (RPS)" subtitle="Buat Rencana Pembelajaran Semester baru">
    <template #content>
      <div class="rps-form-container">

      <!-- Tab Navigation -->
      <div class="tabs">
        <button 
          v-for="(tab, index) in tabs" 
          :key="tab.id"
          class="tab-btn"
          :class="{ active: currentTab === index }"
          @click="showTab(index)"
        >
          {{ index + 1 }}. {{ tab.title }}
        </button>
      </div>

      <!-- Tab Contents -->
      <div class="tab-contents">
        <!-- 1. Identitas RPS -->
        <div v-show="currentTab === 0" class="tab-content">
          <h2>1. Identitas RPS</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>Kode Mata Kuliah</label>
              <input v-model="formData.identitas.kodeMK" type="text" required>
            </div>
            <div class="form-group">
              <label>Nama Mata Kuliah</label>
              <input v-model="formData.identitas.namaMK" type="text" required>
            </div>
            <div class="form-group">
              <label>Bobot SKS</label>
              <div class="sks-container">
                <input v-model.number="formData.identitas.sksTeori" type="number" placeholder="Teori" min="0"> /
                <input v-model.number="formData.identitas.sksPraktik" type="number" placeholder="Praktik" min="0">
              </div>
            </div>
            <div class="form-group">
              <label>Status Mata Kuliah</label>
              <select v-model="formData.identitas.status">
                <option value="wajib">Wajib</option>
                <option value="pilihan">Pilihan</option>
              </select>
            </div>
            <div class="form-group">
              <label>Mata Kuliah Prasyarat</label>
              <input v-model="formData.identitas.prasyarat" type="text" placeholder="Kosongkan jika tidak ada">
            </div>
          </div>
        </div>

        <!-- 2. Deskripsi Singkat -->
        <div v-show="currentTab === 1" class="tab-content">
          <h2>2. Deskripsi Singkat Mata Kuliah</h2>
          <div class="form-group full-width">
            <textarea v-model="formData.deskripsi" rows="6" placeholder="Masukkan deskripsi lengkap..."></textarea>
          </div>
        </div>

        <!-- 3. CPL -->
        <div v-show="currentTab === 2" class="tab-content">
          <h2>3. Capaian Pembelajaran Lulusan (CPL)</h2>
          <table class="data-table">
            <thead>
              <tr>
                <th width="20%">Kode CPL</th>
                <th width="70%">Deskripsi CPL</th>
                <th width="10%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cpl, index) in formData.cpl" :key="index">
                <td><input v-model="cpl.kode" type="text" placeholder="CPL1"></td>
                <td><input v-model="cpl.deskripsi" type="text" placeholder="Deskripsi CPL"></td>
                <td>
                  <button class="btn-delete" @click="removeRow('cpl', index)" :disabled="formData.cpl.length <= 1">
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="btn-add" @click="addRow('cpl')">+ Tambah CPL</button>
        </div>

        <!-- 4. CPMK -->
        <div v-show="currentTab === 3" class="tab-content">
          <h2>4. Capaian Pembelajaran Mata Kuliah (CPMK)</h2>
          <table class="data-table">
            <thead>
              <tr>
                <th width="20%">Kode CPMK</th>
                <th width="70%">Deskripsi CPMK</th>
                <th width="10%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cpmk, index) in formData.cpmk" :key="index">
                <td><input v-model="cpmk.kode" type="text" placeholder="CPMK1"></td>
                <td><input v-model="cpmk.deskripsi" type="text" placeholder="Deskripsi CPMK"></td>
                <td>
                  <button class="btn-delete" @click="removeRow('cpmk', index)" :disabled="formData.cpmk.length <= 1">
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="btn-add" @click="addRow('cpmk')">+ Tambah CPMK</button>
        </div>

        <!-- 5. Materi Pembelajaran -->
        <div v-show="currentTab === 4" class="tab-content">
          <h2>5. Materi Pembelajaran</h2>
          <table class="data-table">
            <thead>
              <tr>
                <th width="15%">Kode CPMK</th>
                <th width="45%">Materi Pembelajaran</th>
                <th width="20%">Bentuk Pembelajaran</th>
                <th width="15%">Alokasi Waktu</th>
                <th width="5%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(materi, index) in formData.materi" :key="index">
                <td>
                  <select v-model="materi.kodeCPMK">
                    <option v-for="cpmk in formData.cpmk" :key="cpmk.kode" :value="cpmk.kode">
                      {{ cpmk.kode }}
                    </option>
                  </select>
                </td>
                <td><input v-model="materi.judul" type="text" placeholder="Judul Materi"></td>
                <td>
                  <select v-model="materi.bentuk">
                    <option value="luring">Luring</option>
                    <option value="daring">Daring</option>
                  </select>
                </td>
                <td><input v-model="materi.waktu" type="text" placeholder="10x50 menit"></td>
                <td>
                  <button class="btn-delete" @click="removeRow('materi', index)" :disabled="formData.materi.length <= 1">
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="btn-add" @click="addRow('materi')">+ Tambah Materi</button>
        </div>

        <!-- 6. Metode Pembelajaran -->
        <div v-show="currentTab === 5" class="tab-content">
          <h2>6. Metode Pembelajaran</h2>
          <div class="checkbox-group">
            <label>
              <input v-model="formData.metode.diskusi" type="checkbox">
              Small Group Discussion
            </label>
            <label>
              <input v-model="formData.metode.project" type="checkbox">
              Project-Based Learning
            </label>
            <label>
              <input v-model="formData.metode.roleplay" type="checkbox">
              Role-Play & Simulation
            </label>
            <label>
              <input v-model="formData.metode.lainnya.enabled" type="checkbox">
              Lainnya:
            </label>
            <textarea 
              v-model="formData.metode.lainnya.value" 
              rows="3"
              :disabled="!formData.metode.lainnya.enabled"
              placeholder="Sebutkan metode lainnya..."
              class="lainnya-textarea"
            ></textarea>
          </div>
        </div>

        <!-- 7. Pengalaman Belajar -->
        <div v-show="currentTab === 6" class="tab-content">
          <h2>7. Pengalaman Belajar Mahasiswa</h2>
          <div class="form-group full-width">
            <textarea 
              v-model="formData.pengalamanBelajar" 
              rows="4" 
              placeholder="Contoh: Presentasi kasus, diskusi kelompok..."
            ></textarea>
          </div>
        </div>

        <!-- 8. Media Pembelajaran -->
        <div v-show="currentTab === 7" class="tab-content">
          <h2>8. Media Pembelajaran</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>Link LMS</label>
              <input v-model="formData.media.linkLMS" type="url" placeholder="https://">
            </div>
            <div class="form-group">
              <label>Presentase Pembelajaran</label>
              <div class="percentage-container">
                <input 
                  v-model.number="formData.media.presentaseLuring" 
                  type="number" 
                  min="0" 
                  max="100" 
                  placeholder="Luring"
                  @input="updateDaringPercentage"
                > %
                <input 
                  v-model.number="formData.media.presentaseDaring" 
                  type="number" 
                  min="0" 
                  max="100" 
                  placeholder="Daring"
                  @input="updateLuringPercentage"
                > %
              </div>
              <small v-if="totalPercentage !== 100" class="error-text">
                Total harus 100% (saat ini: {{ totalPercentage }}%)
              </small>
            </div>
          </div>
        </div>

        <!-- 9. Penilaian -->
        <div v-show="currentTab === 8" class="tab-content">
          <h2>9. Metode Penilaian</h2>
          <table class="data-table">
            <thead>
              <tr>
                <th width="20%">Basis Evaluasi</th>
                <th width="25%">Komponen</th>
                <th width="15%">Bobot (%)</th>
                <th width="25%">CPMK Terkait</th>
                <th width="10%">Bobot CPMK</th>
                <th width="5%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(penilaian, index) in formData.penilaian" :key="index">
                <td>
                  <select v-model="penilaian.basisEvaluasi">
                    <option value="aktivitas">Aktivitas Partisipatif</option>
                    <option value="project">Hasil Project/Studi Kasus</option>
                    <option value="kognitif">Kognitif</option>
                  </select>
                </td>
                <td><input v-model="penilaian.komponen" type="text" placeholder="Tugas/UTS/UAS"></td>
                <td><input v-model.number="penilaian.bobot" type="number" min="0" max="100" placeholder="0-100"></td>
                <td>
                  <select v-model="penilaian.cpmkTerkait">
                    <option v-for="cpmk in formData.cpmk" :key="cpmk.kode" :value="cpmk.kode">
                      {{ cpmk.kode }}
                    </option>
                  </select>
                </td>
                <td><input v-model.number="penilaian.bobotCPMK" type="number" min="0" max="100" placeholder="0-100"></td>
                <td>
                  <button class="btn-delete" @click="removeRow('penilaian', index)" :disabled="formData.penilaian.length <= 1">
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="btn-add" @click="addRow('penilaian')">+ Tambah Baris</button>
          <div v-if="totalBobotPenilaian !== 100" class="validation-warning">
            <small class="error-text">
              Total bobot penilaian harus 100% (saat ini: {{ totalBobotPenilaian }}%)
            </small>
          </div>
        </div>

        <!-- 10. Referensi -->
        <div v-show="currentTab === 9" class="tab-content">
          <h2>10. Daftar Referensi</h2>
          <table class="data-table">
            <thead>
              <tr>
                <th width="5%">No</th>
                <th width="45%">Judul</th>
                <th width="25%">Pengarang</th>
                <th width="15%">Tahun</th>
                <th width="10%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(referensi, index) in formData.referensi" :key="index">
                <td>{{ index + 1 }}</td>
                <td><input v-model="referensi.judul" type="text" placeholder="Judul Buku"></td>
                <td><input v-model="referensi.pengarang" type="text" placeholder="Pengarang"></td>
                <td><input v-model="referensi.tahun" type="text" placeholder="Tahun"></td>
                <td>
                  <button class="btn-delete" @click="removeRow('referensi', index)" :disabled="formData.referensi.length <= 1">
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="btn-add" @click="addRow('referensi')">+ Tambah Referensi</button>
        </div>

        <!-- 11. Dosen Pengampu -->
        <div v-show="currentTab === 10" class="tab-content">
          <h2>11. Dosen Pengampu</h2>
          <table class="data-table">
            <thead>
              <tr>
                <th width="30%">Nama Dosen</th>
                <th width="20%">Gelar</th>
                <th width="40%">Peran</th>
                <th width="10%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(dosen, index) in formData.dosen" :key="index">
                <td><input v-model="dosen.nama" type="text" placeholder="Nama lengkap"></td>
                <td><input v-model="dosen.gelar" type="text" placeholder="S.E., M.Acc."></td>
                <td>
                  <select v-model="dosen.peran">
                    <option value="utama">Pengampu Utama</option>
                    <option value="team">Team Teaching</option>
                  </select>
                </td>
                <td>
                  <button class="btn-delete" @click="removeRow('dosen', index)" :disabled="formData.dosen.length <= 1">
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="btn-add" @click="addRow('dosen')">+ Tambah Dosen</button>
        </div>

        <!-- 12. Otorisasi -->
        <div v-show="currentTab === 11" class="tab-content">
          <h2>12. Otorisasi</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>Tanggal Penyusunan</label>
              <input v-model="formData.otorisasi.tanggal" type="date">
            </div>
            <div class="form-group">
              <label>Koordinator Mata Kuliah</label>
              <input v-model="formData.otorisasi.koordinatorMK" type="text" placeholder="Nama lengkap">
            </div>
            <div class="form-group">
              <label>Koordinator Bidang Keahlian</label>
              <input v-model="formData.otorisasi.koordinatorKeahlian" type="text" placeholder="Opsional">
            </div>
            <div class="form-group">
              <label>Ketua Program Studi</label>
              <input v-model="formData.otorisasi.kaprodi" type="text" placeholder="Nama lengkap">
            </div>
          </div>
          <div class="signature-container">
            <div class="signature-box">
              <p>Koordinator Mata Kuliah</p>
              <div class="signature-line"></div>
            </div>
            <div class="signature-box">
              <p>Ketua Program Studi</p>
              <div class="signature-line"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="navigation">
        <button class="btn-nav" @click="previousTab" :disabled="currentTab === 0">
          Sebelumnya
        </button>
        <span class="tab-indicator">{{ currentTab + 1 }}/{{ tabs.length }}</span>
        <button class="btn-nav btn-primary" @click="nextTab">
          {{ currentTab === tabs.length - 1 ? 'Simpan' : 'Berikutnya' }}
        </button>
      </div>
      </div>
    </template>
  </StandardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StandardLayout from '../components/StandardLayout.vue'
import { useNotifications } from '../composables/useNotifications'

const router = useRouter()
const { showSuccess, showError } = useNotifications()

// Tab configuration
const tabs = [
  { id: 'identitas', title: 'Identitas' },
  { id: 'deskripsi', title: 'Deskripsi' },
  { id: 'cpl', title: 'CPL' },
  { id: 'cpmk', title: 'CPMK' },
  { id: 'materi', title: 'Materi' },
  { id: 'metode', title: 'Metode' },
  { id: 'pengalaman', title: 'Pengalaman' },
  { id: 'media', title: 'Media' },
  { id: 'penilaian', title: 'Penilaian' },
  { id: 'referensi', title: 'Referensi' },
  { id: 'dosen', title: 'Dosen' },
  { id: 'otorisasi', title: 'Otorisasi' }
]

const currentTab = ref(0)

// Form data structure
const formData = ref({
  identitas: {
    kodeMK: '',
    namaMK: '',
    sksTeori: 0,
    sksPraktik: 0,
    status: 'wajib',
    prasyarat: ''
  },
  deskripsi: '',
  cpl: [
    { kode: '', deskripsi: '' }
  ],
  cpmk: [
    { kode: '', deskripsi: '' }
  ],
  materi: [
    { kodeCPMK: '', judul: '', bentuk: 'luring', waktu: '' }
  ],
  metode: {
    diskusi: false,
    project: false,
    roleplay: false,
    lainnya: {
      enabled: false,
      value: ''
    }
  },
  pengalamanBelajar: '',
  media: {
    linkLMS: '',
    presentaseLuring: 0,
    presentaseDaring: 0
  },
  penilaian: [
    { basisEvaluasi: 'aktivitas', komponen: '', bobot: 0, cpmkTerkait: '', bobotCPMK: 0 }
  ],
  referensi: [
    { judul: '', pengarang: '', tahun: '' }
  ],
  dosen: [
    { nama: '', gelar: '', peran: 'utama' }
  ],
  otorisasi: {
    tanggal: '',
    koordinatorMK: '',
    koordinatorKeahlian: '',
    kaprodi: ''
  }
})

// Computed properties
const totalPercentage = computed(() => {
  return (formData.value.media.presentaseLuring || 0) + (formData.value.media.presentaseDaring || 0)
})

const totalBobotPenilaian = computed(() => {
  return formData.value.penilaian.reduce((total, item) => total + (item.bobot || 0), 0)
})

// Methods
const showTab = (index: number) => {
  if (index >= 0 && index < tabs.length) {
    currentTab.value = index
    window.scrollTo(0, 0)
  }
}

const previousTab = () => {
  if (currentTab.value > 0) {
    showTab(currentTab.value - 1)
  }
}

const nextTab = () => {
  if (currentTab.value < tabs.length - 1) {
    showTab(currentTab.value + 1)
  } else {
    saveForm()
  }
}

const addRow = (type: string) => {
  const rowTemplates = {
    cpl: { kode: '', deskripsi: '' },
    cpmk: { kode: '', deskripsi: '' },
    materi: { kodeCPMK: '', judul: '', bentuk: 'luring', waktu: '' },
    penilaian: { basisEvaluasi: 'aktivitas', komponen: '', bobot: 0, cpmkTerkait: '', bobotCPMK: 0 },
    referensi: { judul: '', pengarang: '', tahun: '' },
    dosen: { nama: '', gelar: '', peran: 'utama' }
  }

  if (rowTemplates[type as keyof typeof rowTemplates]) {
    const array = formData.value[type as keyof typeof formData.value] as Array<Record<string, string | number>>
    array.push({ ...rowTemplates[type as keyof typeof rowTemplates] })
  }
}

const removeRow = (type: string, index: number) => {
  const array = formData.value[type as keyof typeof formData.value] as Array<Record<string, string | number>>
  if (array.length > 1) {
    array.splice(index, 1)
  }
}

const updateDaringPercentage = () => {
  const luring = formData.value.media.presentaseLuring || 0
  if (luring >= 0 && luring <= 100) {
    formData.value.media.presentaseDaring = 100 - luring
  }
}

const updateLuringPercentage = () => {
  const daring = formData.value.media.presentaseDaring || 0
  if (daring >= 0 && daring <= 100) {
    formData.value.media.presentaseLuring = 100 - daring
  }
}

const validateForm = (): boolean => {
  // Basic validation
  if (!formData.value.identitas.kodeMK || !formData.value.identitas.namaMK) {
    showError('Kode dan nama mata kuliah harus diisi')
    showTab(0)
    return false
  }

  // Validation for evaluation weights
  if (totalBobotPenilaian.value !== 100) {
    showError(`Total bobot penilaian harus 100% (saat ini: ${totalBobotPenilaian.value}%)`)
    showTab(8)
    return false
  }

  // Validation for learning percentage
  if (totalPercentage.value !== 100) {
    showError(`Total presentase pembelajaran harus 100% (saat ini: ${totalPercentage.value}%)`)
    showTab(7)
    return false
  }

  return true
}

const saveForm = () => {
  if (!validateForm()) {
    return
  }

  // Here you would typically send data to the API
  console.log('Saving RPS form data:', formData.value)
  
  showSuccess('Data RPS berhasil disimpan!')
  
  // Navigate back to management page
  router.push('/manajemen-rps')
}

onMounted(() => {
  // Initialize form with current date
  formData.value.otorisasi.tanggal = new Date().toISOString().split('T')[0]
})
</script>

<style scoped>
.rps-form-container {
  max-width: 1200px;
  margin: 0 auto;
  background: var(--oba-white);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}


/* Tabs */
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--oba-border);
  padding-bottom: 10px;
}

.tab-btn {
  padding: 10px 15px;
  background: var(--oba-surface);
  border: 1px solid var(--oba-border);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px 6px 0 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--oba-text-light);
}

.tab-btn:hover {
  background: var(--oba-primary-light);
  color: var(--oba-white);
}

.tab-btn.active {
  background: var(--oba-primary);
  color: var(--oba-white);
  border-bottom-color: var(--oba-primary);
}

.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

.tab-content h2 {
  color: var(--oba-primary);
  border-bottom: 2px solid var(--oba-primary);
  padding-bottom: 8px;
  margin-top: 0;
  margin-bottom: 20px;
}

/* Form Elements */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: var(--oba-text);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--oba-border);
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--oba-primary);
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.sks-container,
.percentage-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sks-container input,
.percentage-container input {
  flex: 1;
}

/* Tables */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  border: 1px solid var(--oba-border);
  border-radius: 8px;
  overflow: hidden;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--oba-border);
}

.data-table th {
  background-color: var(--oba-primary);
  color: var(--oba-white);
  font-weight: 600;
  font-size: 0.875rem;
}

.data-table td input,
.data-table td select {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--oba-border);
  border-radius: 4px;
  font-size: 0.875rem;
}

/* Buttons */
.btn-add {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
  color: var(--oba-white);
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(22, 163, 74, 0.2);
}

.btn-add:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
}

.btn-delete {
  background-color: #dc2626;
  color: var(--oba-white);
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: background-color 0.2s ease;
}

.btn-delete:hover:not(:disabled) {
  background-color: #b91c1c;
}

.btn-delete:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.btn-nav {
  padding: 12px 20px;
  background: var(--oba-surface);
  color: var(--oba-text);
  border: 1px solid var(--oba-border);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-nav:hover:not(:disabled) {
  background: var(--oba-primary-light);
  color: var(--oba-white);
}

.btn-nav:disabled {
  background: var(--oba-surface);
  color: var(--oba-text-light);
  cursor: not-allowed;
}

.btn-nav.btn-primary {
  background: linear-gradient(135deg, var(--oba-primary) 0%, var(--oba-primary-light) 100%);
  color: var(--oba-white);
  border-color: var(--oba-primary);
}

.btn-nav.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
}

/* Checkbox Group */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: normal;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.checkbox-group input[type="text"] {
  margin-left: 10px;
  flex: 1;
}

.lainnya-textarea {
  width: 100%;
  margin-top: 8px;
  padding: 10px 12px;
  border: 1px solid var(--oba-border);
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
  resize: vertical;
}

.lainnya-textarea:disabled {
  background-color: var(--oba-surface);
  color: var(--oba-text-light);
  cursor: not-allowed;
}

.lainnya-textarea:focus:not(:disabled) {
  outline: none;
  border-color: var(--oba-primary);
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

/* Signature */
.signature-container {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
  gap: 20px;
}

.signature-box {
  text-align: center;
  flex: 1;
  max-width: 250px;
}

.signature-box p {
  font-weight: 600;
  margin-bottom: 60px;
  color: var(--oba-text);
}

.signature-line {
  height: 1px;
  background: var(--oba-text);
  margin-top: 10px;
}

/* Navigation */
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--oba-border);
}

.tab-indicator {
  font-weight: 600;
  color: var(--oba-text);
  font-size: 0.875rem;
}

/* Validation */
.error-text {
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 4px;
  display: block;
}

.validation-warning {
  margin-top: 10px;
  padding: 10px;
  background-color: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 6px;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .signature-container {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .rps-form-container {
    padding: 20px;
  }
  
  .tabs {
    overflow-x: auto;
    white-space: nowrap;
    display: block;
    padding-bottom: 5px;
  }
  
  .tab-btn {
    display: inline-block;
    margin-right: 5px;
    white-space: nowrap;
  }
  
  .data-table {
    font-size: 0.75rem;
  }
  
  .data-table th,
  .data-table td {
    padding: 8px;
  }
  
  .navigation {
    flex-direction: column;
    gap: 15px;
  }
  
  .btn-nav {
    width: 100%;
  }
}
</style>