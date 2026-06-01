import {
  CDF_PER_USD,
  baseCostPerSquareMeterUsd,
  cityMultipliers,
  constructionTypeLabels,
  contingencyRates,
  finishMultipliers,
  houseTemplates,
  materialCoefficients,
  mockSupplierProducts,
} from "./mockData";
import type {
  ConstructionType,
  Currency,
  EstimateInput,
  EstimateResult,
  HouseTemplate,
  MaterialEstimate,
  SelectedSupplier,
  SupplierProduct,
} from "./types";

const DISCLAIMER =
  "Cette estimation est indicative et doit être validée par un professionnel du bâtiment.";

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function roundQuantity(value: number): number {
  return Math.round(value * 100) / 100;
}

function toUsd(value: number, currency: Currency): number {
  return currency === "CDF" ? value / CDF_PER_USD : value;
}

function fromUsd(value: number, currency: Currency): number {
  return currency === "CDF" ? value * CDF_PER_USD : value;
}

function productPriceUsd(product: SupplierProduct): number {
  return toUsd(product.unitPrice, product.currency);
}

function getCityMultiplier(city: string): number {
  return cityMultipliers[city] ?? 1;
}

function getConstructionFactor(type: ConstructionType): number {
  if (type === "duplex") {
    return 1.18;
  }

  if (type === "studio") {
    return 0.92;
  }

  return 1;
}

function getFinishMaterialFactor(input: EstimateInput): number {
  if (input.finishLevel === "premium") {
    return 1.12;
  }

  if (input.finishLevel === "economic") {
    return 0.94;
  }

  return 1;
}

function selectSupplier(
  materialName: string,
  city: string,
  quantity: number,
  currency: Currency,
): SelectedSupplier | null {
  const candidates = mockSupplierProducts
    .filter(
      (product) =>
        product.materialName === materialName &&
        product.active &&
        product.validated,
    )
    .map((product) => {
      const unitPriceUsd = productPriceUsd(product);
      const localPenalty = product.city === city ? 0 : 18;
      const stockPenalty = product.stockAvailable >= quantity ? 0 : 30;
      const delayPenalty = product.deliveryDelayDays * 2.5;
      const reliabilityBonus = (product.reliabilityScore / 100) * 18;
      const score =
        unitPriceUsd * 10 + localPenalty + stockPenalty + delayPenalty - reliabilityBonus;

      return {
        product,
        score,
      };
    })
    .sort((a, b) => a.score - b.score);

  const best = candidates[0];

  if (!best) {
    return null;
  }

  return {
    productId: best.product.id,
    supplierName: best.product.supplierName,
    city: best.product.city,
    district: best.product.district,
    materialName: best.product.materialName,
    unitPrice: roundCurrency(fromUsd(productPriceUsd(best.product), currency)),
    currency,
    unit: best.product.unit,
    stockAvailable: best.product.stockAvailable,
    deliveryDelayDays: best.product.deliveryDelayDays,
    reliabilityScore: best.product.reliabilityScore,
    score: roundQuantity(best.score),
  };
}

function chooseTemplate(surface: number, input: EstimateInput): HouseTemplate {
  const desiredBedrooms = input.desiredBedrooms;

  if (desiredBedrooms !== undefined) {
    const templateByBedrooms = houseTemplates
      .filter((template) => template.bedrooms >= desiredBedrooms)
      .find((template) => surface >= template.minSurface * 0.9);

    if (templateByBedrooms) {
      return templateByBedrooms;
    }
  }

  return (
    houseTemplates.find(
      (template) => surface >= template.minSurface && surface <= template.maxSurface,
    ) ??
    houseTemplates
      .slice()
      .reverse()
      .find((template) => surface >= template.minSurface) ??
    houseTemplates[0]
  );
}

