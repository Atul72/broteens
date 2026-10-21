# Reachdesk Frontend

A modern Next.js 14 application providing a unified marketing workspace for managing verified **Email** and **WhatsApp** campaigns.

---

## Features

- **Brand Design System**:
  - Signature lavender color palette (`#8646D8` accent, `#FAF7FD` canvas, `#2B0E4E` gradient).
  - Responsive showcase layouts that adapt across desktop, tablet, and mobile.
  - Custom branded 404 page with 3D illustration and interactive navigation.
- **Automated Silent Auth Refresh**:
  - **Proactive Background Refresh**: Silently requests a new JWT access token 60 seconds before expiration via `/v1/auth/refresh`.
  - **Reactive 401 Interceptor**: Intercepts expired token errors on authenticated requests, refreshes using the 30-day `refreshToken`, and replays the request without user interruption.
  - **Tab Visibility Sync**: Refreshes sessions immediately when users wake their devices or switch back to the browser tab.
- **Zero-Flash Route Protection (`AuthShell`)**:
  - Prevents guest-only routes (`/login`, `/signup`, `/reset-password`) from flashing forms to authenticated users.
  - Initial SSR & client hydration renders a centered `Spinner` fallback while validating local/backend session state.
- **Route Architecture (`libs/routes.ts`)**:
  - **Internal Routes**: `/profile` (protected workspace view; marketing footer is automatically omitted).
  - **External Routes**: `/`, `/features`, `/login`, `/signup`, `/reset-password` (marketing pages; full footer enabled).
- **Google Single-Sign-On**:
  - Meta and Google OAuth buttons styled to match container width.

---

## Directory Structure

```text
apps/reach-desk/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx            # Home landing page with Hero, Features, CTA
│   │   └── features/page.tsx   # Detailed features & channel workflow showcase
│   ├── login/page.tsx          # Sign-in page wrapped in AuthShell & Suspense
│   ├── signup/page.tsx         # Account registration page wrapped in AuthShell & Suspense
│   ├── reset-password/page.tsx # Password recovery form wrapped in AuthShell & Suspense
│   ├── settings/page.tsx       # Profile & account settings screen
│   ├── not-found.tsx           # Custom 404 error page
│   ├── loading.tsx             # Root Suspense streaming fallback with Spinner
│   └── layout.tsx              # Root HTML & Geist font configuration
├── components/
│   ├── AuthShell.tsx           # Shared authentication shell with guest-only protection
│   ├── Spinner.tsx             # Lavender dual-track circular spinner with fullScreen option
│   ├── Navbar.tsx              # Sticky header with authenticated user menu & mobile drawer
│   ├── Footer.tsx              # Marketing footer with route-based visibility check
│   └── ReachdeskLogo.tsx       # Branded SVG logo icon and typography
└── libs/
    └── routes.ts               # Internal/external route lists and shouldShowFooter helper
```

---

## Environment Variables

Create `.env.local` based on `.env.example`:

```bash
NEXT_PUBLIC_AUTH_API_URL=http://localhost:4000/v1/auth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## Development

Run development server:

```bash
pnpm dev
# or from root
pnpm --filter reach-desk dev
```

Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if 3000 is occupied).

### Build & Type Check

```bash
# Verify TypeScript types and generate production Next.js build
pnpm build
```
