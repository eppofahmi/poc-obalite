<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="modal-title">
          <h2>Detail RPS - {{ rpsData?.identitas?.namaMK || 'Tidak Diketahui' }}</h2>
          <p class="modal-subtitle">{{ rpsData?.identitas?.kodeMK }} | {{ (rpsData?.identitas?.sksTeori || 0) + (rpsData?.identitas?.sksPraktik || 0) }} SKS</p>
        </div>
        <button class="modal-close" @click="closeModal">
          <X :size="24" />
        </button>
      </div>

      <!-- Tab Navigation -->
      <div class="modal-tabs">
        <button 
          v-for="(tab, index) in tabs" 
          :key="tab.id"
          class="tab-btn"
          :class="{ active: currentTab === index }"
          @click="currentTab = index"
        >
          {{ index + 1 }}. {{ tab.title }}
        </button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- 1. Identitas RPS -->
        <div v-show="currentTab === 0" class="tab-content">
          <h3>1. Identitas RPS</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Kode Mata Kuliah</label>
              <span>{{ rpsData?.identitas?.kodeMK || '-' }}</span>
            </div>
            <div class="info-item">
              <label>Nama Mata Kuliah</label>
              <span>{{ rpsData?.identitas?.namaMK || '-' }}</span>
            </div>
            <div class="info-item">
              <label>Bobot SKS</label>
              <span>{{ rpsData?.identitas?.sksTeori || 0 }} / {{ rpsData?.identitas?.sksPraktik || 0 }} (Teori/Praktik)</span>
            </div>
            <div class="info-item">
              <label>Status Mata Kuliah</label>
              <span class="status-badge" :class="rpsData?.identitas?.status">
                {{ rpsData?.identitas?.status === 'wajib' ? 'Wajib' : 'Pilihan' }}
              </span>
            </div>
            <div class="info-item full-width">
              <label>Mata Kuliah Prasyarat</label>
              <span>{{ rpsData?.identitas?.prasyarat || 'Tidak ada' }}</span>
            </div>
          </div>
        </div>

        <!-- 2. Deskripsi Singkat -->
        <div v-show="currentTab === 1" class="tab-content">
          <h3>2. Deskripsi Singkat Mata Kuliah</h3>
          <div class="description-content">
            <p>{{ rpsData?.deskripsi || 'Tidak ada deskripsi' }}</p>
          </div>
        </div>

        <!-- 3. CPL -->
        <div v-show="currentTab === 2" class="tab-content">
          <h3>3. Capaian Pembelajaran Lulusan (CPL)</h3>
          <div class="view-table">
            <table>
              <thead>
                <tr>
                  <th width="20%">Kode CPL</th>
                  <th width="80%">Deskripsi CPL</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(cpl, index) in rpsData?.cpl" :key="index">
                  <td>{{ cpl.kode }}</td>
                  <td>{{ cpl.deskripsi }}</td>
                </tr>
                <tr v-if="!rpsData?.cpl?.length">
                  <td colspan="2" class="no-data">Tidak ada data CPL</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 4. CPMK -->
        <div v-show="currentTab === 3" class="tab-content">
          <h3>4. Capaian Pembelajaran Mata Kuliah (CPMK)</h3>
          <div class="view-table">
            <table>
              <thead>
                <tr>
                  <th width="20%">Kode CPMK</th>
                  <th width="80%">Deskripsi CPMK</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(cpmk, index) in rpsData?.cpmk" :key="index">
                  <td>{{ cpmk.kode }}</td>
                  <td>{{ cpmk.deskripsi }}</td>
                </tr>
                <tr v-if="!rpsData?.cpmk?.length">
                  <td colspan="2" class="no-data">Tidak ada data CPMK</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 5. Materi Pembelajaran -->
        <div v-show="currentTab === 4" class="tab-content">
          <h3>5. Materi Pembelajaran</h3>
          <div class="view-table">
            <table>
              <thead>
                <tr>
                  <th width="15%">Kode CPMK</th>
                  <th width="45%">Materi Pembelajaran</th>
                  <th width="20%">Bentuk Pembelajaran</th>
                  <th width="20%">Alokasi Waktu</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(materi, index) in rpsData?.materi" :key="index">
                  <td>{{ materi.kodeCPMK }}</td>
                  <td>{{ materi.judul }}</td>
                  <td>
                    <span class="bentuk-badge" :class="materi.bentuk">
                      {{ materi.bentuk === 'luring' ? 'Luring' : 'Daring' }}
                    </span>
                  </td>
                  <td>{{ materi.waktu }}</td>
                </tr>
                <tr v-if="!rpsData?.materi?.length">
                  <td colspan="4" class="no-data">Tidak ada data materi</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 6. Metode Pembelajaran -->
        <div v-show="currentTab === 5" class="tab-content">
          <h3>6. Metode Pembelajaran</h3>
          <div class="metode-list">
            <div class="metode-item" v-if="rpsData?.metode?.diskusi">
              <CheckCircle :size="16" class="check-icon" />
              <span>Small Group Discussion</span>
            </div>
            <div class="metode-item" v-if="rpsData?.metode?.project">
              <CheckCircle :size="16" class="check-icon" />
              <span>Project-Based Learning</span>
            </div>
            <div class="metode-item" v-if="rpsData?.metode?.roleplay">
              <CheckCircle :size="16" class="check-icon" />
              <span>Role-Play & Simulation</span>
            </div>
            <div class="metode-item" v-if="rpsData?.metode?.lainnya?.enabled && rpsData?.metode?.lainnya?.value">
              <CheckCircle :size="16" class="check-icon" />
              <span>Lainnya: {{ rpsData.metode.lainnya.value }}</span>
            </div>
            <div v-if="!hasAnyMetode" class="no-data">Tidak ada metode pembelajaran yang dipilih</div>
          </div>
        </div>

        <!-- 7. Pengalaman Belajar -->
        <div v-show="currentTab === 6" class="tab-content">
          <h3>7. Pengalaman Belajar Mahasiswa</h3>
          <div class="description-content">
            <p>{{ rpsData?.pengalamanBelajar || 'Tidak ada data pengalaman belajar' }}</p>
          </div>
        </div>

        <!-- 8. Media Pembelajaran -->
        <div v-show="currentTab === 7" class="tab-content">
          <h3>8. Media Pembelajaran</h3>
          <div class="info-grid">
            <div class="info-item full-width">
              <label>Link LMS</label>
              <span>
                <a v-if="rpsData?.media?.linkLMS" :href="rpsData.media.linkLMS" target="_blank" class="link">
                  {{ rpsData.media.linkLMS }}
                </a>
                <span v-else>-</span>
              </span>
            </div>
            <div class="info-item">
              <label>Presentase Luring</label>
              <div class="percentage-display">
                <div class="percentage-bar">
                  <div class="percentage-fill" :style="{ width: (rpsData?.media?.presentaseLuring || 0) + '%' }"></div>
                </div>
                <span>{{ rpsData?.media?.presentaseLuring || 0 }}%</span>
              </div>
            </div>
            <div class="info-item">
              <label>Presentase Daring</label>
              <div class="percentage-display">
                <div class="percentage-bar">
                  <div class="percentage-fill daring" :style="{ width: (rpsData?.media?.presentaseDaring || 0) + '%' }"></div>
                </div>
                <span>{{ rpsData?.media?.presentaseDaring || 0 }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 9. Penilaian -->
        <div v-show="currentTab === 8" class="tab-content">
          <h3>9. Metode Penilaian</h3>
          <div class="view-table">
            <table>
              <thead>
                <tr>
                  <th width="20%">Basis Evaluasi</th>
                  <th width="25%">Komponen</th>
                  <th width="15%">Bobot (%)</th>
                  <th width="25%">CPMK Terkait</th>
                  <th width="15%">Bobot CPMK</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(penilaian, index) in rpsData?.penilaian" :key="index">
                  <td>
                    <span class="basis-badge" :class="penilaian.basisEvaluasi">
                      {{ formatBasisEvaluasi(penilaian.basisEvaluasi) }}
                    </span>
                  </td>
                  <td>{{ penilaian.komponen }}</td>
                  <td class="text-center">{{ penilaian.bobot }}%</td>
                  <td>{{ penilaian.cpmkTerkait }}</td>
                  <td class="text-center">{{ penilaian.bobotCPMK }}%</td>
                </tr>
                <tr v-if="!rpsData?.penilaian?.length">
                  <td colspan="5" class="no-data">Tidak ada data penilaian</td>
                </tr>
              </tbody>
            </table>
            <div v-if="rpsData?.penilaian?.length" class="total-bobot">
              Total Bobot: {{ totalBobotPenilaian }}%
            </div>
          </div>
        </div>

        <!-- 10. Referensi -->
        <div v-show="currentTab === 9" class="tab-content">
          <h3>10. Daftar Referensi</h3>
          <div class="view-table">
            <table>
              <thead>
                <tr>
                  <th width="5%">No</th>
                  <th width="45%">Judul</th>
                  <th width="30%">Pengarang</th>
                  <th width="20%">Tahun</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(referensi, index) in rpsData?.referensi" :key="index">
                  <td class="text-center">{{ index + 1 }}</td>
                  <td>{{ referensi.judul }}</td>
                  <td>{{ referensi.pengarang }}</td>
                  <td class="text-center">{{ referensi.tahun }}</td>
                </tr>
                <tr v-if="!rpsData?.referensi?.length">
                  <td colspan="4" class="no-data">Tidak ada data referensi</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 11. Dosen Pengampu -->
        <div v-show="currentTab === 10" class="tab-content">
          <h3>11. Dosen Pengampu</h3>
          <div class="view-table">
            <table>
              <thead>
                <tr>
                  <th width="40%">Nama Dosen</th>
                  <th width="20%">Gelar</th>
                  <th width="40%">Peran</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(dosen, index) in rpsData?.dosen" :key="index">
                  <td>{{ dosen.nama }}</td>
                  <td>{{ dosen.gelar }}</td>
                  <td>
                    <span class="peran-badge" :class="dosen.peran">
                      {{ dosen.peran === 'utama' ? 'Pengampu Utama' : 'Team Teaching' }}
                    </span>
                  </td>
                </tr>
                <tr v-if="!rpsData?.dosen?.length">
                  <td colspan="3" class="no-data">Tidak ada data dosen</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 12. Otorisasi -->
        <div v-show="currentTab === 11" class="tab-content">
          <h3>12. Otorisasi</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Tanggal Penyusunan</label>
              <span>{{ formatDate(rpsData?.otorisasi?.tanggal) || '-' }}</span>
            </div>
            <div class="info-item">
              <label>Koordinator Mata Kuliah</label>
              <span>{{ rpsData?.otorisasi?.koordinatorMK || '-' }}</span>
            </div>
            <div class="info-item">
              <label>Koordinator Bidang Keahlian</label>
              <span>{{ rpsData?.otorisasi?.koordinatorKeahlian || '-' }}</span>
            </div>
            <div class="info-item">
              <label>Ketua Program Studi</label>
              <span>{{ rpsData?.otorisasi?.kaprodi || '-' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button class="btn-secondary" @click="closeModal">Tutup</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { X, CheckCircle } from 'lucide-vue-next'

interface RPSData {
  identitas: {
    kodeMK: string
    namaMK: string
    sksTeori: number
    sksPraktik: number
    status: string
    prasyarat: string
  }
  deskripsi: string
  cpl: Array<{ kode: string; deskripsi: string }>
  cpmk: Array<{ kode: string; deskripsi: string }>
  materi: Array<{ kodeCPMK: string; judul: string; bentuk: string; waktu: string }>
  metode: {
    diskusi: boolean
    project: boolean
    roleplay: boolean
    lainnya: { enabled: boolean; value: string }
  }
  pengalamanBelajar: string
  media: {
    linkLMS: string
    presentaseLuring: number
    presentaseDaring: number
  }
  penilaian: Array<{
    basisEvaluasi: string
    komponen: string
    bobot: number
    cpmkTerkait: string
    bobotCPMK: number
  }>
  referensi: Array<{ judul: string; pengarang: string; tahun: string }>
  dosen: Array<{ nama: string; gelar: string; peran: string }>
  otorisasi: {
    tanggal: string
    koordinatorMK: string
    koordinatorKeahlian: string
    kaprodi: string
  }
}

interface Props {
  show: boolean
  rpsData: RPSData | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const currentTab = ref(0)

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

const hasAnyMetode = computed(() => {
  const metode = props.rpsData?.metode
  return metode?.diskusi || metode?.project || metode?.roleplay || (metode?.lainnya?.enabled && metode?.lainnya?.value)
})

const totalBobotPenilaian = computed(() => {
  return props.rpsData?.penilaian?.reduce((total, item) => total + item.bobot, 0) || 0
})

const closeModal = () => {
  emit('close')
}

const formatBasisEvaluasi = (basis: string) => {
  const map: Record<string, string> = {
    'aktivitas': 'Aktivitas Partisipatif',
    'project': 'Hasil Project/Studi Kasus',
    'kognitif': 'Kognitif'
  }
  return map[basis] || basis
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.show) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: var(--oba-white);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Modal Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid var(--oba-border);
  flex-shrink: 0;
}

.modal-title h2 {
  margin: 0;
  color: var(--oba-text);
  font-size: 1.5rem;
  font-weight: 700;
}

.modal-subtitle {
  margin: 4px 0 0 0;
  color: var(--oba-text-light);
  font-size: 0.875rem;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  color: var(--oba-text-light);
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--oba-surface);
  color: var(--oba-text);
}

/* Modal Tabs */
.modal-tabs {
  display: flex;
  overflow-x: auto;
  padding: 0 24px;
  border-bottom: 1px solid var(--oba-border);
  flex-shrink: 0;
  gap: 4px;
}

.tab-btn {
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--oba-text-light);
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.tab-btn:hover {
  color: var(--oba-text);
  background: var(--oba-surface);
}

.tab-btn.active {
  color: var(--oba-primary);
  border-bottom-color: var(--oba-primary);
  background: rgba(30, 64, 175, 0.05);
}

/* Modal Body */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.tab-content h3 {
  margin: 0 0 20px 0;
  color: var(--oba-primary);
  font-size: 1.25rem;
  font-weight: 600;
  border-bottom: 2px solid var(--oba-primary);
  padding-bottom: 8px;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item label {
  font-weight: 600;
  color: var(--oba-text);
  font-size: 0.875rem;
}

.info-item span {
  color: var(--oba-text-light);
  font-size: 0.95rem;
}

.link {
  color: var(--oba-primary);
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

/* Description Content */
.description-content {
  background: var(--oba-surface);
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid var(--oba-primary);
}

.description-content p {
  margin: 0;
  line-height: 1.6;
  color: var(--oba-text);
}

/* Status and Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.wajib {
  background: #dcfce7;
  color: #166534;
}

.status-badge.pilihan {
  background: #dbeafe;
  color: #1e40af;
}

.bentuk-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.bentuk-badge.luring {
  background: #f3f4f6;
  color: #374151;
}

.bentuk-badge.daring {
  background: #e0f2fe;
  color: #0277bd;
}

.basis-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.basis-badge.aktivitas {
  background: #fff3cd;
  color: #856404;
}

.basis-badge.project {
  background: #d1ecf1;
  color: #0c5460;
}

.basis-badge.kognitif {
  background: #e2e3ff;
  color: #3730a3;
}

.peran-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.peran-badge.utama {
  background: #dcfce7;
  color: #166534;
}

.peran-badge.team {
  background: #fef3c7;
  color: #92400e;
}

/* Metode List */
.metode-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metode-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--oba-surface);
  border-radius: 8px;
  border-left: 4px solid #22c55e;
}

.check-icon {
  color: #22c55e;
  flex-shrink: 0;
}

/* Percentage Display */
.percentage-display {
  display: flex;
  align-items: center;
  gap: 12px;
}

.percentage-bar {
  flex: 1;
  height: 8px;
  background: var(--oba-border);
  border-radius: 4px;
  overflow: hidden;
}

.percentage-fill {
  height: 100%;
  background: var(--oba-primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.percentage-fill.daring {
  background: #059669;
}

/* View Table */
.view-table {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--oba-border);
}

.view-table table {
  width: 100%;
  border-collapse: collapse;
}

.view-table th {
  background: var(--oba-primary);
  color: var(--oba-white);
  padding: 12px;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
}

.view-table td {
  padding: 12px;
  border-bottom: 1px solid var(--oba-border);
  color: var(--oba-text);
  font-size: 0.875rem;
}

.view-table tr:last-child td {
  border-bottom: none;
}

.view-table tr:nth-child(even) {
  background: rgba(30, 64, 175, 0.02);
}

.text-center {
  text-align: center;
}

.no-data {
  text-align: center;
  color: var(--oba-text-light);
  font-style: italic;
  padding: 20px !important;
}

.total-bobot {
  padding: 12px;
  background: var(--oba-surface);
  border-top: 1px solid var(--oba-border);
  font-weight: 600;
  color: var(--oba-text);
  text-align: right;
}

/* Modal Footer */
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--oba-border);
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

.btn-secondary {
  background: var(--oba-surface);
  color: var(--oba-text);
  border: 1px solid var(--oba-border);
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--oba-border);
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }

  .modal-container {
    max-height: 95vh;
  }

  .modal-header {
    padding: 16px;
  }

  .modal-tabs {
    padding: 0 16px;
  }

  .modal-body {
    padding: 16px;
  }

  .modal-footer {
    padding: 12px 16px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .tab-btn {
    padding: 10px 12px;
    font-size: 0.8rem;
  }

  .modal-title h2 {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .modal-tabs {
    gap: 0;
  }

  .tab-btn {
    padding: 8px 10px;
    font-size: 0.75rem;
  }

  .view-table {
    font-size: 0.75rem;
  }

  .view-table th,
  .view-table td {
    padding: 8px;
  }
}
</style>