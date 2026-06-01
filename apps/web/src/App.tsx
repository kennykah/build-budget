import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ArrowRight, Building2, Calculator, ClipboardList } from "lucide-react";
import {
  createEstimate,
  type EstimateInput,
  type EstimateResult,
} from "@buildbudget/shared";
import { EstimateForm } from "./components/EstimateForm";
import { MaterialsTable } from "./components/MaterialsTable";
import { PlanMockup } from "./components/PlanMockup";
import { ResultOverview } from "./components/ResultOverview";
import { SuppliersList } from "./components/SuppliersList";

const initialInput: EstimateInput = {
  budget: 45000,
  currency: "USD",
  city: "Kinshasa",
  constructionType: "house_2_bedroom",
  finishLevel: "standard",
  landSurface: 180,
  desiredBedrooms: 2,
};

export default function App() {
  const [input, setInput] = useState<EstimateInput>(initialInput);
  const [result, setResult] = useState<EstimateResult>(() =>
    createEstimate(initialInput),
  );
  const [error, setError] = useState<string | null>(null);

  const navigationItems = useMemo(
    () => [
      { href: "#calcul", label: "Calcul" },
      { href: "#resultat", label: "Résultat" },
      { href: "#maquette", label: "Maquette" },
      { href: "#materiaux", label: "Matériaux" },
      { href: "#fournisseurs", label: "Fournisseurs" },
    ],
    [],
  );

  function handleSubmit() {
    if (!Number.isFinite(input.budget) || input.budget <= 0) {
      setError("Saisis un budget supérieur à zéro pour lancer l'estimation.");
      return;
    }

    if (input.landSurface !== undefined && input.landSurface < 0) {
      setError("La surface du terrain ne peut pas être négative.");
      return;
    }

    setError(null);
    setResult(createEstimate(input));
    window.setTimeout(() => {
      document
        .getElementById("resultat")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  return (
    <div className="min-h-screen bg-white text-ink">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a className="flex items-center gap-2 font-semibold text-ink" href="#calcul">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-white">
              <Building2 size={20} aria-hidden="true" />
            </span>
            <span className="text-lg">BuildBudget</span>
          </a>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
            {navigationItems.map((item) => (
              <a
                className="rounded-md px-3 py-2 text-sm font-medium text-ink/70 transition hover:bg-field hover:text-ink"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            className="inline-flex items-center gap-2 rounded-md bg-clay px-3 py-2 text-sm font-semibold text-white transition hover:bg-ink"
            href="#calcul"
          >
            <Calculator size={17} aria-hidden="true" />
            Estimer
          </a>
        </div>
      </header>

      <main>
        <EstimateForm
          value={input}
          error={error}
          onChange={setInput}
          onSubmit={handleSubmit}
        />

        <section className="bg-white py-7">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
            <ProcessItem
              icon={<Calculator size={20} aria-hidden="true" />}
              title="1. Budget"
              text="Le client saisit les paramètres principaux du projet."
            />
            <ProcessItem
              icon={<ClipboardList size={20} aria-hidden="true" />}
              title="2. Calcul"
              text="Le moteur applique coûts, coefficients et fournisseurs mockés."
            />
            <ProcessItem
              icon={<ArrowRight size={20} aria-hidden="true" />}
              title="3. Décision"
              text="Le résultat donne une base claire pour comparer et ajuster."
            />
          </div>
        </section>

        <ResultOverview result={result} />
        <PlanMockup result={result} />
        <MaterialsTable result={result} />
        <SuppliersList result={result} />
      </main>

      <footer className="border-t border-ink/10 bg-ink py-7 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>BuildBudget MVP - estimation indicative de construction.</p>
          <p className="text-white/70">
            Les prix et coefficients du prototype sont simulés et modifiables plus tard.
          </p>
        </div>
      </footer>
    </div>
  );
}

interface ProcessItemProps {
  icon: ReactNode;
  title: string;
  text: string;
}

function ProcessItem({ icon, title, text }: ProcessItemProps) {
  return (
    <article className="flex gap-3 rounded-lg border border-ink/10 bg-field p-4">
      <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-palm">
        {icon}
      </span>
      <div>
        <h3 className="font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-ink/68">{text}</p>
      </div>
    </article>
  );
}
