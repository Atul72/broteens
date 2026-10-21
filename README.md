# Broteens

A high-performance TypeScript monorepo built with **Turborepo**, **pnpm**, **Next.js 14**, **Express**, and **Crawlee**.

This workspace houses two core capabilities:

1. **[Reachdesk](#reachdesk-marketing-platform)**: An email and WhatsApp campaign marketing platform with automated silent authentication, route protection, and a signature lavender design system.
2. **[Web Crawler & Extractor](#web-crawler--extractor-pipeline)**: An API-first, distributed website crawler and Markdown content extractor pipeline backed by Redis, BullMQ, and PostgreSQL.

---

## Workspace Architecture

```text
broteens/
├── apps/
│   ├── reach-desk-external/ # Next.js 14 public marketing & authentication app (Port 3000)
│   ├── reach-desk-internal/ # Next.js 14 authenticated workspace app (Templates, Editor, Profile) (Port 3001)
│   ├── reach-desk-backend/  # Express backend for Reachdesk templates & modules (Port 5000)
│   └── auth-api/            # Express backend: Auth (JWT/Refresh, Google OAuth) & Crawl routes (Port 4000)
│
├── packages/
│   ├── auth/               # Auth service, token rotation (JWT 15m / Refresh 30d), Bcrypt
│   ├── crawler/            # Crawlee queue, recursive discovery, SSRF defense & Playwright fallback
│   ├── extractor/          # Readability & Turndown DOM extraction pipeline (HTML to clean Markdown)
│   ├── database/           # Drizzle ORM schema, migrations, repository functions (PostgreSQL)
│   ├── queue/              # Redis and BullMQ queue definitions
│   ├── features/           # Shared UI modules (LoginForm, SignupForm, useAuthSession with auto-refresh)
│   ├── hooks/              # Shared React hooks (useLocalStorage, useAsyncAction, useDisclosure)
│   ├── ui/                 # Shared design system components (Spinner, Button, Alert, Input)
│   ├── errors/             # Standardized application errors and API error formatting
│   └── contracts/          # Shared Zod schemas and TypeScript type definitions
│
└── docker-compose.yml      # Local development PostgreSQL 17 & Redis 8 services
```

---

## Reachdesk Marketing Platform

**Reachdesk** (`apps/reach-desk`) is a multi-channel campaign workspace enabling businesses to create, manage, and monitor verified email and WhatsApp outreach.

### Key Capabilities

- **Signature Lavender Design System**:
  - Custom lavender brand aesthetic (`#8646D8` primary accent, `#FAF7FD` canvas, `#2B0E4E` deep gradient).
  - Ambient glows, glassmorphism feature cards, and responsive layouts that gracefully collapse on tablet/mobile screens.
  - Custom branded 404 page with 3D illustration and interactive navigation shortcuts.
- **Automated Silent Token Refresh**:
  - **Proactive Background Timer**: Refreshes the short-lived 15-minute `accessToken` silently in the background **60 seconds before expiration** via `/v1/auth/refresh`.
  - **Reactive 401 Interceptor**: If an authenticated API request receives a `401 Unauthorized` / `TOKEN_EXPIRED`, it transparently refreshes the token using the 30-day `refreshToken` and retries the original request seamlessly.
  - **Tab Visibility & Wake Listener**: Detects laptop wake and tab refocus, verifying token freshness before any user action occurs.
- **Zero-Flash Route Protection (`AuthShell`)**:
  - Guest-only routes (`/login`, `/signup`, `/reset-password`) start in a `"checking"` state and render a custom `Spinner` fallback on initial paint.
  - If an authenticated session is detected, the user is immediately redirected to `/profile` with zero flash of login/signup forms.
- **Structured Route Separation**:
  - Organized in `apps/reach-desk/libs/routes.ts`.
  - **Internal routes** (`/profile`): Workspace routes where the public marketing footer is automatically omitted.
  - **External routes** (`/`, `/features`, `/login`, `/signup`, `/reset-password`): Public marketing pages that include the full footer.
- **Google OAuth & Password Recovery**:
  - Meta and Google OAuth buttons styled to container width.
  - Robust token verification and password reset handling.

---

## Web Crawler & Extractor Pipeline

The **Crawler Pipeline** (`packages/crawler`, `packages/extractor`, `apps/auth-api`) is an asynchronous, API-first system designed to recursively follow links on a website, extract article content, and persist clean Markdown and link graphs.

### Request Lifecycle

```text
Client Request (POST /v1/crawls)
       │
       ▼
1. Validate URL & Enforce SSRF Checks (Block private IP / localhost)
       │
       ▼
2. Create Record in PostgreSQL (`crawl_jobs` with status: "queued")
       │
       ▼
3. Enqueue BullMQ Task (Redis) & Return HTTP 202 Accepted
       │
       ▼
4. Worker picks up Job ──► Initializes Crawlee Request Queue
       │
       ├─► Static HTML: CheerioCrawler
       └─► Thin/JS-heavy HTML: Chromium (Playwright) Fallback
       │
       ▼
5. Extract Full DOM Links ──► Normalize, check domain scope & robots.txt
       │
       ▼
6. Content Extraction ──► Readability selects main content ──► Turndown converts to Markdown
       │
       ▼
7. Persist to PostgreSQL (`crawl_pages`, `crawl_links`) & Update Progress Counters
       │
       ▼
8. Crawl finishes: marked as `completed`, `failed`, or `cancelled`
```

### Crawl Configuration Options

| Field                  |  Default   | Description                                             |
| :--------------------- | :--------: | :------------------------------------------------------ |
| `url`                  | _required_ | Public HTTP/HTTPS seed URL                              |
| `maxPages`             |   `100`    | Maximum number of pages to process                      |
| `maxDepth`             |    `4`     | Maximum link depth from the seed URL                    |
| `followSubdomains`     |  `false`   | Whether to allow crawling subdomains of the root domain |
| `includeLinks`         |   `true`   | Retain hyperlinks in generated Markdown                 |
| `includeImages`        |  `false`   | Retain image tags in Markdown output                    |
| `useMainContentOnly`   |   `true`   | Use Mozilla Readability to strip nav, ads, and footers  |
| `renderJavaScript`     |  `"auto"`  | `"never"`, `"auto"`, or `"always"` Chromium rendering   |
| `respectRobotsTxt`     |   `true`   | Follow target website's `robots.txt` exclusion rules    |
| `requestTimeoutMs`     |  `30000`   | Per-page request timeout in milliseconds                |
| `minContentCharacters` |   `200`    | Auto-render threshold for thin static HTML              |
| `allowPatterns`        |    `[]`    | Glob patterns to include (e.g. `["**/docs/**"]`)        |
| `denyPatterns`         |    `[]`    | Glob patterns to exclude (evaluated before allowlist)   |

### Crawler API Endpoints

- **Start a Crawl**:
  ```bash
  curl -X POST http://localhost:4000/v1/crawls \
    -H "Content-Type: application/json" \
    -d '{
      "url": "https://example.com",
      "maxPages": 10,
      "maxDepth": 2,
      "renderJavaScript": "auto"
    }'
  ```
- **Check Status**: `GET http://localhost:4000/v1/crawls/:crawlId`
- **List Extracted Pages**: `GET http://localhost:4000/v1/crawls/:crawlId/pages?limit=50&offset=0`
- **Get Single Page Markdown**: `GET http://localhost:4000/v1/pages/:pageId`
- **Cancel Active Crawl**: `POST http://localhost:4000/v1/crawls/:crawlId/cancel`

### Security & SSRF Defense

- Blocks private IPv4 / IPv6 addresses, loopback (`127.0.0.1`, `localhost`), link-local, and AWS metadata addresses (`169.254.169.254`).
- Rejects embedded credentials in URLs (`user:pass@host`).
- Validates protocols (only `http:` and `https:` permitted).

---

## Getting Started

### Prerequisites

- **Node.js**: `v22.0.0` or higher (`v24` recommended)
- **Package Manager**: `pnpm` (v10 or v11)
- **Containers**: Docker with Docker Compose

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/broteens.git
cd broteens
pnpm install
```

### 2. Configure Environment

Copy sample environment files:

```bash
cp .env.example .env
cp apps/auth-api/.env.example apps/auth-api/.env
cp apps/reach-desk/.env.example apps/reach-desk/.env.local
```

### 3. Start Database & Redis

```bash
docker compose up -d
```

- **PostgreSQL 17**: `localhost:5433` (user: `broteens`, password: `broteens`, db: `broteens`)
- **Redis 8**: `localhost:6379`

### 4. Push Database Schema & Install Playwright

```bash
pnpm db:push
pnpm --filter @broteens/crawler exec playwright install chromium
```

### 5. Start Development Servers

Run the entire monorepo with Turborepo:

```bash
pnpm dev
```

Or run individual apps:

```bash
# Reachdesk External Public App (http://localhost:3000)
pnpm --filter reach-desk-external dev

# Reachdesk Internal Workspace App (http://localhost:3001)
pnpm --filter reach-desk-internal dev

# Auth API (http://localhost:4000)
pnpm --filter @broteens/auth-api dev

# Reachdesk Backend (http://localhost:5000)
pnpm --filter @broteens/reach-desk-backend dev
```

---

## Quality & Verification

```bash
# Type check all packages and apps
pnpm check-types

# Run ESLint across workspace
pnpm lint

# Format code
pnpm format

# Production build verification
pnpm build
```

---

## License

Private repository. All rights reserved.
