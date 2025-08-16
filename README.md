# OBA (Outcome-Based Assessment) System

A comprehensive academic assessment platform for UNU Yogyakarta built with Nuxt.js, designed to streamline the entire assessment workflow from course planning to portfolio generation.

## 🎯 Project Overview

The OBA System transforms traditional academic assessment processes by providing an integrated platform that handles:
- Course planning (RPS) creation and management
- Question bank development with CPMK alignment
- Automated grading and assessment tracking
- AI-enhanced portfolio generation
- Real-time progress monitoring

## 🏗️ Architecture

This project leverages Nuxt.js's powerful features for a modern, scalable web application:

```
nuxt.config.ts          # Nuxt configuration with TypeScript
├── pages/              # File-based routing
│   ├── admin/          # Admin dashboard and RPS management
│   └── lecturer/       # Lecturer dashboard and tools
├── components/         # Reusable Vue components
│   ├── ui/             # Base UI components
│   ├── forms/          # Form components
│   └── charts/         # Data visualization
├── composables/        # Vue composables for business logic
├── server/             # API routes (Nitro server)
├── middleware/         # Route protection and authentication
├── stores/             # Pinia state management
└── assets/             # Static assets and styles
```

## 👥 User Roles & Features

### Academic Admin
- **Dashboard**: System overview and statistics
- **Manajemen RPS**: Course syllabus creation and management
- Upload SIAKAD data files
- Monitor assessment completion
- Print question sets

### Lecturer
- **Dashboard**: Personal course overview
- **Manajemen Mata Kuliah**: Course and file management
- **Manajemen Soal**: Question bank creation
- **Penilaian**: Student grading interface
- **Portofolio**: Portfolio generation and self-evaluation

## 🚀 Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) - Universal Vue.js framework
- **UI Framework**: [Nuxt UI](https://ui.nuxt.com/) - Beautiful components built on Tailwind CSS
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Icons**: [Heroicons](https://heroicons.com/) via @nuxt/icon
- **State Management**: [Pinia](https://pinia.vuejs.org/) - Intuitive Vue.js store
- **Authentication**: [Nuxt Auth](https://auth.nuxtjs.org/) - Secure authentication
- **File Upload**: [Nuxt File Upload](https://github.com/nuxt-modules/file-upload) - File handling
- **PDF Generation**: [Puppeteer](https://pptr.dev/) for portfolio generation
- **Database**: [Prisma](https://prisma.io/) with PostgreSQL
- **TypeScript**: Full type safety throughout the application

## 📋 Key Features

### File Processing Pipeline
- SIAKAD Excel/CSV import and validation
- PDF attendance parsing
- Automated grade template processing
- Portfolio document generation (DOCX → PDF)

### Assessment Management
- CPMK-aligned question creation
- Automated weight validation
- Real-time grade calculations
- Progress tracking with visual indicators

### AI-Enhanced Features
- Historical performance analysis
- Automated action plan generation
- Quality assurance recommendations
- Pattern recognition for improvement suggestions

### Document Generation
- University-branded portfolio templates
- Multi-format export (Excel, PDF)
- Automated report compilation
- Self-evaluation integration

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/poc-obalite.git
cd poc-obalite

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database and configuration

# Setup database
pnpm db:migrate
pnpm db:seed

# Start development server
pnpm dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/oba_system"

# Authentication
AUTH_SECRET="your-secret-key"
AUTH_ORIGIN="http://localhost:3000"

# File Storage
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="10MB"

# AI Features (optional)
OPENAI_API_KEY="your-openai-key"
```

## 📁 Project Structure

```
├── app.vue                 # Root application component
├── nuxt.config.ts         # Nuxt configuration
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
├── server/
│   └── api/               # API endpoints
│       ├── auth/          # Authentication routes
│       ├── admin/         # Admin-specific APIs
│       └── lecturer/      # Lecturer-specific APIs
├── pages/
│   ├── login.vue          # Authentication page
│   ├── admin/
│   │   ├── index.vue      # Admin dashboard
│   │   └── rps/           # RPS management pages
│   └── lecturer/
│       ├── index.vue      # Lecturer dashboard
│       ├── courses/       # Course management
│       ├── questions/     # Question bank
│       ├── grading/       # Assessment grading
│       └── portfolio/     # Portfolio generation
├── components/
│   ├── AppHeader.vue      # Main navigation header
│   ├── AppSidebar.vue     # Role-based sidebar
│   ├── ui/                # Base UI components
│   └── modules/           # Feature-specific components
├── composables/
│   ├── useAuth.ts         # Authentication logic
│   ├── useUpload.ts       # File upload handling
│   └── useGrading.ts      # Grading calculations
├── stores/
│   ├── auth.ts            # Authentication state
│   ├── courses.ts         # Course data management
│   └── assessments.ts     # Assessment data
└── assets/
    ├── css/               # Global styles
    └── images/            # Static images and logos
```

## 🎨 Design System

The application follows UNU Yogyakarta's brand guidelines with:
- **Primary**: Blue (#1e40af) - University brand color
- **Secondary**: Green (#10b981) - Success and completion
- **Warning**: Orange (#f59e0b) - Alerts and pending states
- **Typography**: Inter font family for modern readability
- **Components**: Consistent card-based layouts with proper spacing

## 📱 Responsive Design

Built mobile-first with breakpoints:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

## 🔒 Security Features

- Role-based access control (RBAC)
- Input validation and sanitization
- File upload restrictions and validation
- Secure authentication with JWT
- SQL injection prevention via Prisma
- XSS protection through Vue.js

## 📈 Performance Optimizations

- Server-side rendering (SSR) with Nuxt 3
- Automatic code splitting
- Image optimization
- Lazy loading for components and routes
- Efficient state management with Pinia
- Optimized bundle size

## 🧪 Testing Strategy

```bash
# Unit tests
pnpm test:unit

# E2E tests  
pnpm test:e2e

# Component testing
pnpm test:component
```

## 🚀 Deployment

### Production Build
```bash
pnpm build
pnpm preview
```

### Docker Deployment
```bash
docker build -t oba-system .
docker run -p 3000:3000 oba-system
```

## 📚 Documentation

- [Product Requirements](./product_references/Product_Requirements_OBA.md)
- [UI Design Reference](./ui_reference/)
- [API Documentation](./docs/api.md)
- [Development Guide](./docs/development.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏫 About UNU Yogyakarta

Universitas Nahdlatul Ulama Yogyakarta - Advancing Islamic education through modern technology and innovative learning methodologies.

---

**Built with ❤️ using Vue.js ecosystem • Nuxt 3 • Tailwind CSS**