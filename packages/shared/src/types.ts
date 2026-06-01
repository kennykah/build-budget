export type Currency = "USD" | "CDF";

export type ConstructionType =
  | "studio"
  | "house_1_bedroom"
  | "house_2_bedroom"
  | "house_3_bedroom"
  | "duplex";

export type FinishLevel = "economic" | "standard" | "premium";

export interface EstimateInput {
  budget: number;
  currency: Currency;
  city: string;
  constructionType: ConstructionType;
  finishLevel: FinishLevel;
  landSurface?: number;
  desiredBedrooms?: number;
}

export interface SupplierProduct {
  id: string;
  supplierName: string;
  city: string;
  district: string;
  materialName: string;
  category: string;
  unitPrice: number;
  currency: Currency;
  unit: string;
  stockAvailable: number;
  deliveryDelayDays: number;
  reliabilityScore: number;
  active: boolean;
  validated: boolean;
}

export interface RoomPlan {
  name: string;
  area: number;
}

export interface LayoutRoom extends RoomPlan {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface HouseTemplate {
  id: string;
  name: string;
  minSurface: number;
  maxSurface: number;
  bedrooms: number;
  rooms: RoomPlan[];
  layout: LayoutRoom[];
}

export interface SelectedSupplier {
  productId: string;
  supplierName: string;
  city: string;
  district: string;
  materialName: string;
  unitPrice: number;
  currency: Currency;
  unit: string;
  stockAvailable: number;
  deliveryDelayDays: number;
  reliabilityScore: number;
  score: number;
}

export interface MaterialEstimate {
  materialName: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalCost: number;
  supplier: SelectedSupplier | null;
  warning?: string;
}

export interface CostBreakdown {
  materials: number;
  labor: number;
  transport: number;
  contingency: number;
  total: number;
}

export interface BudgetStatus {
  status: "within_budget" | "over_budget";
  amount: number;
}

export interface EstimateResult {
  input: EstimateInput;
  estimatedSurface: number;
  recommendedHouseType: string;
  rooms: RoomPlan[];
  layout: LayoutRoom[];
  costBreakdown: CostBreakdown;
  materials: MaterialEstimate[];
  selectedSuppliers: SelectedSupplier[];
  budgetStatus: BudgetStatus;
  warnings: string[];
}
