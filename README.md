# FHIR Resource Tabular Viewer

A React + FastAPI application for browsing and searching FHIR (Fast Healthcare Interoperability Resources) data in a tabular format. The frontend is built with Vite + React + Tailwind CSS v4, and the backend is a FastAPI proxy that dynamically resolves FHIR server schemas.

---

## Table of Contents

- [Architecture](#architecture)
- [Quick Start with Docker](#quick-start-with-docker)
- [Local Development (without Docker)](#local-development-without-docker)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [API Reference](#api-reference)

---

## Architecture

```
Browser
  │
  ├─► :3000  (Frontend — React, served by Vite dev / serve in prod)
  │           │
  │           └─► Proxies /api, /resources → :8000
  │
  └─► :8000  (Backend — FastAPI + Uvicorn)
              │
              └─► https://hapi.fhir.org/baseR4/  (FHIR Server)
```

In **production**, the React bundle is pre-built and served as static files. The browser calls the backend directly on port `8000`.

In **development**, the Vite dev server runs HMR on port `3000` and server-side-proxies `/api` and `/resources` requests to the backend.

---

## Quick Start with Docker

> **Prerequisites**: Docker and Docker Compose installed.

### Production (default)

Builds the React app and serves the static bundle via `serve`:

```bash
docker compose up --build
```

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:3000  |
| Backend  | http://localhost:8000  |

To stop:
```bash
docker compose down
```

---

### Development (Hot-Module Replacement)

Mounts your local source files into the container so changes reflect instantly in the browser:

```bash
docker compose -f docker-compose.dev.yml up --build
```

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:3000  |
| Backend  | http://localhost:8000  |

Edits to `.jsx`, `.css`, or any frontend file will hot-reload automatically.

> **Note**: In dev mode, config.yaml is also mounted into the backend container so runtime changes to config take effect on backend restart.

---

## Local Development (without Docker)

### Backend

```bash
cd fhir-backend-dynamic
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
# From project root
npm install --legacy-peer-deps
npm run dev
```

Frontend will start at http://localhost:3000 and proxy API calls to the backend at http://localhost:8000.

---

## Configuration

All configuration is driven by `config.yaml` in the project root.

| Key | Description | Default |
|-----|-------------|---------|
| `fhir.base_url` | FHIR server base URL | `https://hapi.fhir.org/baseR4/` |
| `fhir.timeout_seconds` | Request timeout | `30` |
| `fhir.resource_discovery.mode` | `dynamic` or `static` | `dynamic` |
| `backend.port` | Backend port | `8000` |
| `backend.cache.patient_cache_duration_minutes` | Patient cache TTL | `15` |
| `backend.cache.max_cache_entries` | Max cache size | `200` |
| `features.condition_code_search` | Enable condition code filter | `true` |
| `features.age_filtering` | Enable age filter | `true` |
| `features.gender_filtering` | Enable gender filter | `true` |

### Environment Variable Overrides

The backend also reads these environment variables (override config.yaml values):

| Variable | Config key overridden |
|---|---|
| `FHIR_BASE_URL` | `fhir.base_url` |
| `PORT` | `backend.port` |
| `PATIENT_CACHE_DURATION` | `backend.cache.patient_cache_duration_minutes` |
| `MAX_CACHE_ENTRIES` | `backend.cache.max_cache_entries` |

### Frontend Environment Variables (baked in at build time)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend base URL for browser API calls | `http://localhost:8000` |
| `VITE_TITLE` | App title | `FHIR Patient Search` |
| `VITE_DEFAULT_PAGE_SIZE` | Rows per page | `50` |
| `VITE_DEBUG` | Enable debug logs | `false` |

> These are **build-time** variables. Setting them in docker-compose `environment:` at runtime has no effect on the pre-built bundle. Pass them as Docker build args if deploying to a non-localhost environment.

---

## Project Structure

```
.
├── config.yaml                    # Shared configuration (backend + frontend)
├── docker-compose.yml             # Production orchestration
├── docker-compose.dev.yml         # Development orchestration (HMR)
│
├── Dockerfile                     # Frontend multi-stage Dockerfile
│   ├── base   → dev               # Vite dev server
│   └── base → build → prod        # Static build served by `serve`
│
├── src/                           # React frontend source
│   ├── App.jsx
│   ├── api.jsx                    # Backend API client
│   ├── config.jsx                 # Frontend config (reads VITE_* env vars)
│   ├── services/                  # Service layer (FHIR data fetching)
│   └── ...
│
├── vite.config.js                 # Vite config — dev proxy /api → backend
│
└── fhir-backend-dynamic/          # FastAPI backend
    ├── Dockerfile                 # Backend Dockerfile (context: project root)
    ├── requirements.txt
    └── app/
        ├── main.py                # FastAPI app entrypoint
        ├── config.py              # Config loader (reads config.yaml)
        ├── services/
        │   ├── fhir.py            # FHIR HTTP client
        │   └── resource_discovery.py
        └── routers/
            ├── health.py          # GET /api/health
            ├── resources.py       # GET /api/resources/{type}
            ├── filters.py         # GET /api/filters/...
            └── metadata.py        # GET /api/metadata/...
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Routing | React Router v7 |
| Icons | Lucide React |
| Backend | FastAPI + Uvicorn |
| HTTP client (backend) | httpx (async) |
| FHIR source | [HAPI FHIR Public Server](https://hapi.fhir.org/baseR4/) |
| Containerization | Docker + Docker Compose |

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/resources/{type}` | Paginated FHIR resource list |
| `GET` | `/api/resources/{type}/{id}` | Single FHIR resource |
| `GET` | `/api/filters/definitions` | Filter definitions from config.yaml |
| `GET` | `/api/filters/resources` | Resources with available filters |
| `GET` | `/api/metadata/resources` | Discovered FHIR resource types |
| `GET` | `/api/resources/config/status` | Backend config + feature status |
