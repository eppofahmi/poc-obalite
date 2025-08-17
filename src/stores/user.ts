import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  id: number
  email: string
  name: string
  role: 'admin' | 'dosen'
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  const mockUsers: Record<string, { password: string; user: User }> = {
    'admin@example.com': {
      password: 'admin123',
      user: {
        id: 1,
        email: 'admin@example.com',
        name: 'Administrator',
        role: 'admin'
      }
    },
    'dosen@example.com': {
      password: 'dosen123',
      user: {
        id: 2,
        email: 'dosen@example.com',
        name: 'Dr. John Doe',
        role: 'dosen'
      }
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = mockUsers[email]
        
        if (userData && userData.password === password) {
          user.value = userData.user
          isAuthenticated.value = true
          localStorage.setItem('user', JSON.stringify(userData.user))
          resolve(true)
        } else {
          resolve(false)
        }
      }, 1000)
    })
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('user')
  }

  const initializeAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
        isAuthenticated.value = true
      } catch (error) {
        logout()
      }
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    initializeAuth
  }
})