# Airbank demo: Next.js + Payload CMS

A full-stack TypeScript monorepo template featuring Next.js for the frontend and Payload CMS for the backend.


## Features

- **AI Chat Assistant** integrated in CMS admin for contextual help, content suggestions, and page creation
- **Automated SEO & Metadata Generation** using AI agents for meta descriptions, titles, and content validation
- **Business Context Injection** for brand-consistent AI outputs (customizable in admin)
- **Content & SEO Validation**: AI-powered review and optimization of pages and articles
- **Multi-agent Orchestration**: Specialized AI agents for SEO, LLM optimization, GEO, and CMS help

---

## Architecture

This monorepo uses npm workspaces and consists of:


### `apps/cms` (Port 3001)
- Payload CMS backend and admin interface
- AI Chat (contextual assistant) integrated in admin sidebar
- AI-powered admin views: Content Generation, SEO Validation, LLM Optimization
- Content management: Articles, Pages, Media, Assets, Categories, Users
- Global configurations: Header, Footer, Settings, Business Context (for AI)
- Multi-language admin interface
- Rich text editing with Lexical
- Live preview integration with frontend
- Plugins: Nested docs, SEO, Search, Redirects, Validation


### `apps/fe` (Port 3000)
- Public-facing Next.js application
- Internationalized routing with next-intl
- Tailwind CSS v4 for styling
- Turbopack for fast development builds
- REST API client for CMS integration with caching and draft mode support


### `packages/shared`
- Shared TypeScript types
- Auto-generated Payload types (including AI-related types)


### `packages/eslint-config`
- Shared ESLint configuration for all workspaces


### `packages/typescript-config`
- Shared TypeScript configuration for all workspaces


## Prerequisites

- **Node.js** version 24.x (recommended) or 18.x minimum
- **Docker** (for PostgreSQL database)
- **npm** or compatible package manager


## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/ondrejzapletal-etn/meopta-demo.git
   cd meopta-demo
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Start the database**
   ```bash
   docker-compose up postgres -d
   ```

4. **Set up environment variables**
   - Create `apps/cms/.env` file.
   - Create `apps/fe/.env` file.
   - See `.env.example` files in each app directory for all available options.

5. **Start development servers**
   ```bash
   npm run dev
   ```

6. **Access the applications**
   - Frontend: http://localhost:3000
   - CMS Admin: http://localhost:3001/admin

## Available Scripts

### Root Level Commands
```bash
npm run dev           # Start both frontend and CMS
npm run build         # Build all workspaces
npm run lint          # Run ESLint across all workspaces
npm run lint-fix      # Auto-fix ESLint issues across all workspaces
npm run tsc           # Run TypeScript type checking across all workspaces
npm run test          # Run tests across all workspaces
npm run clean         # Remove node_modules and build artifacts
npm run cms:dev       # Start only CMS (port 3001)
npm run fe:dev        # Start only frontend (port 3000)
npm run cms:generate  # Generate TypeScript types from Payload CMS to shared package
```
