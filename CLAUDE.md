# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Next.js + Payload CMS monorepo** for Airbank (financial services). The architecture uses **npm workspaces** with two main applications and shared packages.

**Ports:**
- CMS (Payload): `3001` (admin at `/admin`)
- Frontend (Next.js): `3000`
- Database (PostgreSQL): `5432` (via docker-compose)

## Monorepo Structure

```
apps/
  cms/          # Payload CMS backend (port 3001)
  fe/           # Next.js frontend (port 3000)
packages/
  shared/       # Auto-generated Payload types + shared TypeScript types
  eslint-config/      # Shared ESLint rules
  typescript-config/  # Shared TypeScript configs
scripts/        # Content scraping & demo population utilities
```

## Core Development Commands

```bash
# Start both apps
npm run dev

# Start individually
npm run cms:dev   # CMS only (port 3001)
npm run fe:dev    # Frontend only (port 3000)

# Database
docker-compose up postgres -d

# Type generation (run after CMS schema changes)
npm run cms:generate

# Quality checks
npm run validate        # Schema validation + TypeScript + ESLint
npm run lint-fix        # Auto-fix ESLint issues
npm run tsc             # TypeScript check all workspaces
```

## Block-Based Architecture

Pages are composed of **50+ reusable block types**. Each block exists in three places:

1. **CMS Schema** (`apps/cms/src/blocks/`) - Payload block definition
2. **Frontend Component** (`apps/fe/src/blocks/`) - React implementation
3. **Type Definition** (`packages/shared/src/payload-types.ts`) - Auto-generated

**Block categories:**
- `hero/` - Hero sections (plain, with image, slider, compact)
- `content/` - Content sections (feature, info, jumbotron, rich text)
- `benefits/` - Benefits grids (2-4 columns, with images, with lists)
- `cards/` - Card grids (CTA, info, link, video, FAQ)
- `tables/` - Data tables (compare, exchange rates, pricing)
- `interactive/` - Calculators (loan, mortgage, inflation, pension)
- `special/` - Custom blocks (app banner, timeline, logo carousel)

**Adding a new block:**
1. Create CMS schema in `apps/cms/src/blocks/[category]/MyBlock.ts`
2. Register in `apps/cms/src/blocks/index.ts`
3. Create React component in `apps/fe/src/blocks/[category]/myBlock/myBlock.tsx`
4. Register in `apps/fe/src/components/blocks.tsx`
5. Run `npm run cms:generate` to update types
6. Restart CMS dev server

## CMS-Frontend Integration

**API Client** (`apps/fe/src/api/client.ts`):
- REST API communication with Payload CMS
- Built-in caching (default: 3600s, configurable via `CACHE_REVALIDATE_TIME`)
- Draft mode support for preview workflows
- Custom auth via `cmsTokenCollection` parameter for third-party access

**Key functions:**
```typescript
fetchPages()           // Get all pages
fetchPage(slug)        // Get single page by slug
fetchGlobal(slug)      // Get global config (header, footer, settings)
fetchArticles()        // Get articles
```

**Draft Mode:**
- CMS live preview plugin enabled
- Frontend `/api/draft` route for preview activation
- Preview secret configured via `PREVIEW_SECRET` env var

## Content Collections & Globals

**Collections** (`apps/cms/src/collections/`):
- `Page` - Dynamic pages with block layouts
- `Article` - Blog/news articles
- `Media` - Uploaded images/files (Sharp processing)
- `Asset` - Document downloads
- `Category` - Content categorization
- `User` - Admin users
- `ThirdPartyAccess` - API token management

**Globals** (`apps/cms/src/globals/`):
- `Header` - Site header configuration
- `Footer` - Site footer configuration
- `Settings` - Site-wide settings

## Internationalization

**Frontend** (`next-intl`):
- Locales: Czech (`cs`) and English (`en`)
- Czech is default locale (prefix mode: `as-needed`)
- Routing: `/[locale]/[[...slug]]` structure
- Config: `apps/fe/src/i18n/routing.ts`

**CMS:**
- Multi-language admin via `@payloadcms/translations`
- Collections/globals support localization

## TypeScript & Type Generation

**CRITICAL:** After any CMS schema change, run:
```bash
npm run cms:generate
```

This generates `packages/shared/src/payload-types.ts` used by both apps.

**TypeScript config inheritance:**
- Base: `@repo/typescript-config/base.json` (ES2022, strict, NodeNext)
- Next.js: `@repo/typescript-config/nextjs.json` (ESNext, Bundler)
- Apps extend the Next.js config

## Styling System

**Tailwind CSS v4** with custom Air Bank design tokens:

**Color palette** (`apps/fe/tailwind.config.ts`):
- `ab-green` - Primary brand green
- `ab-green-hover` - Darker green for hovers
- `ab-green-light` / `ab-green-dark` - Green variants
- `ab-text-primary` / `ab-text-secondary` - Text colors
- `ab-bg-light` - Light grey background
- `ab-border` - Border color

