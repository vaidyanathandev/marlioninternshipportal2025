# Marlion Winter Internship 2025 Platform

A comprehensive AI-powered internship management system built with Next.js, Convex, and Clerk.

## Architecture

This is a Turborepo monorepo with:
- **apps/user** - Student-facing application (Port 3000)
- **apps/admin** - Admin dashboard (Port 3001)
- **packages/ui** - Shared UI components
- **packages/config** - Shared configurations
- **packages/types** - Shared TypeScript types
- **convex/** - Shared backend (Convex)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Backend:** Convex
- **Auth:** Clerk
- **AI:** DigitalOcean Serverless Inference (Llama 3.3-70B)
- **Styling:** Tailwind CSS
- **Monorepo:** Turborepo

## Getting Started

### Prerequisites

- Node.js 18+
- npm 10+

### Installation

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Build all apps
npm run build
```

### Development URLs

- Student App: http://localhost:3000
- Admin App: http://localhost:3001

## Environment Variables

Create `.env.local` files in each app:

### apps/user/.env.local & apps/admin/.env.local

```env
# Convex
CONVEX_DEPLOYMENT=https://jovial-tiger-412.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://jovial-tiger-412.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c3VubnktZ3JpZmZvbi00MC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_acdXitSZOOfSU9AwXHUnUDHLcTowTI5H0T8naYR3cw
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# DigitalOcean AI
DO_AI_API_KEY=sk-do--LMZmnIi-nmJHmVUJTs3p0RyTkQeArAcfoCdCLtFaXMRnPX-AkgIow7QMC
DO_AI_ENDPOINT=https://inference.do-ai.run/v1/chat/completions
AI_MODEL=llama3.3-70b-instruct
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

## License

Proprietary - Marlion Technologies © 2025
