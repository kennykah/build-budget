# Calculation Engine Notes

## Purpose

The calculation engine estimates construction feasibility from user budget, city, construction type, finish level, material coefficients, and supplier data.

## Current Prototype Logic

1. Read user input.
2. Apply an indicative cost per square meter based on construction type, finish level, and city.
3. Reserve labor, transport, and contingency portions.
4. Estimate buildable surface from the usable budget.
5. Estimate material quantities using per-square-meter coefficients.
6. Select available suppliers by price, location, stock, delivery delay, and reliability.
7. Return a structured estimate result.

## Future Requirements

- Move coefficients to admin-managed database records.
- Add unit tests for edge cases and budget adjustment.
- Calibrate coefficients per city and construction category.
- Track calculation version on saved estimates.

## Disclaimer

All calculations are indicative and must be reviewed by construction professionals before financial or construction decisions.
