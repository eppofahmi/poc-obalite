<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Logo and Brand -->
      <div class="login-header">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/LOGO_UNU_YOGYAKARTA.png/500px-LOGO_UNU_YOGYAKARTA.png" alt="UNU Yogyakarta" class="logo">
        <div class="brand-text">
          <h1>OBA System</h1>
          <p>Outcome-Based Assessment</p>
        </div>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email Address</label>
          <div class="input-wrapper">
            <Mail :size="20" class="input-icon" />
            <input
              id="email"
              v-model="loginForm.email"
              type="email"
              required
              class="form-input"
              placeholder="Enter your email"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <Lock :size="20" class="input-icon" />
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              required
              class="form-input"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <button type="submit" class="login-btn" :disabled="isLoading">
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>

        <div v-if="error" class="error-message">
          <AlertCircle :size="16" />
          {{ error }}
        </div>
      </form>

      <!-- Demo Accounts -->
      <div class="demo-section">
        <div class="divider">
          <span>Demo Accounts</span>
        </div>
        
        <div class="demo-buttons">
          <button type="button" @click="fillAdmin" class="demo-btn admin">
            <ShieldCheck :size="18" />
            <div>
              <span class="role">Administrator</span>
              <span class="email">admin@unu.ac.id</span>
            </div>
          </button>
          
          <button type="button" @click="fillDosen" class="demo-btn dosen">
            <GraduationCap :size="18" />
            <div>
              <span class="role">Lecturer</span>
              <span class="email">ahmad.susanto@unu.ac.id</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useNotifications } from '../composables/useNotifications'
import { Mail, Lock, AlertCircle, ShieldCheck, GraduationCap } from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()
const { showSuccess, showError } = useNotifications()

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
      showSuccess('Login berhasil! Selamat datang di OBA System')
      router.push('/dashboard')
    } else {
      error.value = 'Invalid email or password'
      showError('Email atau password tidak valid')
    }
  } catch (err) {
    error.value = 'An error occurred during login'
    showError('Terjadi kesalahan saat login')
  } finally {
    isLoading.value = false
  }
}

const fillAdmin = () => {
  loginForm.value.email = 'admin@unu.ac.id'
  loginForm.value.password = 'admin123'
}

const fillDosen = () => {
  loginForm.value.email = 'ahmad.susanto@unu.ac.id'
  loginForm.value.password = 'dosen123'
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
  padding: 1.5rem;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 420px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Logo and Brand Header */
.login-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.logo {
  height: 45px;
  width: auto;
}

.brand-text h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e40af;
  margin: 0;
}

.brand-text p {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
}

/* Form Styling */
.login-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #6b7280;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 0.875rem 0.875rem 0.875rem 2.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.8);
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  background: rgba(255, 255, 255, 1);
}

.form-input::placeholder {
  color: #9ca3af;
}

/* Login Button */
.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
}

.login-btn:active {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Loading Spinner */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error Message */
.error-message {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.2);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Demo Section */
.demo-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.25rem;
  margin-top: 1.25rem;
}

.divider {
  position: relative;
  text-align: center;
  margin-bottom: 1rem;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  background: rgba(255, 255, 255, 0.95);
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.demo-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.demo-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
}

.demo-btn:hover {
  border-color: #3b82f6;
  background: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.demo-btn.admin:hover {
  border-color: #dc2626;
}

.demo-btn.dosen:hover {
  border-color: #059669;
}

.demo-btn div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.demo-btn .role {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.demo-btn .email {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem 1.25rem;
    margin: 1rem;
    max-width: 95vw;
  }
  
  .login-header {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }
  
  .brand-text {
    text-align: center;
  }
  
  .logo {
    height: 40px;
  }
  
  .brand-text h1 {
    font-size: 1.25rem;
  }
}
</style>