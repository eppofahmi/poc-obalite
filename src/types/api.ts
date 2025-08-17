// ==============================
// API CONTRACT SPECIFICATION
// ==============================
// This file serves as the contract between frontend and backend
// Backend developers should implement APIs matching these interfaces

// Base Response Structure
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  errors?: string[]
  timestamp: string
}

export interface PaginatedResponse<T = any> {
  success: boolean
  message: string
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNext: boolean
    hasPrevious: boolean
  }
  timestamp: string
}

// Authentication & User Management
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'dosen'
  avatar?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    user: User
    token: string
    refreshToken: string
    expiresIn: number
  }
  timestamp: string
}

// Mata Kuliah (Course) Management
export interface MataKuliah {
  id: string
  kode: string
  nama: string
  sks: number
  semester: string
  status: 'Aktif' | 'Persiapan' | 'Nonaktif'
  jumlahMahasiswa: number
  deskripsi?: string
  dosenId: string
  createdAt: string
  updatedAt: string
}

export interface CreateMataKuliahRequest {
  kode: string
  nama: string
  sks: number
  semester: string
  deskripsi?: string
}

export interface UpdateMataKuliahRequest {
  kode?: string
  nama?: string
  sks?: number
  semester?: string
  status?: 'Aktif' | 'Persiapan' | 'Nonaktif'
  deskripsi?: string
}

// RPS (Learning Plan) Management
export interface RPS {
  id: string
  mataKuliahId: string
  mataKuliah: string // Populated field
  semester: string
  sks: number
  status: 'Aktif' | 'Draft' | 'Review' | 'Approved'
  dosenId: string
  content?: {
    cplProdi: string[]
    cplMataKuliah: string[]
    pertemuanList: RPSPertemuan[]
  }
  createdAt: string
  updatedAt: string
}

export interface RPSPertemuan {
  mingguKe: number
  materi: string
  metode: string
  waktu: number
  pengalaman: string
  kriteria: string
  bobot: number
}

export interface CreateRPSRequest {
  mataKuliahId: string
  semester: string
  content?: {
    cplProdi: string[]
    cplMataKuliah: string[]
    pertemuanList: RPSPertemuan[]
  }
}

// Soal (Question) Management
export interface Soal {
  id: string
  mataKuliahId: string
  mataKuliah: string // Populated field
  pertanyaan: string
  jenis: 'Pilihan Ganda' | 'Essay' | 'Praktik' | 'True/False'
  tingkatKesulitan: 'Mudah' | 'Sedang' | 'Sulit'
  pilihan?: string[] // For multiple choice
  jawabanBenar?: number | string // Index for MC, text for others
  poin: number
  kategori?: string
  tags?: string[]
  dosenId: string
  createdAt: string
  updatedAt: string
}

export interface CreateSoalRequest {
  mataKuliahId: string
  pertanyaan: string
  jenis: 'Pilihan Ganda' | 'Essay' | 'Praktik' | 'True/False'
  tingkatKesulitan: 'Mudah' | 'Sedang' | 'Sulit'
  pilihan?: string[]
  jawabanBenar?: number | string
  poin: number
  kategori?: string
  tags?: string[]
}

// Portofolio (Portfolio) Management
export interface Publikasi {
  id: string
  judul: string
  jurnal: string
  tahun: number
  penulis: string[]
  status: 'Published' | 'Submitted' | 'Under Review' | 'Draft'
  doi?: string
  url?: string
  abstrak?: string
  keywords?: string[]
  dosenId: string
  createdAt: string
  updatedAt: string
}

export interface Penelitian {
  id: string
  judul: string
  jenis: 'Fundamental' | 'Terapan' | 'Pengembangan'
  tahunMulai: number
  tahunSelesai?: number
  status: 'Berjalan' | 'Selesai' | 'Ditunda' | 'Dibatalkan'
  sumberDana: string
  jumlahDana?: number
  abstrak?: string
  keywords?: string[]
  timPeneliti: string[]
  dosenId: string
  createdAt: string
  updatedAt: string
}

export interface Pengabdian {
  id: string
  judul: string
  lokasi: string
  tahun: number
  jumlahPeserta: number
  status: 'Selesai' | 'Berjalan' | 'Direncanakan'
  deskripsi?: string
  mitra?: string
  timPelaksana: string[]
  dosenId: string
  createdAt: string
  updatedAt: string
}

// Dashboard Statistics
export interface DashboardStats {
  admin: {
    totalDosen: number
    totalMataKuliah: number
    totalRPS: number
    totalSoal: number
    rpsPerStatus: Record<string, number>
    aktivitasTerkini: AktivitasLog[]
  }
  dosen: {
    totalMataKuliah: number
    totalSoal: number
    totalPortofolio: number
    rpsProgress: number
    mataKuliahAktif: MataKuliah[]
    deadlineTerdekat: Deadline[]
  }
}

export interface AktivitasLog {
  id: string
  user: string
  action: string
  resource: string
  timestamp: string
}

export interface Deadline {
  id: string
  title: string
  type: 'RPS' | 'Soal' | 'Penilaian'
  dueDate: string
  priority: 'High' | 'Medium' | 'Low'
}

// Filter and Search Parameters
export interface FilterParams {
  search?: string
  status?: string
  semester?: string
  jenis?: string
  tingkatKesulitan?: string
  tahun?: number
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// File Upload
export interface FileUpload {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedBy: string
  createdAt: string
}

export interface UploadResponse {
  success: boolean
  message: string
  data: FileUpload
  timestamp: string
}

// Export/Import
export interface ExportRequest {
  format: 'excel' | 'pdf' | 'csv'
  type: 'mata-kuliah' | 'rps' | 'soal' | 'portofolio'
  filters?: FilterParams
}

export interface ImportRequest {
  file: File
  type: 'mata-kuliah' | 'soal'
  options?: {
    skipDuplicates?: boolean
    validateOnly?: boolean
  }
}