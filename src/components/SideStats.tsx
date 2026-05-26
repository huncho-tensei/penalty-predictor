"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Player } from "@/lib/types";
import { getTeamColor } from "@/lib/team-colors";
import { getRandomFact } from "@/lib/fun-facts";

function ComparisonBar({
  label,
  leftValue,
  rightValue,
  leftLabel,
  rightLabel,
  leftColor,
  rightColor,
}: {
  label: string;
  leftValue: number;
  rightValue: number;
  leftLabel: string;
  rightLabel: string;
  leftColor: string;
  rightColor: string;
}) {
  const total = leftValue + rightValue || 1;
  const leftPct = (leftValue / total) * 100;
  const rightPct = (rightValue / total) * 100;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between">
        <span className="text-[10px] font-noto text-foreground/30 uppercase tracking-wider">{leftLabel}</span>
        <span className="text-[10px] font-noto text-foreground/25 uppercase tracking-wider">{label}</span>
        <span className="text-[10px] font-noto text-foreground/30 uppercase tracking-wider">{rightLabel}</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-white/5">
        <motion.div
          className="h-full rounded-l-full"
          style={{ backgroundColor: leftColor }}
          initial={{ width: 0 }}
          animate={{ width: `${leftPct}%` }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        />
        <motion.div
          className="h-full rounded-r-full"
          style={{ backgroundColor: rightColor }}
          initial={{ width: 0 }}
          animate={{ width: `${rightPct}%` }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function TakerSideStats({ player, opponent }: { player: Player; opponent: Player }) {
  const teamColor = getTeamColor(player.teamCode);
  const fact = useMemo(() => getRandomFact(player.id), [player.id]);
  const conv = player.conversionRate ?? 0.80;
  const saveRate = opponent.saveRate ?? 0.17;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="hidden lg:flex flex-col gap-4 w-48 py-4 px-4 rounded-xl"
      style={{ borderLeft: `2px solid ${teamColor}50` }}
    >
      <span className="font-heading text-xs tracking-[0.2em] text-teal uppercase">Taker Profile</span>

      <ComparisonBar
        label="Strike Rate"
        leftValue={conv * 100}
        rightValue={(1 - conv) * 100}
        leftLabel={`${(conv * 100).toFixed(0)}%`}
        rightLabel={`${((1 - conv) * 100).toFixed(0)}%`}
        leftColor="#00bcd4"
        rightColor="rgba(255,255,255,0.1)"
      />

      <ComparisonBar
        label="Matchup"
        leftValue={conv * 100}
        rightValue={saveRate * 100}
        leftLabel="Conv."
        rightLabel="Save"
        leftColor="#00bcd4"
        rightColor="#ff6b6b"
      />

      <div className="flex justify-between text-foreground/40">
        <span className="text-[10px] font-noto uppercase tracking-wider">Foot</span>
        <span className="font-heading text-sm">{player.foot === "right" ? "Right" : "Left"}</span>
      </div>

      <div className="flex justify-between text-foreground/40">
        <span className="text-[10px] font-noto uppercase tracking-wider">Career PKs</span>
        <span className="font-heading text-sm">{player.penaltiesTaken ?? "—"}</span>
      </div>

      {fact && (
        <div className="mt-1 pt-3 border-t border-white/5">
          <span className="text-[9px] font-noto uppercase tracking-wider text-teal/60">Did you know?</span>
          <p className="text-[11px] font-noto text-foreground/40 mt-1 leading-relaxed">{fact}</p>
        </div>
      )}
    </motion.div>
  );
}

export function KeeperSideStats({ player, opponent }: { player: Player; opponent: Player }) {
  const teamColor = getTeamColor(player.teamCode);
  const fact = useMemo(() => getRandomFact(player.id), [player.id]);
  const saveRate = player.saveRate ?? 0.17;
  const mult = saveRate / 0.17;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="hidden lg:flex flex-col gap-4 w-48 py-4 px-4 rounded-xl"
      style={{ borderRight: `2px solid ${teamColor}50` }}
    >
      <span className="font-heading text-xs tracking-[0.2em] text-coral uppercase text-right">Keeper Profile</span>

      <ComparisonBar
        label="Save Rate"
        leftValue={saveRate * 100}
        rightValue={(1 - saveRate) * 100}
        leftLabel={`${(saveRate * 100).toFixed(0)}%`}
        rightLabel={`${((1 - saveRate) * 100).toFixed(0)}%`}
        leftColor="#ff6b6b"
        rightColor="rgba(255,255,255,0.1)"
      />

      <ComparisonBar
        label="vs Average"
        leftValue={mult}
        rightValue={1}
        leftLabel={`${mult.toFixed(1)}x`}
        rightLabel="1.0x avg"
        leftColor="#ff6b6b"
        rightColor="rgba(255,255,255,0.15)"
      />

      <div className="flex justify-between text-foreground/40">
        <span className="text-[10px] font-noto uppercase tracking-wider">PKs Faced</span>
        <span className="font-heading text-sm">{player.penaltiesFaced ?? "—"}</span>
      </div>

      <div className="flex justify-between text-foreground/40">
        <span className="text-[10px] font-noto uppercase tracking-wider">Multiplier</span>
        <span className="font-heading text-sm" style={{ color: mult > 1.5 ? "#ff6b6b" : "inherit" }}>{mult.toFixed(2)}x</span>
      </div>

      {fact && (
        <div className="mt-1 pt-3 border-t border-white/5">
          <span className="text-[9px] font-noto uppercase tracking-wider text-coral/60">Did you know?</span>
          <p className="text-[11px] font-noto text-foreground/40 mt-1 leading-relaxed">{fact}</p>
        </div>
      )}
    </motion.div>
  );
}
