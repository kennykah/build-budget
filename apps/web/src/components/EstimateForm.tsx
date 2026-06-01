import {
  Calculator,
  Home,
  MapPin,
  Paintbrush,
  Ruler,
  WalletCards,
} from "lucide-react";
import {
  constructionTypeLabels,
  finishLevelLabels,
  supportedCities,
  type ConstructionType,
  type Currency,
  type EstimateInput,
  type FinishLevel,
} from "@buildbudget/shared";

interface EstimateFormProps {
  value: EstimateInput;
  error: string | null;
  onChange: (value: EstimateInput) => void;
  onSubmit: () => void;
}

const constructionTypes = Object.entries(constructionTypeLabels) as [
  ConstructionType,
  string,
][];

const finishLevels = Object.entries(finishLevelLabels) as [FinishLevel, string][];

function updateNumber(value: string): number | undefined {
  if (value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function EstimateForm({
  value,
  error,
  onChange,
  onSubmit,
}: EstimateFormProps) {
  return (
    <section id="calcul" className="bg-field py-10 lg:py-14">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay">
            Prototype client
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Estimer ce qu'un budget peut construire, avant de demander un devis.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ink/72">
            BuildBudget combine budget, ville, niveau de finition, coefficients
            indicatifs et fournisseurs simulés pour produire une première lecture
            réaliste du projet.
          </p>
          <div className="mt-7 grid gap-3 text-sm text-ink/72 sm:grid-cols-3">
            <span className="rounded-md border border-ink/10 bg-white px-3 py-2">
              Surface estimée
            </span>
            <span className="rounded-md border border-ink/10 bg-white px-3 py-2">
              Matériaux requis
            </span>
            <span className="rounded-md border border-ink/10 bg-white px-3 py-2">
              Plan 2D indicatif
            </span>
          </div>
        </div>

        <form
          className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <div className="flex items-center gap-3 border-b border-ink/10 pb-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-palm text-white">
              <Calculator size={22} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-ink">Calcul rapide</h2>
              <p className="text-sm text-ink/64">
                Données minimales pour un premier chiffrage.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="field-label">
              <span>
                <WalletCards size={16} aria-hidden="true" />
                Budget
              </span>
              <input
                className="field-input"
                min="1"
                type="number"
                value={value.budget || ""}
                onChange={(event) =>
                  onChange({ ...value, budget: Number(event.target.value) })
                }
              />
            </label>

            <label className="field-label">
              <span>Devise</span>
              <select
                className="field-input"
                value={value.currency}
                onChange={(event) =>
                  onChange({ ...value, currency: event.target.value as Currency })
                }
              >
                <option value="USD">USD</option>
                <option value="CDF">CDF</option>
              </select>
            </label>

            <label className="field-label">
              <span>
                <MapPin size={16} aria-hidden="true" />
                Ville
              </span>
              <select
                className="field-input"
                value={value.city}
                onChange={(event) => onChange({ ...value, city: event.target.value })}
              >
                {supportedCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-label">
              <span>
                <Home size={16} aria-hidden="true" />
                Type de construction
              </span>
              <select
                className="field-input"
                value={value.constructionType}
                onChange={(event) =>
                  onChange({
                    ...value,
                    constructionType: event.target.value as ConstructionType,
                  })
                }
              >
                {constructionTypes.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-label">
              <span>
                <Paintbrush size={16} aria-hidden="true" />
                Niveau de finition
              </span>
              <select
                className="field-input"
                value={value.finishLevel}
                onChange={(event) =>
                  onChange({ ...value, finishLevel: event.target.value as FinishLevel })
                }
              >
                {finishLevels.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-label">
              <span>
                <Ruler size={16} aria-hidden="true" />
                Surface terrain optionnelle
              </span>
              <input
                className="field-input"
                min="0"
                placeholder="Ex. 180"
                type="number"
                value={value.landSurface ?? ""}
                onChange={(event) =>
                  onChange({
                    ...value,
                    landSurface: updateNumber(event.target.value),
                  })
                }
              />
            </label>

            <label className="field-label sm:col-span-2">
              <span>Nombre de chambres souhaité optionnel</span>
              <input
                className="field-input"
                min="0"
                max="6"
                placeholder="Ex. 2"
                type="number"
                value={value.desiredBedrooms ?? ""}
                onChange={(event) =>
                  onChange({
                    ...value,
                    desiredBedrooms: updateNumber(event.target.value),
                  })
                }
              />
            </label>
          </div>

          {error ? (
            <p className="mt-4 rounded-md bg-clay/10 px-3 py-2 text-sm font-medium text-clay">
              {error}
            </p>
          ) : null}

          <button
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-palm focus:outline-none focus:ring-2 focus:ring-palm focus:ring-offset-2"
            type="submit"
          >
            <Calculator size={18} aria-hidden="true" />
            Calculer mon budget
          </button>
        </form>
      </div>
    </section>
  );
}
