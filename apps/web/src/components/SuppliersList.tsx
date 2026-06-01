import { Store, Truck, Star } from "lucide-react";
import type { EstimateResult } from "@buildbudget/shared";
import { formatMoney, formatNumber } from "../utils/format";

interface SuppliersListProps {
  result: EstimateResult;
}

export function SuppliersList({ result }: SuppliersListProps) {
  return (
    <section id="fournisseurs" className="bg-field py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-palm text-white">
            <Store size={20} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm">
              Marketplace
            </p>
            <h2 className="text-3xl font-semibold text-ink">
              Fournisseurs recommandés
            </h2>
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {result.selectedSuppliers.map((supplier) => (
            <article
              className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm"
              key={supplier.productId}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-ink">
                    {supplier.supplierName}
                  </h3>
                  <p className="mt-1 text-sm text-ink/64">
                    {supplier.city}, {supplier.district}
                  </p>
                </div>
                <span className="rounded-md bg-palm/10 px-2 py-1 text-xs font-semibold text-palm">
                  {supplier.materialName}
                </span>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md bg-field p-3">
                  <dt className="text-ink/60">Prix</dt>
                  <dd className="mt-1 font-semibold text-ink">
                    {formatMoney(supplier.unitPrice, result.input.currency)}
                  </dd>
                </div>
                <div className="rounded-md bg-field p-3">
                  <dt className="text-ink/60">Stock</dt>
                  <dd className="mt-1 font-semibold text-ink">
                    {formatNumber(supplier.stockAvailable, 0)} {supplier.unit}
                  </dd>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-field p-3">
                  <Truck size={17} className="text-river" aria-hidden="true" />
                  <div>
                    <dt className="text-ink/60">Délai</dt>
                    <dd className="font-semibold text-ink">
                      {supplier.deliveryDelayDays} j
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-field p-3">
                  <Star size={17} className="text-maize" aria-hidden="true" />
                  <div>
                    <dt className="text-ink/60">Fiabilité</dt>
                    <dd className="font-semibold text-ink">
                      {supplier.reliabilityScore}/100
                    </dd>
                  </div>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