**Container sizes:**
- `ab-content` - Main content width (1232px)
- `ab-wide` - Wide container
- Custom breakpoints: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`

**Utility helpers:**
- `cn()` from `apps/fe/src/utils/styles.ts` - Conditional classnames with `clsx` + `tailwind-merge`

## Observability & Instrumentation

**OpenTelemetry** enabled in both apps:
- Instrumentation files: `instrumentation.ts` and `instrumentation.node.ts`
- Service names: `cms` (backend) and `fe` (frontend)
- **Grafana Faro** for frontend monitoring
- Trace correlation via `server-timing` headers
- Sampling configurable via `METRICS_SAMPLING` env var (0.0 to 1.0)

## MCP (Model Context Protocol) Integration

**Endpoint:** `POST /api/mcp` (CMS, port 3001)

**Authentication:** Bearer token via MCP API key. Create keys in CMS admin at MCP API Keys collection.

**Available collections via MCP:**
| Collection | Find | Create | Update | Delete |
|-----------|------|--------|--------|--------|
| pages | Yes | Yes | Yes | Yes |
| articles | Yes | Yes | Yes | Yes |
| media | Yes | Yes | No | No |
| assets | Yes | No | No | No |
| categories | Yes | Yes | Yes | Yes |

**Available globals via MCP:**
| Global | Find | Update |
|--------|------|--------|
| header | Yes | Yes |
| footer | Yes | Yes |
| settings | Yes | No |

**Architecture:**
- Custom route handler bypasses broken `mcp-handler` adapter
- Per-request stateless design (new McpServer per request)
- In-memory sliding-window rate limiter (100 req/min per IP)
- HMAC-SHA256 API key authentication via `payload-mcp-api-keys` collection

**IDE configuration:**
- Claude Code: `.mcp.json` in project root
- Cursor: `.cursor/mcp.json`

**Testing locally:**
1. Start CMS: `npm run cms:dev`
2. Create MCP API key in admin panel (MCP API Keys collection)
3. Test: `curl -X POST http://localhost:3001/api/mcp -H "Authorization: Bearer YOUR_KEY" -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'`

## Scripts Directory

**Purpose:** Content scraping, extraction, and demo population.

**Key scripts:**
```bash
npm run populate          # Populate CMS with demo content
npm run populate:reset    # Reset demo to initial state
npm run scrape            # Scrape Airbank preview (full)
npm run scrape:recon      # Discovery-only scrape
npm run scrape:missing    # Find missing components
npm run compare           # Screenshot comparison
npm run generate:image    # Generate image with AI (see below)
```

**Image Generation** (`scripts/generate-image.ts`):

Generates images via Gemini 3 Pro with true transparent PNG output. Uses a magenta chroma-key
background + ImageMagick flood-fill removal for clean alpha edges.

Requires: ImageMagick (`brew install imagemagick`) and `GEMINI_API_KEY` in root `.env`.

```bash
# Basic generation (transparent PNG)
npx tsx scripts/generate-image.ts "A green credit card floating"

# With output filename
npx tsx scripts/generate-image.ts "A happy customer" -o customer.png

# With reference image (style/content guidance)
npx tsx scripts/generate-image.ts "Same card in blue" -r reference.png -o blue-card.png

# Faster model (Gemini 2.5 Flash)
npx tsx scripts/generate-image.ts "Quick sketch" -m flash

# Skip background removal (keep raw output)
npx tsx scripts/generate-image.ts "A logo" --no-remove-bg
```

Output is saved to `scripts/generated/` (gitignored).

**Populate scripts** (`scripts/populate-*.ts`):
- Use `scripts/lib/cms-api.ts` for CMS REST API operations
- Use `scripts/lib/lexical.ts` for converting HTML to Lexical format
- Use `scripts/lib/image-utils.ts` for downloading/processing images
- Upload media via `uploadMedia()`, reference by returned ID

**Example pattern:**
```typescript
import { createPage, uploadMedia } from './lib/cms-api.js';
import { htmlToLexical } from './lib/lexical.js';

const imageId = await uploadMedia('/path/to/image.png', 'Alt text');

const blocks = [
  {
    blockType: 'heroPlainBlock',
    title: 'My Hero',
    description: htmlToLexical('<p>HTML content here</p>'),
    image: imageId,
    backgroundColor: 'green',
  },
];

await createPage('Page Title', 'page-slug', blocks);
```

## Database

**PostgreSQL 16** (default):
```bash
docker-compose up postgres -d
```

**Connection:** Set `DATABASE_URI` in `apps/cms/.env`

**Migration to MongoDB:** Documented in `docs/db.md`

## Build & Deployment

**Production builds:**
```bash
npm run build  # Builds all workspaces
```

**Output:** Standalone Next.js apps in `dist/` folders for containerization.

**Docker:**
- `Dockerfile` for building container images (GitLab CI)
- `Dockerfile.azure` for Azure Container Apps (multi-stage, `APP=cms|fe` build arg)
- `docker-compose.yml` for local PostgreSQL

**CI/CD:**
- GitLab CI with external templates (build → test → publish)
- GitHub Actions for Azure deployment (`.github/workflows/deploy-azure.yml`)

## Azure Deployment

**Resource Group:** `etnc-airbankWeb-poc` (West Europe)

