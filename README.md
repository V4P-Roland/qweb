# Qalcurate Web

Qalcurate Web is a clickable prototype of the Qalcurate MVP's desktop web
application — the enterprise counterpart to the [Qalcurate mobile
PWA](https://github.com/V4P-Roland/qalcurate). It covers the full Module 10
(Climate Risk Assessment) workflow: multi-channel evidence capture, a
role-gated six-step risk assessment stepper, and a TCFD-aligned reporting
dashboard, all driven by an in-memory mock data layer — no backend, no
database, no external APIs.

It ships as a TypeScript client (React + Vite) with a thin Express server
that serves the built static app in production.

## Features

- **Capture Hub** — four evidence-capture channels for a selected site:
  - **Interview** — AI-guided structured interview with a live transcript,
    a Start/Pause/Resume/Stop recorder, and per-hazard-topic structuring
    progress.
  - **Audit / Walkthrough** — timestamped, geo-tagged on-site evidence log.
  - **Web Research** — source-attributed search across public climate-risk
    data providers.
  - **File Upload** — document upload with a mandatory context annotation
    before submission.
  - An **offline simulation** toggle disables the Web Research channel and
    shows a reconnect banner, mirroring the mobile app's offline-first
    queuing behavior.
- **Climate Risk Assessment (Module 10)** — a six-step stepper (10.1–10.6)
  with role-based edit rights per step, precondition chips, draft saving,
  and executive approval on the mitigation step. Step 10.6 links directly
  into Reports & Dashboards instead of an inline form.
- **Reports & Dashboards** — an Overview tab (physical-risk heatmap, risk
  distribution, evidence & data trail with sync/gap status) plus four
  TCFD-pillar tabs (Governance, Strategy, Risk Management, Metrics &
  Targets), a reporting-period switch, and a PDF export action.
- **Role-based access control** — six personas (Field User/Auditor, Climate
  Risk Manager, Risk/Finance Manager, Executive/Risk Owner, Sustainability
  Manager, Admin) with per-section sidebar visibility and per-step
  edit/approve rights, switchable live from the top bar for demoing.
- **Admin** — tenant user/role table and tenant settings, visible only to
  the Admin role.

## Requirements

- [Docker](https://docs.docker.com/get-docker/) and the Docker Compose
  plugin (`docker compose version`), **or**
- [Node.js](https://nodejs.org/) 20+ and npm for local development without
  Docker (see [Local development](#local-development-without-docker) below).

## Quick start (Docker Compose)

```bash
git clone https://github.com/V4P-Roland/qweb.git
cd qweb
docker compose up --build -d
```

The app is now available at [http://localhost:8080](http://localhost:8080).

To use a different port, set `PORT` before starting (or create a `.env`
file with `PORT=3000`):

```bash
PORT=3000 docker compose up --build -d
```

Stop the container with:

```bash
docker compose down
```

### Updating

Pull the latest code and rebuild the image:

```bash
git pull
docker compose up --build -d
```

## Local development (without Docker)

```bash
npm install
npm run dev
```

This starts the Express server and the Vite dev server on the same port
(`5000` by default — open [http://localhost:5000](http://localhost:5000)).
The app reloads automatically on changes to `client/`, `server/`, or
`shared/`.

To build and run the production bundle locally:

```bash
npm run build
npm start
```

## Demo walkthrough

1. Sign in from the tenant login screen (any tenant value works; "simulate
   an unknown tenant" shows the not-found state).
2. Pick a site from **Projects & Sites**, then open **Capture** to try each
   evidence channel. Toggle "simulate offline" to see Web Research disable.
3. Open **Climate Risk Assessment** to walk the 10.1–10.6 stepper. Switch
   roles from the top-bar role dropdown to see which steps become
   editable/approvable for each persona.
4. Open **Reports & Dashboards** to review the generated TCFD-aligned
   report, or sign in as **Admin** to see the tenant user/role management
   screen.

## Project structure

```
.
├── Dockerfile               # multi-stage build → node:alpine runtime
├── docker-compose.yml        # single-service Compose setup
├── client/
│   ├── public/logo/          # Qalcurate brand assets
│   └── src/
│       ├── components/layout/AppShell.tsx  # sidebar + top bar + breadcrumb
│       ├── context/app-state.tsx           # role, active site, assessment state
│       ├── lib/
│       │   ├── roles.ts                    # Role type, ROLE_ACCESS, canEditStep
│       │   ├── nav.ts                      # sidebar nav items + visibility
│       │   └── mock-data.ts                # sites, KPIs, risk rows, evidence log
│       └── pages/                          # Login, Dashboard, Capture*, Assessment,
│                                            #   Reports, Admin
├── server/                   # Express app (serves the built client in production)
├── shared/                   # shared TypeScript types/schema
└── script/build.ts           # production build script
```

## Tech stack

React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui (Radix primitives),
TanStack Query, wouter (hash-based routing), Express. No database is used —
all data lives in a client-side mock data module for prototyping speed.

## Known limitations

- **Desktop-first.** The sidebar is `hidden` below the `md` breakpoint by
  design, per the scoped Web Version concept — there is no mobile
  navigation in this prototype (the mobile experience is covered by the
  separate [Qalcurate PWA](https://github.com/V4P-Roland/qalcurate)).
- **No persistence.** All state (role, active site, assessment progress,
  captured evidence) lives in React context/memory and resets on reload.
- **No real backend.** Web Research results, transcripts, and risk scores
  are static mock data, not live integrations.