function scaleTemplate(template: HouseTemplate, surface: number): HouseTemplate {
  const templateArea = template.rooms.reduce((sum, room) => sum + room.area, 0);
  const scale = templateArea > 0 ? surface / templateArea : 1;

  return {
    ...template,
    rooms: template.rooms.map((room) => ({
      ...room,
      area: roundQuantity(Math.max(room.area * scale, 2)),
    })),
    layout: template.layout.map((room) => ({
      ...room,
      area: roundQuantity(Math.max(room.area * scale, 2)),
    })),
  };
}

function estimateForSurface(
  surface: number,
  input: EstimateInput,
): {
  materials: MaterialEstimate[];
  selectedSuppliers: SelectedSupplier[];
  materialsCostUsd: number;
  warnings: string[];
} {
  const warnings: string[] = [];
  const constructionFactor = getConstructionFactor(input.constructionType);
  const finishMaterialFactor = getFinishMaterialFactor(input);

  const materials = materialCoefficients.map((coefficient) => {
    const quantity = roundQuantity(
      surface *
        coefficient.quantityPerSquareMeter *
        coefficient.wasteFactor *
        constructionFactor *
        finishMaterialFactor,
    );
    const supplier = selectSupplier(
      coefficient.materialName,
      input.city,
      quantity,
      input.currency,
    );

    if (!supplier) {
      warnings.push(`Aucun fournisseur actif pour ${coefficient.materialName}.`);
    } else if (supplier.stockAvailable < quantity) {
      warnings.push(
        `Stock insuffisant chez ${supplier.supplierName} pour ${coefficient.materialName}.`,
      );
    }

    const unitPriceUsd = supplier ? toUsd(supplier.unitPrice, supplier.currency) : 0;
    const totalCostUsd = quantity * unitPriceUsd;

    return {
      materialName: coefficient.materialName,
      category: coefficient.category,
      quantity,
      unit: coefficient.unit,
      unitPrice: supplier ? supplier.unitPrice : 0,
      totalCost: roundCurrency(fromUsd(totalCostUsd, input.currency)),
      supplier,
      warning: supplier ? undefined : "Aucun fournisseur disponible dans les donnees mockees.",
    };
  });

  const selectedSuppliers = materials
    .map((material) => material.supplier)
    .filter((supplier): supplier is SelectedSupplier => Boolean(supplier));

  const materialsCostUsd = materials.reduce(
    (sum, material) => sum + toUsd(material.totalCost, input.currency),
    0,
  );

  return {
    materials,
    selectedSuppliers,
    materialsCostUsd,
    warnings,
  };
}

function recommendedConstructionType(surface: number, input: EstimateInput): ConstructionType {
  if (input.desiredBedrooms !== undefined) {
    if (input.desiredBedrooms >= 4 && surface >= 120) {
      return "duplex";
    }

    if (input.desiredBedrooms >= 3 && surface >= 85) {
      return "house_3_bedroom";
    }

    if (input.desiredBedrooms >= 2 && surface >= 55) {
      return "house_2_bedroom";
    }

    if (input.desiredBedrooms >= 1 && surface >= 35) {
      return "house_1_bedroom";
    }
  }

  if (surface >= 120) {
    return "duplex";
  }

  if (surface >= 85) {
    return "house_3_bedroom";
  }

  if (surface >= 55) {
    return "house_2_bedroom";
  }

  if (surface >= 35) {
    return "house_1_bedroom";
  }

  return "studio";
}

