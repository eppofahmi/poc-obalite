// ==============================
// API SERVICE LAYER
// ==============================
// This file provides a service layer that simulates real API calls
// Backend developers can reference this for endpoint specifications

import type { 
  ApiResponse, 
  PaginatedResponse,
  LoginRequest, 
  LoginResponse,
  User,
  MataKuliah,
  CreateMataKuliahRequest,
  UpdateMataKuliahRequest,
  RPS,
  Soal,
  CreateSoalRequest,
  Publikasi,
  Penelitian,
  Pengabdian,
  DashboardStats,
  FilterParams
} from '../types/api'

// Import JSON data (in real app, this would be API endpoints)
import usersData from '../data/users.json'
import mataKuliahData from '../data/mata-kuliah.json'
import rpsData from '../data/rps.json'
import soalData from '../data/soal.json' 
import portofolioData from '../data/portofolio.json'

// Simulate API delay for realistic demo
const simulateDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms))

// ==============================
// AUTHENTICATION API
// ==============================

export const authApi = {
  /**
   * POST /api/v1/auth/login
   * Authenticate user and return JWT token
   */
  async login(request: LoginRequest): Promise<LoginResponse> {
    await simulateDelay(1000) // Simulate network delay
    
    const userData = usersData.users.find(u => u.email === request.email)
    const validPassword = usersData.mockCredentials[request.email as keyof typeof usersData.mockCredentials]
    
    if (!userData || request.password !== validPassword) {
      throw new Error('Invalid email or password')
    }

    // Type-cast to match interface
    const user: User = {
      ...userData,
      role: userData.role as 'admin' | 'dosen',
      status: userData.status as 'active' | 'inactive'
    }

    const token = `jwt_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      success: true,
      message: 'Login successful',
      data: {
        user,
        token,
        refreshToken: `refresh_${token}`,
        expiresIn: 86400 // 24 hours
      },
      timestamp: new Date().toISOString()
    }
  },

  /**
   * POST /api/v1/auth/logout
   * Logout user and invalidate token
   */
  async logout(): Promise<ApiResponse> {
    await simulateDelay(500)
    
    return {
      success: true,
      message: 'Logout successful',
      data: null,
      timestamp: new Date().toISOString()
    }
  },

  /**
   * GET /api/v1/auth/profile
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    await simulateDelay(600)
    
    // In real app, this would decode JWT token
    const userData = usersData.users[1] // Simulate current user
    const user: User = {
      ...userData,
      role: userData.role as 'admin' | 'dosen',
      status: userData.status as 'active' | 'inactive'
    }
    
    return {
      success: true,
      message: 'Profile retrieved successfully',
      data: user,
      timestamp: new Date().toISOString()
    }
  }
}

// ==============================
// MATA KULIAH API
// ==============================

export const mataKuliahApi = {
  /**
   * GET /api/v1/mata-kuliah
   * Get paginated list of mata kuliah with filtering
   */
  async getAll(filters: FilterParams = {}): Promise<PaginatedResponse<MataKuliah>> {
    await simulateDelay()
    
    let data: MataKuliah[] = mataKuliahData.mataKuliah.map(mk => ({
      ...mk,
      status: mk.status as 'Aktif' | 'Persiapan' | 'Nonaktif'
    }))
    
    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase()
      data = data.filter(mk => 
        mk.nama.toLowerCase().includes(search) ||
        mk.kode.toLowerCase().includes(search)
      )
    }
    
    if (filters.status) {
      data = data.filter(mk => mk.status === filters.status)
    }
    
    if (filters.semester) {
      data = data.filter(mk => mk.semester === filters.semester)
    }
    
    // Apply sorting
    if (filters.sortBy) {
      data.sort((a, b) => {
        const aVal = a[filters.sortBy as keyof MataKuliah]
        const bVal = b[filters.sortBy as keyof MataKuliah]
        const order = filters.sortOrder === 'desc' ? -1 : 1
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return aVal.localeCompare(bVal) * order
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * order
        }
        return 0
      })
    }
    
    // Apply pagination
    const page = filters.page || 1
    const limit = filters.limit || 10
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedData = data.slice(start, end)
    
    return {
      success: true,
      message: 'Mata kuliah retrieved successfully',
      data: paginatedData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(data.length / limit),
        totalItems: data.length,
        itemsPerPage: limit,
        hasNext: end < data.length,
        hasPrevious: page > 1
      },
      timestamp: new Date().toISOString()
    }
  },

  /**
   * GET /api/v1/mata-kuliah/:id
   * Get single mata kuliah by ID
   */
  async getById(id: string): Promise<ApiResponse<MataKuliah>> {
    await simulateDelay(600)
    
    const mkData = mataKuliahData.mataKuliah.find(mk => mk.id === id)
    
    if (!mkData) {
      throw new Error('Mata kuliah not found')
    }

    const mataKuliah: MataKuliah = {
      ...mkData,
      status: mkData.status as 'Aktif' | 'Persiapan' | 'Nonaktif'
    }
    
    return {
      success: true,
      message: 'Mata kuliah retrieved successfully',
      data: mataKuliah,
      timestamp: new Date().toISOString()
    }
  },

  /**
   * POST /api/v1/mata-kuliah
   * Create new mata kuliah
   */
  async create(request: CreateMataKuliahRequest): Promise<ApiResponse<MataKuliah>> {
    await simulateDelay(1200)
    
    const newMataKuliah: MataKuliah = {
      id: `mk-${Date.now()}`,
      ...request,
      status: 'Persiapan',
      jumlahMahasiswa: 0,
      dosenId: 'user-002', // Current user ID in real app
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return {
      success: true,
      message: 'Mata kuliah created successfully',
      data: newMataKuliah,
      timestamp: new Date().toISOString()
    }
  },

  /**
   * PUT /api/v1/mata-kuliah/:id
   * Update existing mata kuliah
   */
  async update(id: string, request: UpdateMataKuliahRequest): Promise<ApiResponse<MataKuliah>> {
    await simulateDelay(1000)
    
    const existingData = mataKuliahData.mataKuliah.find(mk => mk.id === id)
    
    if (!existingData) {
      throw new Error('Mata kuliah not found')
    }
    
    const updatedMataKuliah: MataKuliah = {
      ...existingData,
      ...request,
      status: (request.status || existingData.status) as 'Aktif' | 'Persiapan' | 'Nonaktif',
      updatedAt: new Date().toISOString()
    }
    
    return {
      success: true,
      message: 'Mata kuliah updated successfully',
      data: updatedMataKuliah,
      timestamp: new Date().toISOString()
    }
  },

  /**
   * DELETE /api/v1/mata-kuliah/:id
   * Delete mata kuliah
   */
  async delete(id: string): Promise<ApiResponse> {
    await simulateDelay(800)
    
    const exists = mataKuliahData.mataKuliah.find(mk => mk.id === id)
    
    if (!exists) {
      throw new Error('Mata kuliah not found')
    }
    
    return {
      success: true,
      message: 'Mata kuliah deleted successfully',
      data: null,
      timestamp: new Date().toISOString()
    }
  }
}

// ==============================
// RPS API
// ==============================

export const rpsApi = {
  /**
   * GET /api/v1/rps
   * Get paginated list of RPS with filtering
   */
  async getAll(filters: FilterParams = {}): Promise<PaginatedResponse<RPS>> {
    await simulateDelay()
    
    let data: RPS[] = rpsData.rps.map(rps => ({
      ...rps,
      status: rps.status as 'Aktif' | 'Draft' | 'Review' | 'Approved'
    }))
    
    // Apply filters (similar to mataKuliahApi)
    if (filters.search) {
      const search = filters.search.toLowerCase()
      data = data.filter(rps => 
        rps.mataKuliah.toLowerCase().includes(search)
      )
    }
    
    if (filters.status) {
      data = data.filter(rps => rps.status === filters.status)
    }
    
    // Apply pagination
    const page = filters.page || 1
    const limit = filters.limit || 10
    const start = (page - 1) * limit
    const paginatedData = data.slice(start, start + limit)
    
    return {
      success: true,
      message: 'RPS retrieved successfully',
      data: paginatedData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(data.length / limit),
        totalItems: data.length,
        itemsPerPage: limit,
        hasNext: start + limit < data.length,
        hasPrevious: page > 1
      },
      timestamp: new Date().toISOString()
    }
  }
}

// ==============================
// SOAL API  
// ==============================

export const soalApi = {
  /**
   * GET /api/v1/soal
   * Get paginated list of soal with filtering
   */
  async getAll(filters: FilterParams = {}): Promise<PaginatedResponse<Soal>> {
    await simulateDelay()
    
    let data: Soal[] = soalData.soal.map(soal => ({
      ...soal,
      jenis: soal.jenis as 'Pilihan Ganda' | 'Essay' | 'Praktik' | 'True/False',
      tingkatKesulitan: soal.tingkatKesulitan as 'Mudah' | 'Sedang' | 'Sulit'
    }))
    
    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase()
      data = data.filter(soal => 
        soal.pertanyaan.toLowerCase().includes(search) ||
        soal.mataKuliah.toLowerCase().includes(search)
      )
    }
    
    if (filters.jenis) {
      data = data.filter(soal => soal.jenis === filters.jenis)
    }
    
    if (filters.tingkatKesulitan) {
      data = data.filter(soal => soal.tingkatKesulitan === filters.tingkatKesulitan)
    }
    
    // Apply pagination
    const page = filters.page || 1
    const limit = filters.limit || 10
    const start = (page - 1) * limit
    const paginatedData = data.slice(start, start + limit)
    
    return {
      success: true,
      message: 'Soal retrieved successfully',
      data: paginatedData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(data.length / limit),
        totalItems: data.length,
        itemsPerPage: limit,
        hasNext: start + limit < data.length,
        hasPrevious: page > 1
      },
      timestamp: new Date().toISOString()
    }
  },

  /**
   * POST /api/v1/soal
   * Create new soal
   */
  async create(request: CreateSoalRequest): Promise<ApiResponse<Soal>> {
    await simulateDelay(1200)
    
    // Get mata kuliah name from ID (in real app, this would be a join/populate)
    const mataKuliah = mataKuliahData.mataKuliah.find(mk => mk.id === request.mataKuliahId)
    
    const newSoal: Soal = {
      id: `soal-${Date.now()}`,
      ...request,
      mataKuliah: mataKuliah?.nama || 'Unknown',
      dosenId: 'user-002', // Current user ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return {
      success: true,
      message: 'Soal created successfully',
      data: newSoal,
      timestamp: new Date().toISOString()
    }
  }
}

// ==============================
// PORTOFOLIO API
// ==============================

export const portofolioApi = {
  /**
   * GET /api/v1/portofolio/publikasi
   * Get all publikasi for current user
   */
  async getPublikasi(): Promise<ApiResponse<Publikasi[]>> {
    await simulateDelay()
    
    const publikasi: Publikasi[] = portofolioData.publikasi.map(pub => ({
      ...pub,
      status: pub.status as 'Draft' | 'Published' | 'Submitted' | 'Under Review'
    }))

    return {
      success: true,
      message: 'Publikasi retrieved successfully',
      data: publikasi,
      timestamp: new Date().toISOString()
    }
  },

  /**
   * GET /api/v1/portofolio/penelitian
   * Get all penelitian for current user
   */
  async getPenelitian(): Promise<ApiResponse<Penelitian[]>> {
    await simulateDelay()
    
    const penelitian: Penelitian[] = portofolioData.penelitian.map(pen => ({
      ...pen,
      jenis: pen.jenis as 'Fundamental' | 'Terapan' | 'Pengembangan',
      status: pen.status as 'Berjalan' | 'Selesai' | 'Ditunda' | 'Dibatalkan'
    }))

    return {
      success: true,
      message: 'Penelitian retrieved successfully',
      data: penelitian,
      timestamp: new Date().toISOString()
    }
  },

  /**
   * GET /api/v1/portofolio/pengabdian
   * Get all pengabdian for current user
   */
  async getPengabdian(): Promise<ApiResponse<Pengabdian[]>> {
    await simulateDelay()
    
    const pengabdian: Pengabdian[] = portofolioData.pengabdian.map(peng => ({
      ...peng,
      status: peng.status as 'Berjalan' | 'Selesai' | 'Direncanakan'
    }))

    return {
      success: true,
      message: 'Pengabdian retrieved successfully',
      data: pengabdian,
      timestamp: new Date().toISOString()
    }
  }
}

// ==============================
// DASHBOARD API
// ==============================

export const dashboardApi = {
  /**
   * GET /api/v1/dashboard/stats
   * Get dashboard statistics based on user role
   */
  async getStats(role: 'admin' | 'dosen'): Promise<ApiResponse<DashboardStats[typeof role]>> {
    await simulateDelay(1200)
    
    if (role === 'admin') {
      const stats: DashboardStats['admin'] = {
        totalDosen: usersData.users.filter(u => u.role === 'dosen').length,
        totalMataKuliah: mataKuliahData.mataKuliah.length,
        totalRPS: rpsData.rps.length,
        totalSoal: soalData.soal.length,
        rpsPerStatus: {
          'Aktif': rpsData.rps.filter(r => r.status === 'Aktif').length,
          'Draft': rpsData.rps.filter(r => r.status === 'Draft').length,
          'Review': rpsData.rps.filter(r => r.status === 'Review').length
        },
        aktivitasTerkini: [
          {
            id: 'act-001',
            user: 'Dr. Ahmad Susanto',
            action: 'Updated RPS',
            resource: 'Pemrograman Web',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          }
        ]
      }
      
      return {
        success: true,
        message: 'Admin dashboard stats retrieved successfully',
        data: stats,
        timestamp: new Date().toISOString()
      }
    }
    
    const dosenStats: DashboardStats['dosen'] = {
      totalMataKuliah: 3,
      totalSoal: 4,
      totalPortofolio: 6,
      rpsProgress: 75,
      mataKuliahAktif: mataKuliahData.mataKuliah
        .filter(mk => mk.status === 'Aktif')
        .map(mk => ({ ...mk, status: mk.status as 'Aktif' | 'Persiapan' | 'Nonaktif' }))
        .slice(0, 3),
      deadlineTerdekat: [
        {
          id: 'deadline-001',
          title: 'Submit RPS Basis Data',
          type: 'RPS',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'High'
        }
      ]
    }
    
    return {
      success: true,
      message: 'Dosen dashboard stats retrieved successfully', 
      data: dosenStats,
      timestamp: new Date().toISOString()
    }
  }
}

// ==============================
// ERROR HANDLING UTILITY
// ==============================

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Generic error handler for API calls
 */
export const handleApiError = (error: unknown): never => {
  if (error instanceof ApiError) {
    throw error
  }
  
  // Network or other errors
  const errorObj = error as any
  throw new ApiError(
    errorObj?.message || 'An unexpected error occurred',
    errorObj?.status || 500,
    errorObj?.code || 'UNKNOWN_ERROR'
  )
}