**Architecture:** Two Container Apps (CMS + FE) in a shared Container App Environment, backed by PostgreSQL Flexible Server and Azure Blob Storage for media.

| Resource | Name | Purpose |
|----------|------|---------|
| Container Registry | `airbankwebacr` | Docker image storage |
| Container App Environment | `airbank-env` | Shared networking/logging |
| PostgreSQL Flexible Server | `airbank-postgres` | Database (PG16, B1ms) |
| Storage Account | `airbankwebstorage` | Media uploads (Blob Storage) |
| Container App | `airbank-cms` | Payload CMS backend |
| Container App | `airbank-fe` | Next.js frontend |

**Initial setup:**
```bash
# Set required env vars, then run:
PG_ADMIN_PASSWORD=<...> PAYLOAD_SECRET=<...> PREVIEW_SECRET=<...> \
  bash scripts/azure-setup.sh
```

**Deployment flow** (automatic on push to `main`):
1. Validate (lint + typecheck)
2. Build & push CMS image to ACR
3. Build & push FE image to ACR
4. Deploy CMS Container App
5. Deploy FE Container App
6. Health check verification

**GitHub Secrets required:**

| Secret | Description |
|--------|-------------|
| `AZURE_CREDENTIALS` | Service principal JSON (Contributor on resource group) |
| `ACR_USERNAME` | Container Registry admin username (`airbankwebacr`) |
| `ACR_PASSWORD` | Container Registry admin password |
| `PAYLOAD_SECRET` | Payload CMS auth secret |
| `DATABASE_URI` | PostgreSQL connection string |
| `AZURE_STORAGE_CONNECTION_STRING` | Storage account connection string |

**Docker build (local testing):**
```bash
# Build CMS image
docker build --build-arg APP=cms -f Dockerfile.azure .

# Build FE image
docker build --build-arg APP=fe -f Dockerfile.azure .
```

**Health check endpoints:**
- CMS: `https://<cms-fqdn>/api/health/live`
- FE: `https://<fe-fqdn>/api/health/live`

## Environment Variables

**Required for CMS** (`apps/cms/.env`):
- `DATABASE_URI` - PostgreSQL connection string
- `PAYLOAD_SECRET` - Payload auth secret (long random string)
- `CMS_URL` - CMS public URL (e.g., `http://localhost:3001`)
- `FE_URL` - Frontend public URL (e.g., `http://localhost:3000`)
- `PREVIEW_SECRET` - Shared secret for draft preview

**Required for Frontend** (`apps/fe/.env`):
- `CMS_URL` - CMS REST API base URL
- `PREVIEW_SECRET` - Must match CMS value
- `CACHE_REVALIDATE_TIME` - Cache duration in seconds (default: 3600)
- `METRICS_SAMPLING` - OpenTelemetry sampling rate (0.0-1.0)

See `.env.example` files in each app for complete lists.

## Common Patterns

**Accessing CMS API from frontend:**
```typescript
import { fetchPage } from '@/api/client';

const page = await fetchPage('about-us');
```

**Rendering blocks dynamically:**
```typescript
import { Blocks } from '@/components/blocks';

<Blocks blocks={page.layout} testId="page" />
```

**Adding custom fields to blocks:**
1. Add field to CMS schema (`apps/cms/src/blocks/.../*.ts`)
2. Run `npm run cms:generate`
3. Access field in component props (auto-typed)

**Rich text rendering:**
```typescript
import { RichTextRenderer } from '@/components/richTextRenderer/richTextRenderer';

<RichTextRenderer content={lexicalContent} />
```

**Image handling:**
```typescript
import { getImageSrcWithFallback } from '@/utils/images';

const src = getImageSrcWithFallback(imageObject);
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `apps/cms/src/payload.config.ts` | Payload CMS core configuration |
| `apps/cms/src/collections/Page.ts` | Page collection with all block types |
| `apps/fe/src/api/client.ts` | REST client for CMS API |
| `apps/fe/src/components/blocks.tsx` | Block dispatcher/router |
| `apps/fe/src/i18n/routing.ts` | i18n routing configuration |
| `packages/shared/src/payload-types.ts` | Auto-generated types (DO NOT EDIT) |
| `scripts/lib/cms-api.ts` | CMS REST API wrapper utilities |
| `scripts/lib/lexical.ts` | HTML to Lexical conversion |

## Troubleshooting

**"Type X does not exist on Y":** Run `npm run cms:generate` after CMS schema changes.

**Port conflicts:** Check if ports 3000, 3001, or 5432 are in use.

**Database connection errors:** Ensure PostgreSQL is running via `docker-compose up postgres -d`.

**Stale Next.js cache:** Delete `.next/` directories in `apps/cms/` and `apps/fe/`.

**Type errors after updating blocks:** Restart TypeScript server and Next.js dev servers.

**Media upload fails:** Check Sharp installation (`npm ci` in `apps/cms/`).

## Documentation

- `README.md` - Project overview and quick start
- `docs/db.md` - Database configuration and migration guides
- `docs/cicd.md` - CI/CD pipeline documentation
- `docs/devops.md` - DevOps documentation
- `CHANGELOG.md` - Version history
