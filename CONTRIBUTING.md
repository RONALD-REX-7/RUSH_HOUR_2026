# Contributing to ProblemChain (Rush Hour 2026)

Thank you for your interest in contributing to **ProblemChain**!

## Project Overview

ProblemChain is an AI-powered civic issue reporting and startup opportunity matching ecosystem built during the **Rush Hour 2026 Hackathon**.

The repository is structured with two primary branches:
- `main` (**Active / Production-Ready**): Consolidated full-stack TypeScript application (React 19 + Vite + Tailwind CSS v4 on the frontend; Express + MongoDB / In-Memory fallback + JWT + bcrypt on the backend).
- `Test` (**Hackathon Submission Archive**): Contains the original multi-folder hackathon submission structure (`AI/` Flask microservice, `Backend/` Express service, `RUSH_HOUR_2026/Frontend/` UI, `database/` MongoDB dumps).

---

## Local Development Workflow

```bash
# 1. Clone repository
git clone https://github.com/RONALD-REX-7/RUSH_HOUR_2026.git
cd RUSH_HOUR_2026

# 2. Install dependencies
npm install

# 3. Static typecheck gate
npm run lint

# 4. Production bundle build
npm run build

# 5. Start unified full-stack dev server
npm run dev
```

The dev server will boot on `http://localhost:3000`.
- Out-of-the-box, the backend runs against an automated In-Memory mock store with pre-seeded users, issues, and chats.
- To connect to a live MongoDB instance, supply `MONGODB_URI` in your local `.env` file.

---

## Verification Standards

All pull requests and commits to `main` must satisfy:
1. **TypeScript Typecheck**: Zero errors under `npm run lint` (`tsc --noEmit`).
2. **Production Bundler**: Zero build failures under `npm run build` (Vite client build and esbuild server bundling).
3. **Secret Hygiene**: Zero committed `.env` files, credentials, or API tokens.
4. **Dual-Mode Data Integrity**: New API routes must support both live MongoDB models and the in-memory fallback layer in `server/db.ts`.
