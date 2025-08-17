# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 web application with TypeScript, featuring a dashboard layout with sidebar navigation and header. The app includes management features for RPS (Rencana Pembelajaran Semester).

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality checks

## Architecture

- **Frontend Framework**: Vue 3 with Composition API and TypeScript
- **Build Tool**: Vite
- **Routing**: Vue Router with client-side navigation
- **Styling**: Scoped CSS with component-based architecture

## Project Structure

- `src/components/` - Reusable UI components (AppHeader, AppSidebar)
- `src/views/` - Page-level components (DashboardView, ManajemenRPSView)
- `src/router/` - Vue Router configuration
- `src/assets/` - Static assets and global styles

## Layout System

- Fixed header (64px height) with user email and logout button
- Fixed sidebar (256px width) with navigation menu
- Main content area with responsive margins
- Dark sidebar theme with blue accent colors for active states