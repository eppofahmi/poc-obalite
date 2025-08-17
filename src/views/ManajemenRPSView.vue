<template>
  <div class="manajemen-rps">
    <h1>Manajemen RPS</h1>
    <p>Kelola Rencana Pembelajaran Semester (RPS) Anda di sini.</p>
    
    <div class="actions">
      <button class="btn-primary">Tambah RPS Baru</button>
    </div>

    <div class="rps-table">
      <table>
        <thead>
          <tr>
            <th>Mata Kuliah</th>
            <th>Semester</th>
            <th>SKS</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rps in rpsList" :key="rps.id">
            <td>{{ rps.mataKuliah }}</td>
            <td>{{ rps.semester }}</td>
            <td>{{ rps.sks }}</td>
            <td>
              <span :class="['status', rps.status.toLowerCase()]">
                {{ rps.status }}
              </span>
            </td>
            <td>
              <button class="btn-edit">Edit</button>
              <button class="btn-delete">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface RPS {
  id: number
  mataKuliah: string
  semester: string
  sks: number
  status: string
}

const rpsList = ref<RPS[]>([
  { id: 1, mataKuliah: 'Pemrograman Web', semester: 'Ganjil 2024/2025', sks: 3, status: 'Aktif' },
  { id: 2, mataKuliah: 'Basis Data', semester: 'Ganjil 2024/2025', sks: 3, status: 'Draft' },
  { id: 3, mataKuliah: 'Algoritma dan Struktur Data', semester: 'Genap 2024/2025', sks: 4, status: 'Aktif' },
])
</script>

<style scoped>
.manajemen-rps {
  padding: 24px;
}

.manajemen-rps h1 {
  color: #374151;
  margin-bottom: 16px;
}

.manajemen-rps p {
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

.rps-table {
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

.status.draft {
  background-color: #fef3c7;
  color: #92400e;
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

.btn-edit:hover {
  background-color: #2563eb;
}

.btn-delete {
  background-color: #dc2626;
  color: white;
}

.btn-delete:hover {
  background-color: #b91c1c;
}
</style>