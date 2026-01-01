# DockSight AI Frontend

Minimal React frontend for the DockSight AI docking analysis agent.

## Tech Stack

- React 18
- Vite
- TailwindCSS
- React Router
- React Markdown

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Frontend runs on http://localhost:3000

## Build

```bash
npm run build
```

## Pages

### 1. Landing (/)

- Upload docking files (.pdbqt, .log)
- Submit for analysis
- Navigate to results

### 2. Analyze (/analyze)

- View analysis status
- Ranked ligands table
- Interaction summary
- Visualization gallery
- Scientific report (Markdown)

## API Contract

Backend endpoint: `POST /api/analyze`

Expected response:

```json
{
  "status": "complete",
  "ranked_ligands": [...],
  "interactions": {...},
  "visualizations": [...],
  "report": "...",
  "attestation": {...}
}
```
