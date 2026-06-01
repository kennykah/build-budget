import { Package } from "lucide-react";
import type { EstimateResult } from "@buildbudget/shared";
import { formatMoney, formatNumber } from "../utils/format";

interface MaterialsTableProps {
  result: EstimateResult;
}

export function MaterialsTable({ result }: MaterialsTableProps) {
  return (
    <section id="materiaux" className="bg-white py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-maize text-ink">
            <Package size={20} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-maize">
              Matériaux
            </p>
            <h2 className="text-3xl font-semibold text-ink">
              Quantités et coûts estimés
            </h2>
          </div>
        </div>

        <div className="mt-7 overflow-hidden rounded-lg border border-ink/10">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ink/10 text-left text-sm">
              <thead className="bg-field text-xs uppercase tracking-[0.12em] text-ink/64">
                <tr>
                  <th className="px-4 py-3">Matériau</th>
                  <th className="px-4 py-3">Catégorie</th>
                  <th className="px-4 py-3">Quantité</th>
                  <th className="px-4 py-3">Prix unitaire</th>
                  <th className="px-4 py-3">Coût</th>
                  <th className="px-4 py-3">Fournisseur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/8 bg-white">
                {result.materials.map((material) => (
                  <tr key={material.materialName} className="align-top">
                    <td className="px-4 py-3 font-semibold text-ink">
                      {material.materialName}
                    </td>
                    <td className="px-4 py-3 text-ink/70">{material.category}</td>
                    <td className="px-4 py-3 text-ink/78">
                      {formatNumber(material.quantity, 2)} {material.unit}
                    </td>
                    <td className="px-4 py-3 text-ink/78">
                      {formatMoney(material.unitPrice, result.input.currency)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-ink">
                      {formatMoney(material.totalCost, result.input.currency)}
                    </td>
                    <td className="px-4 py-3 text-ink/78">
                      {material.supplier?.supplierName ?? "Non trouvé"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
