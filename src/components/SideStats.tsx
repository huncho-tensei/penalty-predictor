"use client";

import { motion } from "framer-motion";
import type { Player, ZoneDistribution } from "@/lib/types";
import { getTeamColor } from "@/lib/team-colors";

function getTopZone(zones: ZoneDistribution): string {
  const labels: Record<keyof ZoneDistribution, string> = {
    topLeft: "Top Left",
    topCenter: "Top Center",
    topRight: "Top Right",
    bottomLeft: "Bottom Left",
    bottomCenter: "Bottom Center",
    bottomRight: "Bottom Right",
  };
  let best: keyof ZoneDistribution = "bottomLeft";
  let max = 0;
  for (const [k, v] of Object.entries(zones)) {
    if (v > max) {
      max = v;
      best = k as keyof ZoneDistribution;
    }
  }
  return `${labels[best]} (${(max * 100).toFixed(0)}%)`;
}

function StatLine({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-baseline gap-3">
      <span className="text-foreground/30 text-[10px] font-noto uppercase tracking-wider">{label}</span>
      <span
        className="font-heading text-base tracking-wide"
        style={{ color: color ?? "var(--foreground)" }}
      >
        {value}
      </span>
    </div>
  );
}

export function TakerSideStats({ player }: { player: Player }) {
  const teamColor = getTeamColor(player.teamCode);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="hidden lg:flex flex-col gap-3 w-44 py-4 px-3 rounded-xl"
      style={{ borderLeft: `2px solid ${teamColor}40` }}
    >
      <span className="font-heading text-xs tracking-[0.2em] text-foreground/25 uppercase">Penalty Taker</span>
      <StatLine label="Foot" value={player.foot === "right" ? "Right" : "Left"} />
      <StatLine label="Career PKs" value={String(player.penaltiesTaken ?? "—")} />
      <StatLine label="Conversion" value={player.conversionRate ? `${(player.conversionRate * 100).toFixed(0)}%` : "—"} color="#00bcd4" />
      <StatLine label="Favoured Zone" value={getTopZone(player.zones)} />
      <StatLine label="Data" value={player.source === "verified" ? "Verified" : "Derived"} />
    </motion.div>
  );
}

export function KeeperSideStats({ player }: { player: Player }) {
  const teamColor = getTeamColor(player.teamCode);
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="hidden lg:flex flex-col gap-3 w-44 py-4 px-3 rounded-xl"
      style={{ borderRight: `2px solid ${teamColor}40` }}
    >
      <span className="font-heading text-xs tracking-[0.2em] text-foreground/25 uppercase text-right">Goalkeeper</span>
      <StatLine label="PKs Faced" value={String(player.penaltiesFaced ?? "—")} />
      <StatLine label="Save Rate" value={player.saveRate ? `${(player.saveRate * 100).toFixed(0)}%` : "—"} color="#ff6b6b" />
      <StatLine label="Dive Tendency" value={getTopZone(player.zones)} />
      <StatLine label="Multiplier" value={player.saveRate ? `${(player.saveRate / 0.17).toFixed(1)}x` : "1.0x"} />
      <StatLine label="Data" value={player.source === "verified" ? "Verified" : "Derived"} />
    </motion.div>
  );
}
