# Database Schema Draft

This draft describes the planned PostgreSQL/Prisma model. It will be implemented after the frontend and local calculation engine stabilize.

## User

- `id`
- `name`
- `email`
- `role`: `CLIENT`, `SUPPLIER`, `ADMIN`
- `createdAt`

## SupplierProfile

- `id`
- `userId`
- `companyName`
- `city`
- `district`
- `phone`
- `verified`
- `reliabilityScore`

## Material

- `id`
- `name`
- `category`
- `baseUnit`

## SupplierProduct

- `id`
- `supplierId`
- `materialId`
- `price`
- `currency`
- `unit`
- `stockQuantity`
- `deliveryDelayDays`
- `active`
- `validated`

## CalculationRule

- `id`
- `materialId`
- `constructionType`
- `finishLevel`
- `quantityPerSquareMeter`
- `wasteFactor`

## Estimate

- `id`
- `userId` nullable
- `inputJson`
- `resultJson`
- `createdAt`

## HouseTemplate

- `id`
- `name`
- `minSurface`
- `maxSurface`
- `roomsJson`
- `layoutJson`
