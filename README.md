# OBA System - UNU Yogyakarta

**Outcome-Based Assessment System** - A comprehensive web application for managing educational assessments, course management, and academic portfolios at Universitas Nahdlatul Ulama Yogyakarta.

## 🎯 Features

### 👨‍💼 Administrator Dashboard
- **Dashboard Overview**: System statistics and recent activities
- **RPS Management**: Create and manage Rencana Pembelajaran Semester (Course Learning Plans)
- **Course Monitoring**: Track assessment progress across all courses
- **System Administration**: User management and system settings

### 👨‍🏫 Lecturer Dashboard
- **Personal Dashboard**: Course overview with progress tracking
- **Course Management**: Manage assigned courses and student data
- **Question Bank**: Create and organize assessment questions
- **Portfolio Generation**: Academic portfolio management and reporting
- **Assessment Tools**: Track and manage student assessments

## 🔐 Authentication & Roles

The system supports role-based access control with two main user types:

### Demo Accounts
- **Administrator**: `admin@example.com` / `admin123`
- **Lecturer**: `dosen@example.com` / `dosen123`

## 🛠️ Tech Stack

- **Frontend**: Vue 3 with Composition API
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: Vue Router
- **State Management**: Pinia
- **Icons**: Lucide Vue
- **Styling**: CSS3 with scoped components
- **Fonts**: Inter (Google Fonts)

## 🏗️ Architecture

```
src/
├── components/          # Reusable Vue components
│   ├── AppHeader.vue   # Main navigation header
│   └── AppSidebar.vue  # Role-based sidebar navigation
├── views/              # Page-level components
│   ├── LoginView.vue   # Authentication page
│   ├── DashboardView.vue # Role-based dashboard
│   ├── ManajemenRPSView.vue # RPS management (Admin)
│   ├── ManajemenMataKuliahView.vue # Course management (Lecturer)
│   ├── ManajemenSoalView.vue # Question bank (Lecturer)
│   └── PortofolioView.vue # Portfolio management (Lecturer)
├── stores/             # Pinia state management
│   └── user.ts        # User authentication & state
├── router/            # Vue Router configuration
│   └── index.ts       # Route definitions & guards
└── assets/            # Static assets & global styles
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd poc-obalite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Type checking and build for production
npm run build

# Code linting
npm run lint

# Type checking only
npm run type-check
```

## 🎨 Design System

The application follows UNU Yogyakarta's branding guidelines with:

- **Primary Colors**: Blue (#1e40af) for primary actions and navigation
- **Typography**: Inter font family for clean, modern readability
- **Icons**: Lucide icons for consistent, scalable vector graphics
- **Layout**: Responsive design with fixed header and sidebar navigation
- **Spacing**: Consistent spacing scale using CSS custom properties

## 🔒 Security Features

- **Route Guards**: Protected routes based on authentication status
- **Role-Based Access**: Different interfaces for Admin vs Lecturer roles
- **Session Management**: Persistent login with localStorage
- **Input Validation**: Form validation and sanitization

## 📱 Responsive Design

The application is designed to work across different screen sizes:
- **Desktop**: Full sidebar and header layout
- **Tablet**: Optimized spacing and component sizing
- **Mobile**: Responsive breakpoints (future enhancement)

## 🚦 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow Vue 3 Composition API patterns
- Implement scoped CSS for component styling
- Use Pinia for state management
- Maintain consistent naming conventions

### Component Structure
```vue
<template>
  <!-- Template with semantic HTML -->
</template>

<script setup lang="ts">
// Composition API with TypeScript
</script>

<style scoped>
/* Scoped component styles */
</style>
```

## 📄 License

This project is proprietary software developed for Universitas Nahdlatul Ulama Yogyakarta.

## 🤝 Contributing

This is an internal project. For development questions or contributions, please contact the development team.

---

**Universitas Nahdlatul Ulama Yogyakarta**  
*Outcome-Based Assessment System*
