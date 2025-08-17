# API Documentation for Obalite Application

## Overview
This document serves as the API contract specification for the backend implementation of the Obalite (Academic Management System) application. All endpoints should implement these exact interfaces for seamless frontend integration.

## Base Configuration
- **Base URL**: `https://api.obalite.unu.ac.id/v1`
- **Authentication**: JWT Bearer Token
- **Content-Type**: `application/json`
- **Response Format**: All responses follow the standardized `ApiResponse<T>` or `PaginatedResponse<T>` structure

## Authentication Flow

### POST /auth/login
Authenticate user and return JWT token.

**Request Body:**
```typescript
{
  email: string
  password: string
}
```

**Response:**
```typescript
{
  success: boolean
  message: string
  data: {
    user: User
    token: string
    refreshToken: string
    expiresIn: number // seconds
  }
  timestamp: string
}
```

**Curl Example:**
```bash
curl -X POST https://api.obalite.unu.ac.id/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dosen@unu.ac.id",
    "password": "password123"
  }'
```

### GET /auth/profile
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```typescript
{
  success: boolean
  message: string
  data: User
  timestamp: string
}
```

## Mata Kuliah Management

### GET /mata-kuliah
Get paginated list of mata kuliah with filtering support.

**Query Parameters:**
- `search` (string, optional): Search in nama and kode
- `status` (string, optional): Filter by status ('Aktif', 'Persiapan', 'Nonaktif')
- `semester` (string, optional): Filter by semester
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `sortBy` (string, optional): Sort field
- `sortOrder` ('asc'|'desc', optional): Sort direction

**Response:**
```typescript
{
  success: boolean
  message: string
  data: MataKuliah[]
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
```

**Curl Example:**
```bash
curl -X GET "https://api.obalite.unu.ac.id/v1/mata-kuliah?page=1&limit=10&status=Aktif" \
  -H "Authorization: Bearer {jwt_token}"
```

### POST /mata-kuliah
Create new mata kuliah.

**Request Body:**
```typescript
{
  kode: string
  nama: string
  sks: number
  semester: string
  deskripsi?: string
}
```

### PUT /mata-kuliah/:id
Update existing mata kuliah.

### DELETE /mata-kuliah/:id
Delete mata kuliah by ID.

## RPS Management

### GET /rps
Get paginated list of RPS with filtering.

**Query Parameters:** Similar to mata-kuliah endpoint

**Response:**
```typescript
{
  success: boolean
  message: string
  data: RPS[]
  pagination: PaginationInfo
  timestamp: string
}
```

### POST /rps
Create new RPS.

**Request Body:**
```typescript
{
  mataKuliahId: string
  semester: string
  content?: {
    cplProdi: string[]
    cplMataKuliah: string[]
    pertemuanList: RPSPertemuan[]
  }
}
```

## Soal Management

### GET /soal
Get paginated list of soal with filtering.

**Query Parameters:**
- `search`: Search in pertanyaan and mataKuliah
- `jenis`: Filter by question type
- `tingkatKesulitan`: Filter by difficulty level
- `mataKuliahId`: Filter by mata kuliah
- Standard pagination parameters

### POST /soal
Create new soal.

**Request Body:**
```typescript
{
  mataKuliahId: string
  pertanyaan: string
  jenis: 'Pilihan Ganda' | 'Essay' | 'Praktik' | 'True/False'
  tingkatKesulitan: 'Mudah' | 'Sedang' | 'Sulit'
  pilihan?: string[] // Required for multiple choice
  jawabanBenar?: number | string
  poin: number
  kategori?: string
  tags?: string[]
}
```

## Portofolio Management

### GET /portofolio/publikasi
Get all publikasi for current user.

### GET /portofolio/penelitian
Get all penelitian for current user.

### GET /portofolio/pengabdian
Get all pengabdian for current user.

### POST /portofolio/publikasi
Create new publikasi.

## Dashboard Statistics

### GET /dashboard/stats
Get dashboard statistics based on user role.

**Response for Admin:**
```typescript
{
  success: boolean
  message: string
  data: {
    totalDosen: number
    totalMataKuliah: number
    totalRPS: number
    totalSoal: number
    rpsPerStatus: Record<string, number>
    aktivitasTerkini: AktivitasLog[]
  }
  timestamp: string
}
```

**Response for Dosen:**
```typescript
{
  success: boolean
  message: string
  data: {
    totalMataKuliah: number
    totalSoal: number
    totalPortofolio: number
    rpsProgress: number
    mataKuliahAktif: MataKuliah[]
    deadlineTerdekat: Deadline[]
  }
  timestamp: string
}
```

## Error Handling

All endpoints should return consistent error responses:

```typescript
{
  success: false
  message: string // User-friendly error message
  errors?: string[] // Detailed error list (validation errors)
  timestamp: string
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `422` - Unprocessable Entity (business logic errors)
- `500` - Internal Server Error

## Data Models

### User
```typescript
interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'dosen'
  avatar?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}
```

### MataKuliah
```typescript
interface MataKuliah {
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
```

### RPS
```typescript
interface RPS {
  id: string
  mataKuliahId: string
  mataKuliah: string // Populated from MataKuliah
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
```

### Soal
```typescript
interface Soal {
  id: string
  mataKuliahId: string
  mataKuliah: string // Populated from MataKuliah
  pertanyaan: string
  jenis: 'Pilihan Ganda' | 'Essay' | 'Praktik' | 'True/False'
  tingkatKesulitan: 'Mudah' | 'Sedang' | 'Sulit'
  pilihan?: string[]
  jawabanBenar?: number | string
  poin: number
  kategori?: string
  tags?: string[]
  dosenId: string
  createdAt: string
  updatedAt: string
}
```

## Sample Data

All sample data is available in JSON format in the `/src/data/` directory:

- `users.json` - Sample users and mock credentials
- `mata-kuliah.json` - Sample courses with detailed information
- `rps.json` - Sample learning plans with content structure
- `soal.json` - Sample questions with various types and difficulties
- `portofolio.json` - Sample portfolio items (publikasi, penelitian, pengabdian)

## Frontend Integration

The frontend uses these TypeScript interfaces and API service functions:

```typescript
import { mataKuliahApi } from './services/api'
import type { MataKuliah, FilterParams } from './types/api'

// Example usage
const fetchMataKuliah = async (filters: FilterParams) => {
  try {
    const response = await mataKuliahApi.getAll(filters)
    return response.data // MataKuliah[]
  } catch (error) {
    // Handle API error
  }
}
```

## Security Requirements

1. **JWT Authentication**: All protected endpoints require valid JWT token
2. **Role-based Access**: Implement proper role checking for admin/dosen resources
3. **Input Validation**: Validate all input data against the TypeScript interfaces
4. **Rate Limiting**: Implement appropriate rate limiting for API endpoints
5. **CORS Configuration**: Configure CORS for the frontend domain

## Performance Considerations

1. **Pagination**: All list endpoints should support pagination
2. **Database Indexing**: Index frequently queried fields (email, status, semester)
3. **Response Compression**: Enable gzip compression for API responses
4. **Caching**: Consider caching for dashboard statistics and reference data

---

**Note for Backend Developers**: This documentation reflects the exact contract expected by the frontend application. Any deviations from these interfaces will require corresponding frontend updates.