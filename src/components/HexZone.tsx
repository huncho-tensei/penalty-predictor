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
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return points.join(" ");
}

function probToTakerColor(prob: number): string {
  const alpha = Math.max(0.1, Math.min(0.85, prob * 2.5));
  return `rgba(0, 188, 212, ${alpha})`;
}

function probToKeeperColor(prob: number): string {
  const alpha = Math.max(0.1, Math.min(0.85, prob * 2.5));
  return `rgba(255, 107, 107, ${alpha})`;
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
  const points = hexPoints(cx, cy, size);

  return (
    <g>
      <motion.polygon
        points={points}
        fill={probToTakerColor(takerProb)}
        stroke="rgba(0, 188, 212, 0.3)"
        strokeWidth={1}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
      {showOverlay && (
        <motion.polygon
          points={points}
          fill={probToKeeperColor(keeperProb)}
          stroke="rgba(255, 107, 107, 0.3)"
          strokeWidth={1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        />
      )}
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        fill="white"
        fontSize={11}
        fontFamily="var(--font-heading)"
        opacity={0.9}
      >
        {(takerProb * 100).toFixed(0)}%
      </text>
      {showOverlay && (
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fill="rgba(255, 107, 107, 0.9)"
          fontSize={9}
          fontFamily="var(--font-noto)"
        >
          {(keeperProb * 100).toFixed(0)}%
        </text>
      )}
    </g>
  );
}
