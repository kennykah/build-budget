# BuildBudget

BuildBudget is a construction budget estimation and materials marketplace prototype. A client enters a budget, city, construction type, finish level, optional land surface, and optional desired bedrooms. The app returns an indicative buildable surface, cost breakdown, material needs, supplier recommendations, and a simple 2D mockup.

> Cette estimation est indicative et doit être validée par un professionnel du bâtiment.

## Monorepo Structure

```text
apps/
  web/          React + TypeScript + Vite frontend prototype
  api/          Future Node.js + Express + TypeScript API
packages/
  shared/       Shared domain types and local calculation utilities
docs/
  PROJECT_SPEC.md
  CALCULATION_ENGINE.md
  DATABASE_SCHEMA.md
```

## Current MVP Scope

- Client home screen and calculation form.
- Simulated local estimate engine.
- Indicative results page sections: summary, budget breakdown, materials, suppliers, and 2D layout.
- Mock supplier/material data.
- Documentation and project rules for future Codex work.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev:web
```

Build the frontend:

```bash
npm run build:web
```

## Planned Next Steps

1. Stabilize the shared calculation engine and add unit tests.
2. Expand construction mockup templates and add a simplified facade/3D preview.
3. Create the Express API endpoints around the shared estimator.
4. Add Prisma and PostgreSQL schema.
5. Build supplier and admin dashboards.
6. Add authentication and PDF export.
