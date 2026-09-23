# Crawler Platform

An API-first website crawler and content extractor built as a pnpm/Turborepo. A client submits one public website URL, the API creates an asynchronous job, and a worker recursively follows allowed links while storing clean Markdown and crawl metadata in PostgreSQL.

This repository deliberately stops at crawling, extraction, and persistence. It does not include embeddings, a vector database, retrieval, citations, or AI-generated answers.

## What version 1 does

- Accepts a seed URL and crawl configuration through an HTTP API.
- Uses a persistent BullMQ job so API requests do not stay open during a crawl.
- Crawls static HTML with Crawlee's `CheerioCrawler`.
- Falls back to Playwright when a page appears to require JavaScript.
- Discovers links from the original DOM even when only the page's main content is stored.
- Normalizes URLs and prevents the same URL from being processed twice.
- Restricts navigation to the same hostname by default.
- Supports optional subdomain crawling, depth limits, page limits, allow globs and deny globs.
- Reads `robots.txt` by default.
- Stores crawl jobs, pages, links, progress, failures, metadata, text and Markdown in PostgreSQL.
- Rejects localhost, credentials in URLs, private IP addresses and reserved IP addresses.

## Workspace structure

```text
apps/
  api/                 Fastify routes that create and inspect crawl jobs
  worker/              BullMQ worker that executes crawl jobs

packages/
  contracts/           Zod schemas and shared TypeScript types
  crawler/             Crawlee queue, recursive discovery and browser fallback
  database/            Drizzle schema, repository functions and migrations
  extractor/           Readability and Turndown extraction pipeline
  queue/               Redis and BullMQ configuration
```

## Request lifecycle

1. `POST /v1/crawls` validates the configuration and rejects an unsafe seed URL.
2. The API inserts a `crawl_jobs` row with status `queued`.
3. The API publishes a BullMQ job and immediately returns HTTP `202`.
4. The worker changes the job to `running` and creates a Crawlee request queue.
5. Each page is fetched through HTTP first.
6. In `auto` rendering mode, pages with too little visible text are rendered with Chromium.
7. Links are extracted from the complete DOM, normalized, filtered and added to the request queue.
8. Readability chooses the primary page content and Turndown converts it to Markdown.
9. The page and its outgoing links are stored through repository functions.
10. Progress counters are updated after each processed page.
11. The crawl finishes as `completed`, `failed` or `cancelled`.

## Prerequisites

- Node.js 22 or newer
- pnpm 11
- Docker with Docker Compose

## Local setup

```bash
cp .env.example .env
pnpm install
docker compose up -d
pnpm db:push
pnpm --filter @crawler/core exec playwright install chromium
pnpm dev
```

The API listens on `http://localhost:4000`. Turbo starts both the API and the crawler worker.

For deployment, generate and apply migrations instead of using schema push:

```bash
pnpm db:generate
pnpm db:migrate
```

## Start a crawl

```bash
curl --request POST http://localhost:4000/v1/crawls \
  --header 'content-type: application/json' \
  --data '{
    "url": "https://example.com",
    "maxPages": 10,
    "maxDepth": 2,
    "followSubdomains": false,
    "includeLinks": true,
    "includeImages": false,
    "useMainContentOnly": true,
    "renderJavaScript": "auto",
    "respectRobotsTxt": true
  }'
```

Example response:

```json
{
  "id": "d93ae182-61a6-4e2d-825f-fc20cbf7d703",
  "status": "queued",
  "seedUrl": "https://example.com",
  "createdAt": "2026-09-21T08:00:00.000Z"
}
```

## Inspect a crawl

```bash
curl http://localhost:4000/v1/crawls/Crawl_ID
curl 'http://localhost:4000/v1/crawls/Crawl_ID/pages?limit=50&offset=0'
curl http://localhost:4000/v1/pages/Page_ID
```

Cancel a queued or running crawl:

```bash
curl --request POST http://localhost:4000/v1/crawls/Crawl_ID/cancel
```

## Crawl configuration

| Field                  |  Default | Purpose                                                          |
| ---------------------- | -------: | ---------------------------------------------------------------- |
| `url`                  | required | Public HTTP or HTTPS seed URL                                    |
| `maxPages`             |    `100` | Maximum processed requests                                       |
| `maxDepth`             |      `4` | Maximum link distance from the seed                              |
| `followSubdomains`     |  `false` | Allow sibling subdomains under the same registrable domain       |
| `includeLinks`         |   `true` | Keep Markdown link destinations in extracted output              |
| `includeImages`        |  `false` | Keep images in Markdown and load images in browser mode          |
| `useMainContentOnly`   |   `true` | Use Readability instead of storing navigation and footer content |
| `renderJavaScript`     |   `auto` | `never`, `auto` or `always` browser rendering                    |
| `respectRobotsTxt`     |   `true` | Apply the site's robots exclusion rules                          |
| `requestTimeoutMs`     |  `30000` | Navigation timeout per request                                   |
| `minContentCharacters` |    `200` | Auto-render threshold for thin static HTML                       |
| `allowPatterns`        |     `[]` | Optional URL glob allowlist, such as `**/docs/**`                |
| `denyPatterns`         |     `[]` | URL glob denylist, applied before the allowlist                  |

`includeLinks` controls the Markdown output. It does not disable link discovery; otherwise the crawler could not recurse.

## Where the important logic lives

- `packages/crawler/src/crawler.ts`: crawl queue, recursive link discovery, progress and browser fallback.
- `packages/crawler/src/url.ts`: normalization, hostname scope, glob filtering and SSRF checks.
- `packages/extractor/src/index.ts`: complete-DOM link discovery and clean Markdown extraction.
- `packages/database/src/schema.ts`: the three-table relational model.
- `apps/api/src/app.ts`: API contract and asynchronous job creation.
- `apps/worker/src/index.ts`: connection between BullMQ, the crawler and database persistence.

## Database model

`crawl_jobs` stores configuration and progress. `crawl_pages` stores one unique normalized page per crawl. `crawl_links` stores the directed relationship from a source page to every discovered destination.

The unique constraint on `(crawl_job_id, normalized_url)` is the database's final duplicate-protection layer. Crawlee's request queue and the in-memory `seen` set avoid duplicate work before the database is reached.

## Verification

```bash
pnpm check-types
pnpm test
```

Tests cover URL normalization, domain boundaries, URL filtering, private-network detection, full-DOM link discovery and Markdown extraction behavior.

## Production hardening still required

This is a strong educational MVP, not permission to crawl every site. Before opening the API publicly:

- authenticate clients and enforce per-account quotas;
- apply strict response-size and total-byte limits;
- revalidate DNS after every redirect to close DNS-rebinding and redirect-based SSRF gaps;
- add per-domain concurrency and crawl-delay scheduling across all workers;
- place Playwright workers in isolated containers with CPU and memory limits;
- store very large raw artifacts in object storage rather than PostgreSQL;
- add proxy support only for legitimate, policy-compliant crawling;
- add retention policies, audit logs and crawl ownership checks;
- review each target site's terms, robots rules and applicable data/privacy laws.

Do not add CAPTCHA bypass, authentication bypass or access-control evasion to this crawler.
