import { AlertTriangle, BadgeDollarSign, Home, Ruler } from "lucide-react";
import type { EstimateResult } from "@buildbudget/shared";
import { formatMoney, formatNumber } from "../utils/format";

interface ResultOverviewProps {
  result: EstimateResult;
}

export function ResultOverview({ result }: ResultOverviewProps) {
  const statusLabel =
    result.budgetStatus.status === "within_budget"
      ? "Budget restant"
      : "Dépassement estimé";

  const statusTone =
    result.budgetStatus.status === "within_budget"
      ? "border-palm/20 bg-palm/8 text-palm"
      : "border-clay/20 bg-clay/10 text-clay";

  return (
    <section id="resultat" className="bg-white py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm">
              Résultat simulé
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">
              Proposition de construction indicative
            </h2>
          </div>
          <div className={`rounded-md border px-4 py-3 text-sm font-semibold ${statusTone}`}>
            {statusLabel}: {formatMoney(result.budgetStatus.amount, result.input.currency)}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="metric-card">
            <Ruler className="text-palm" size={24} aria-hidden="true" />
            <span>Surface estimée</span>
            <strong>{formatNumber(result.estimatedSurface)} m²</strong>
          </article>
          <article className="metric-card">
            <Home className="text-river" size={24} aria-hidden="true" />
            <span>Maison recommandée</span>
            <strong>{result.recommendedHouseType}</strong>
          </article>
          <article className="metric-card">
            <BadgeDollarSign className="text-maize" size={24} aria-hidden="true" />
            <span>Total estimé</span>
            <strong>{formatMoney(result.costBreakdown.total, result.input.currency)}</strong>
          </article>
          <article className="metric-card">
            <AlertTriangle className="text-clay" size={24} aria-hidden="true" />
            <span>Marge imprévus</span>
            <strong>
              {formatMoney(result.costBreakdown.contingency, result.input.currency)}
            </strong>
          </article>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-lg border border-ink/10 p-5">
            <h3 className="text-lg font-semibold text-ink">Répartition du budget</h3>
            <div className="mt-5 space-y-4">
              <BudgetLine
                label="Matériaux"
                value={result.costBreakdown.materials}
                total={result.costBreakdown.total}
                currency={result.input.currency}
                color="bg-palm"
              />
              <BudgetLine
                label="Main-d'œuvre"
                value={result.costBreakdown.labor}
                total={result.costBreakdown.total}
                currency={result.input.currency}
                color="bg-river"
              />
              <BudgetLine
                label="Transport"
                value={result.costBreakdown.transport}
                total={result.costBreakdown.total}
                currency={result.input.currency}
                color="bg-maize"
              />
              <BudgetLine
                label="Imprévus"
                value={result.costBreakdown.contingency}
                total={result.costBreakdown.total}
                currency={result.input.currency}
                color="bg-clay"
              />
            </div>
          </div>

          <div className="rounded-lg border border-ink/10 p-5">
            <h3 className="text-lg font-semibold text-ink">Pièces proposées</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {result.rooms.map((room) => (
                <div
                  className="flex items-center justify-between rounded-md bg-field px-4 py-3"
                  key={room.name}
                >
                  <span className="text-sm font-medium text-ink">{room.name}</span>
                  <span className="text-sm text-ink/70">
                    {formatNumber(room.area)} m²
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-md border border-clay/20 bg-clay/8 px-4 py-3 text-sm text-ink/76">
          {result.warnings[0]}
        </div>
      </div>
    </section>
  );
}

interface BudgetLineProps {
  label: string;
  value: number;
  total: number;
  currency: EstimateResult["input"]["currency"];
  color: string;
}

function BudgetLine({ label, value, total, currency, color }: BudgetLineProps) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-ink/72">{formatMoney(value, currency)}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/8">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
