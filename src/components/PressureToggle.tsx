"use client";

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

export default function PressureToggle({ value, onChange }: PressureToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-heading text-xs tracking-[0.15em] text-foreground/25 uppercase hidden sm:block">Pressure</span>
      {MODES.map((mode) => (
        <button
          key={mode.key}
          onClick={() => onChange(mode.key)}
          className={`
            px-4 py-2 rounded-full text-sm font-noto transition-all duration-200
            ${
              value === mode.key
                ? "bg-purple text-white shadow-[0_0_12px_rgba(156,39,176,0.4)]"
                : "bg-white/5 text-foreground/50 hover:bg-white/10 hover:text-foreground/70"
            }
          `}
        >
          <span className="font-heading text-base tracking-wide">{mode.label}</span>
          <span className="block text-[10px] text-foreground/40">{mode.sub}</span>
        </button>
      ))}
    </div>
  );
}
