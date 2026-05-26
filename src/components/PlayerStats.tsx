"use client";

import type { Player } from "@/lib/types";

type PlayerStatsProps = {
  taker: Player | null;
  keeper: Player | null;
  scoreProbability: number | null;
};

function StatBadge({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-foreground/40 text-xs font-noto uppercase tracking-wide">{label}</span>
      <span className="font-heading text-2xl text-foreground">{value}</span>
      {sub && <span className="text-foreground/30 text-[10px] font-noto">{sub}</span>}
    </div>
  );
}

export default function PlayerStats({ taker, keeper, scoreProbability }: PlayerStatsProps) {
  if (!taker || !keeper) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-center justify-center w-full max-w-[600px]">
      <div className="flex gap-6 items-center">
        <StatBadge
          label="Penalties"
          value={String(taker.penaltiesTaken ?? "—")}
        />
        <StatBadge
          label="Conversion"
          value={taker.conversionRate ? `${(taker.conversionRate * 100).toFixed(0)}%` : "—"}
          sub={taker.source}
        />
      </div>

      {scoreProbability !== null && (
        <div className="flex flex-col items-center">
          <span className="text-foreground/40 text-xs font-noto uppercase tracking-wide">
            Score Prob.
          </span>
          <span
            className="font-heading text-3xl"
            style={{ color: "#ffd700", textShadow: "0 0 12px rgba(255, 215, 0, 0.4)" }}
          >
            {(scoreProbability * 100).toFixed(1)}%
          </span>
        </div>
      )}

      <div className="flex gap-6 items-center">
        <StatBadge
          label="Faced"
          value={String(keeper.penaltiesFaced ?? "—")}
        />
        <StatBadge
          label="Save Rate"
          value={keeper.saveRate ? `${(keeper.saveRate * 100).toFixed(0)}%` : "—"}
          sub={keeper.source}
        />
      </div>
    </div>
  );
}
