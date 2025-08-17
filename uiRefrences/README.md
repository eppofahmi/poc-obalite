# FE OBALite - OBA System Frontend

This is the frontend application for the OBA (Outcome-Based Assessment) System for UNU Yogyakarta, built with Nuxt 3 and Vue 3.

## Features

- **Role-based Interface**: Different views for Administrators and Lecturers
- **Course Management**: Upload SIAKAD files and manage course data
- **Assessment Management**: Create and manage different types of assessments (Quiz, UTS, UAS, Projects, Participation)
- **Portfolio Generation**: Generate learning portfolios with self-evaluation
- **Responsive Design**: Modern, mobile-friendly interface with Tailwind CSS
- **State Management**: Pinia for application state management

## Tech Stack

- **Nuxt 3** - Vue.js framework
- **Vue 3** - JavaScript framework
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - State management
- **Font Awesome** - Icons
- **Inter Font** - Typography

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
fe-obalite/
├── assets/          # CSS and static assets
├── components/      # Vue components
├── layouts/         # Nuxt layouts
├── pages/           # Application pages/routes
├── plugins/         # Nuxt plugins
├── stores/          # Pinia stores
├── utils/           # Utility functions
└── public/          # Public static files
```

## Development Notes

- The application is being converted from HTML/CSS/JS reference files to a full Vue.js application
- UI components follow the original design from the UI reference files
- All styling uses Tailwind CSS with custom UNU branding colors
- Font Awesome icons are used throughout the interface

## Routes

- `/` - Lecturer Dashboard
- `/mata-kuliah` - Course Management
- `/soal` - Assessment/Question Management  
- `/portofolio` - Portfolio Generation

## Deployment

Build the application for production:

```bash
npm run build
```

The application can be deployed to any static hosting service or Node.js server.