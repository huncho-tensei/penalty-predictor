"use client";

import { motion } from "framer-motion";
import type { Player } from "@/lib/types";

type PlayerStatsProps = {
  taker: Player | null;
  keeper: Player | null;
  scoreProbability: number | null;
};

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center px-4 py-3 rounded-xl ${
        accent
          ? "bg-gold/5 border border-gold/15"
          : "bg-white/[0.02] border border-white/[0.05]"
      }`}
    >
      <span className="text-foreground/35 text-[10px] font-noto uppercase tracking-widest">
        {label}
      </span>
      <span
        className={`font-heading text-2xl ${accent ? "text-gold" : "text-foreground"}`}
        style={accent ? { textShadow: "0 0 16px rgba(255, 215, 0, 0.4)" } : undefined}
      >
        {value}
      </span>
      {sub && (
        <span className="text-foreground/20 text-[9px] font-noto uppercase tracking-wider mt-0.5">
          {sub}
        </span>
      )}
    </div>
  );
}

export default function PlayerStats({
  taker,
  keeper,
  scoreProbability,
}: PlayerStatsProps) {
  if (!taker || !keeper) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-[640px] justify-center"
    >
      {/* Taker stats */}
      <div className="flex gap-2">
        <StatCard
          label="Penalties"
          value={String(taker.penaltiesTaken ?? "—")}
        />
        <StatCard
          label="Conversion"
          value={taker.conversionRate ? `${(taker.conversionRate * 100).toFixed(0)}%` : "—"}
          sub={taker.source}
        />
      </div>

      {/* Score probability — center piece */}
      {scoreProbability !== null && (
        <StatCard
          label="Score Prob."
          value={`${(scoreProbability * 100).toFixed(1)}%`}
          accent
        />
      )}

      {/* Keeper stats */}
      <div className="flex gap-2">
        <StatCard
          label="Faced"
          value={String(keeper.penaltiesFaced ?? "—")}
        />
        <StatCard
          label="Save Rate"
          value={keeper.saveRate ? `${(keeper.saveRate * 100).toFixed(0)}%` : "—"}
          sub={keeper.source}
        />
      </div>
    </motion.div>
  );
}