function calculateCostBreakdownUsd(
  surface: number,
  input: EstimateInput,
  materialsCostUsd: number,
) {
  const baseCost =
    baseCostPerSquareMeterUsd[input.constructionType] *
    finishMultipliers[input.finishLevel] *
    getCityMultiplier(input.city);
  const targetTotalUsd = surface * baseCost;
  const transportRate = input.city === "Kinshasa" ? 0.07 : 0.095;
  const transportCostUsd = materialsCostUsd * transportRate;
  const baseBeforeContingency =
    targetTotalUsd / (1 + contingencyRates[input.finishLevel]);
  const minimumLaborUsd = surface * baseCost * 0.2;
  const laborCostUsd = Math.max(
    minimumLaborUsd,
    baseBeforeContingency - materialsCostUsd - transportCostUsd,
  );
  const contingencyUsd =
    (materialsCostUsd + laborCostUsd + transportCostUsd) *
    contingencyRates[input.finishLevel];
  const totalUsd = materialsCostUsd + laborCostUsd + transportCostUsd + contingencyUsd;

  return {
    materials: materialsCostUsd,
    labor: laborCostUsd,
    transport: transportCostUsd,
    contingency: contingencyUsd,
    total: totalUsd,
  };
}

export function createEstimate(input: EstimateInput): EstimateResult {
  const warnings: string[] = [DISCLAIMER];
  const safeBudget = Math.max(input.budget, 0);
  const budgetUsd = toUsd(safeBudget, input.currency);
  const allInCostPerSquareMeter =
    baseCostPerSquareMeterUsd[input.constructionType] *
    finishMultipliers[input.finishLevel] *
    getCityMultiplier(input.city);

  let surface = budgetUsd > 0 ? budgetUsd / allInCostPerSquareMeter : 0;

  if (input.landSurface && input.landSurface > 0) {
    const landCap =
      input.constructionType === "duplex"
        ? input.landSurface * 1.1
        : input.landSurface * 0.68;

    if (surface > landCap) {
      warnings.push(
        "La surface a ete plafonnee selon la surface terrain renseignee et un coefficient d'occupation indicatif.",
      );
      surface = landCap;
    }
  }

  surface = Math.max(surface, budgetUsd > 0 ? 18 : 0);

  let materialPlan = estimateForSurface(surface, input);
  let breakdownUsd = calculateCostBreakdownUsd(
    surface,
    input,
    materialPlan.materialsCostUsd,
  );

  for (let attempt = 0; attempt < 6 && breakdownUsd.total > budgetUsd && budgetUsd > 0; attempt += 1) {
    const adjustmentRatio = Math.max((budgetUsd / breakdownUsd.total) * 0.98, 0.55);
    surface *= adjustmentRatio;
    materialPlan = estimateForSurface(surface, input);
    breakdownUsd = calculateCostBreakdownUsd(
      surface,
      input,
      materialPlan.materialsCostUsd,
    );
  }

  if (breakdownUsd.total > budgetUsd && budgetUsd > 0) {
    warnings.push(
      "Le budget reste serre meme apres ajustement de la surface. Prevoir une validation technique et commerciale.",
    );
  }

  const recommendedType = recommendedConstructionType(surface, input);
  const template = scaleTemplate(chooseTemplate(surface, input), surface);
  const budgetDeltaUsd = budgetUsd - breakdownUsd.total;
  const costBreakdown = {
    materials: roundCurrency(fromUsd(breakdownUsd.materials, input.currency)),
    labor: roundCurrency(fromUsd(breakdownUsd.labor, input.currency)),
    transport: roundCurrency(fromUsd(breakdownUsd.transport, input.currency)),
    contingency: roundCurrency(fromUsd(breakdownUsd.contingency, input.currency)),
    total: roundCurrency(fromUsd(breakdownUsd.total, input.currency)),
  };

  return {
    input,
    estimatedSurface: roundQuantity(surface),
    recommendedHouseType: constructionTypeLabels[recommendedType],
    rooms: template.rooms,
    layout: template.layout,
    costBreakdown,
    materials: materialPlan.materials,
    selectedSuppliers: materialPlan.selectedSuppliers,
    budgetStatus: {
      status: budgetDeltaUsd >= 0 ? "within_budget" : "over_budget",
      amount: roundCurrency(fromUsd(Math.abs(budgetDeltaUsd), input.currency)),
    },
    warnings: [...warnings, ...materialPlan.warnings],
  };
}
