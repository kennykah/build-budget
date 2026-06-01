import { Layers, Ruler } from "lucide-react";
import type { EstimateResult } from "@buildbudget/shared";
import { formatNumber } from "../utils/format";

interface PlanMockupProps {
  result: EstimateResult;
}

export function PlanMockup({ result }: PlanMockupProps) {
  return (
    <section id="maquette" className="bg-field py-10 lg:py-14">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.75fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-river text-white">
              <Layers size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-river">
                Maquette
              </p>
              <h2 className="text-3xl font-semibold text-ink">Plan 2D indicatif</h2>
            </div>
          </div>

          <div className="mt-7 aspect-[1.45/1] overflow-hidden rounded-lg border-4 border-ink bg-white shadow-soft">
            <div className="relative h-full w-full">
              {result.layout.map((room) => (
                <div
                  className="absolute flex min-h-12 flex-col justify-between border border-ink/35 p-2 text-ink"
                  key={room.name}
                  style={{
                    backgroundColor: room.color,
                    left: `${room.x}%`,
                    top: `${room.y}%`,
                    width: `${room.width}%`,
                    height: `${room.height}%`,
                  }}
                >
                  <span className="text-xs font-semibold sm:text-sm">{room.name}</span>
                  <span className="text-[11px] text-ink/70 sm:text-xs">
                    {formatNumber(room.area)} m²
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-ink/10 bg-white p-5">
          <div className="flex items-center gap-3">
            <Ruler size={21} className="text-palm" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-ink">Lecture rapide</h3>
          </div>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ink/68">Surface retenue</dt>
              <dd className="font-semibold text-ink">
                {formatNumber(result.estimatedSurface)} m²
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ink/68">Type recommandé</dt>
              <dd className="font-semibold text-ink">{result.recommendedHouseType}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ink/68">Nombre de pièces</dt>
              <dd className="font-semibold text-ink">{result.rooms.length}</dd>
            </div>
          </dl>
          <p className="mt-6 rounded-md bg-clay/10 px-3 py-3 text-sm leading-6 text-ink/76">
            Ce plan sert à visualiser une organisation possible des espaces. Il ne
            remplace pas une étude architecturale, structurelle ou réglementaire.
          </p>
        </aside>
      </div>
    </section>
  );
}
