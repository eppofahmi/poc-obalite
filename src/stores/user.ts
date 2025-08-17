import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi, ApiError } from '../services/api'
import type { User, LoginRequest } from '../types/api'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const login = async (email: string, password: string): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const loginRequest: LoginRequest = { email, password }
      const response = await authApi.login(loginRequest)
      
      user.value = response.data.user
      isAuthenticated.value = true
      
      // Store auth data (in production, consider more secure storage)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = null

    try {
      // Call logout API (optional - token will expire anyway)
      await authApi.logout()
    } catch (err) {
      // Even if logout API fails, we should still clear local storage
      console.warn('Logout API call failed:', err)
    } finally {
      // Clear local state and storage
      user.value = null
      isAuthenticated.value = false
      loading.value = false
      
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
  }

  const refreshProfile = async () => {
    if (!isAuthenticated.value) return

    try {
      const response = await authApi.getProfile()
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to refresh profile'
      // If profile refresh fails, user might need to login again
      if (err instanceof ApiError && err.statusCode === 401) {
        logout()
      }
    }
  }

  const initializeAuth = () => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    
    if (savedUser && savedToken) {
      try {
        user.value = JSON.parse(savedUser)
        isAuthenticated.value = true
        
        // Optionally refresh profile to ensure data is current
        // refreshProfile()
      } catch {
        // If parsing fails, clear everything
        logout()
      }
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    
    // Actions
    login,
    logout,
    refreshProfile,
    initializeAuth,
    clearError
  }
})