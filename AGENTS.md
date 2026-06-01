# BuildBudget Agent Guide

## Mission

BuildBudget is a progressive web application for indicative construction budget estimation, supplier recommendations, and simple construction mockups. The MVP must stay practical, transparent, and easy to evolve.

## Project Rules

- Work in small, reviewable steps. Do not build every roadmap item at once.
- Prefer clean TypeScript types shared through `packages/shared`.
- Keep frontend prototype logic local until the API is ready, then move orchestration behind `apps/api`.
- Treat all prices and construction coefficients as indicative and configurable. Do not present them as official market truth.
- Always show the disclaimer: "Cette estimation est indicative et doit être validée par un professionnel du bâtiment."
- The construction mockup is a visual aid, not an architectural plan.
- Keep UI professional, clear, and suitable for an African/RDC construction and supplier context.
- Avoid unnecessary abstractions, broad rewrites, and unrelated formatting churn.

## Current Architecture

- `apps/web`: React + TypeScript + Vite + Tailwind client prototype.
- `apps/api`: Reserved for the Node.js + Express + TypeScript API.
- `packages/shared`: Shared domain types and calculation utilities.
- `docs`: Product, calculation, and data model documentation.

## Development Practices

- Read this file before making changes.
- Before large implementation work, state the short plan.
- Add tests when calculation behavior becomes stable or business-critical.
- Validate with `npm run build:web` or the closest available check after frontend changes.
- Use mock data only for the prototype, and keep it shaped like future API/database records.

## Domain Constraints

- Budget estimates depend on supplier/admin data, city, construction type, finish level, transport, labor, and contingency.
- Coefficients must eventually be manageable by admins.
- Supplier recommendations should consider price, stock, delivery delay, city/distance, and reliability.
- PDF export, authentication, PostgreSQL, Prisma, and dashboards are future modules unless explicitly requested.
