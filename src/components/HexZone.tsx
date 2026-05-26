"use client";

import { motion } from "framer-motion";
import type { ZoneDistribution } from "@/lib/types";

type HexZoneProps = {
  zone: keyof ZoneDistribution;
  takerProb: number;
  keeperProb: number;
  cx: number;
  cy: number;
  size: number;
  showOverlay: boolean;
};

function hexPoints(cx: number, cy: number, size: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    points.push(`${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`);
  }
  return points.join(" ");
}

export default function HexZone({
  zone,
  takerProb,
  keeperProb,
  cx,
  cy,
  size,
  showOverlay,
}: HexZoneProps) {
  const outerPts = hexPoints(cx, cy, size);
  const innerPts = hexPoints(cx, cy, size - 2);
  const isHot = takerProb >= 0.20;
  const takerAlpha = Math.max(0.06, Math.min(0.65, takerProb * 2.2));
  const keeperAlpha = Math.max(0.06, Math.min(0.45, keeperProb * 2));
  const uid = `hz-${zone}`;

  return (
    <g className={isHot ? "hex-hot" : ""}>
      <defs>
        <radialGradient id={`${uid}-t`} cx="40%" cy="30%">
          <stop offset="0%" stopColor={`rgba(0, 230, 255, ${takerAlpha * 1.4})`} />
          <stop offset="70%" stopColor={`rgba(0, 150, 180, ${takerAlpha * 0.5})`} />
          <stop offset="100%" stopColor={`rgba(0, 80, 100, ${takerAlpha * 0.15})`} />
        </radialGradient>
        <radialGradient id={`${uid}-k`} cx="60%" cy="70%">
          <stop offset="0%" stopColor={`rgba(255, 110, 110, ${keeperAlpha * 1.3})`} />
          <stop offset="100%" stopColor={`rgba(180, 40, 40, ${keeperAlpha * 0.2})`} />
        </radialGradient>
      </defs>

      {/* Outer edge — faint border */}
      <motion.polygon
        points={outerPts}
        fill="none"
        stroke={isHot ? "rgba(0, 220, 255, 0.2)" : "rgba(255, 255, 255, 0.06)"}
        strokeWidth={1.5}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Taker fill */}
      <motion.polygon
        points={innerPts}
        fill={`url(#${uid}-t)`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      {/* Keeper overlay */}
      {showOverlay && (
        <motion.polygon
          points={innerPts}
          fill={`url(#${uid}-k)`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        />
      )}

      {/* Taker % */}
      <text
        x={cx}
        y={cy - 3}
        textAnchor="middle"
        fill="white"
        fontSize={isHot ? 13 : 11}
        fontWeight="bold"
        fontFamily="var(--font-heading)"
        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
      >
        {(takerProb * 100).toFixed(0)}%
      </text>

      {/* Keeper % */}
      {showOverlay && (
        <text
          x={cx}
          y={cy + 13}
          textAnchor="middle"
          fill="#ff6b6b"
          fontSize={9}
          fontFamily="var(--font-noto)"
          opacity={0.75}
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}
        >
          {(keeperProb * 100).toFixed(0)}%
        </text>
      )}
    </g>
  );
}
