<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Login</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="loginForm.email"
            type="email"
            required
            class="form-input"
            placeholder="Masukkan email Anda"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            required
            class="form-input"
            placeholder="Masukkan password Anda"
          />
        </div>

        <button type="submit" class="login-btn" :disabled="isLoading">
          {{ isLoading ? 'Loading...' : 'Login' }}
        </button>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>

      <div class="demo-accounts">
        <p class="demo-title">Demo Accounts:</p>
        <div class="demo-account" @click="fillAdmin">
          <strong>Admin:</strong> admin@example.com / admin123
        </div>
        <div class="demo-account" @click="fillDosen">
          <strong>Dosen:</strong> dosen@example.com / dosen123
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const loginForm = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const success = await userStore.login(loginForm.value.email, loginForm.value.password)
    
    if (success) {
      router.push('/dashboard')
    } else {
      error.value = 'Email atau password salah'
    }
  } catch (err) {
    error.value = 'Terjadi kesalahan saat login'
  } finally {
    isLoading.value = false
  }
}

const fillAdmin = () => {
  loginForm.value.email = 'admin@example.com'
  loginForm.value.password = 'admin123'
}

const fillDosen = () => {
  loginForm.value.email = 'dosen@example.com'
  loginForm.value.password = 'dosen123'
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  color: #374151;
  margin-bottom: 32px;
  font-size: 2rem;
  font-weight: 600;
}

.login-form {
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.login-btn {
  width: 100%;
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #dc2626;
  text-align: center;
  margin-top: 16px;
  font-size: 0.875rem;
}

.demo-accounts {
  border-top: 1px solid #e5e7eb;
  padding-top: 24px;
}

.demo-title {
  color: #6b7280;
  margin-bottom: 12px;
  font-size: 0.875rem;
}

.demo-account {
  background-color: #f9fafb;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.875rem;
}

.demo-account:hover {
  background-color: #f3f4f6;
}
</style>