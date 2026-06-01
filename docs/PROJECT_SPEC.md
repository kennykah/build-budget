# BuildBudget Project Specification

## Product Goal

BuildBudget helps a user estimate what they can construct with a given budget by combining user input, construction coefficients, material requirements, supplier availability, and simple visual templates.

The first version is intentionally indicative. It is not an official engineering, architectural, or procurement document.

## Target User Flows

### Client Estimate

1. User enters budget, currency, city, construction type, finish level, optional land surface, and optional desired bedrooms.
2. The app estimates realistic buildable surface.
3. The app recommends a house type and rooms.
4. The app estimates material, labor, transport, and contingency costs.
5. The app recommends suppliers from available material data.
6. The app renders an indicative 2D layout template.

### Supplier Management

Future module where suppliers manage product price, stock, delivery delay, active status, and location.

### Admin Management

Future module where admins validate suppliers/materials and manage calculation coefficients, finish levels, contingency margins, and supported cities.

## MVP Modules

- `apps/web`: Client-facing prototype.
- `packages/shared`: Shared input/result types, mock suppliers, and first local estimator.
- `apps/api`: Reserved for backend endpoints once the local flow is stable.

## Input Fields

- Budget.
- Currency: USD or CDF.
- City.
- Construction type: studio, 1-bedroom house, 2-bedroom house, 3-bedroom house, duplex.
- Finish level: economic, standard, premium.
- Optional land surface.
- Optional desired bedrooms.

## Output Fields

- Estimated buildable surface.
- Recommended house type.
- Proposed rooms.
- Material cost.
- Labor cost.
- Transport cost.
- Contingency margin.
- Total estimate.
- Remaining budget or budget overrun.
- Material quantities.
- Recommended suppliers.
- Indicative 2D plan.
- Warning/disclaimer.

## Non-Goals For First Prototype

- Authentication.
- Real payment or ordering.
- Official architectural plans.
- Live supplier inventory.
- PDF export.
- PostgreSQL persistence.

## Architecture Direction

The prototype starts with local calculation data to make the client experience usable quickly. As the calculation stabilizes, the estimator should remain in `packages/shared` where both frontend and backend can reuse it. The API will later become the main execution layer for estimates and persistence.

## Quality Expectations

- TypeScript types for all domain objects.
- Maintainable components with clear boundaries.
- Mock data shaped like future database entities.
- Clear disclaimer in the UI.
- Builds must pass before considering a step complete.
