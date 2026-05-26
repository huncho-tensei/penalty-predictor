"use client";

import { motion } from "framer-motion";
import type { PressureMode } from "@/lib/types";

type PressureToggleProps = {
  value: PressureMode;
  onChange: (mode: PressureMode) => void;
};

const MODES: { key: PressureMode; label: string; sub: string }[] = [
  { key: "regular", label: "Regular", sub: "In-game" },
  { key: "early", label: "Early", sub: "Shootout 1-2" },
  { key: "decisive", label: "Decisive", sub: "Shootout 4-5" },
];

const MODE_INDEX: Record<PressureMode, number> = {
  regular: 0,
  early: 1,
  decisive: 2,
};

const ITEM_WIDTH = 120;
const GAP = 4;

export default function PressureToggle({ value, onChange }: PressureToggleProps) {
  const activeIndex = MODE_INDEX[value];
  const sliderX = activeIndex * (ITEM_WIDTH + GAP);

  return (
    <div className="flex items-center gap-3">
      <span className="font-heading text-xs tracking-[0.15em] text-foreground/25 uppercase hidden sm:block">
        Pressure
      </span>

      <div
        className="relative flex rounded-full bg-white/[0.04] border border-white/[0.06] p-1"
        style={{ gap: `${GAP}px` }}
      >
        {/* Sliding indicator */}
        <motion.div
          className="absolute top-1 bottom-1 rounded-full bg-purple"
          style={{ width: ITEM_WIDTH, boxShadow: "0 0 14px rgba(156, 39, 176, 0.4)" }}
          animate={{ x: sliderX }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />

        {/* Buttons */}
        {MODES.map((mode) => (
          <button
            key={mode.key}
            onClick={() => onChange(mode.key)}
            className="relative z-10 flex flex-col items-center justify-center rounded-full transition-colors duration-200"
            style={{ width: ITEM_WIDTH, padding: "6px 0" }}
          >
            <span
              className={`font-heading text-sm tracking-wide transition-colors duration-200 ${
                value === mode.key ? "text-white" : "text-foreground/40"
              }`}
            >
              {mode.label}
            </span>
            <span
              className={`text-[9px] font-noto transition-colors duration-200 ${
                value === mode.key ? "text-white/60" : "text-foreground/25"
              }`}
            >
              {mode.sub}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
