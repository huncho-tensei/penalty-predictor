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
  const points = hexPoints(cx, cy, size);
  const innerPoints = hexPoints(cx, cy, size - 3);
  const isHot = takerProb >= 0.25;
  const takerAlpha = Math.max(0.08, Math.min(0.7, takerProb * 2));
  const keeperAlpha = Math.max(0.08, Math.min(0.5, keeperProb * 2));
  const glowIntensity = isHot ? takerProb * 8 : 0;
  const uniqueId = `hex-${zone}`;

  return (
    <g>
      <defs>
        <radialGradient id={`${uniqueId}-taker`} cx="40%" cy="35%">
          <stop offset="0%" stopColor={`rgba(0, 220, 255, ${takerAlpha * 1.3})`} />
          <stop offset="100%" stopColor={`rgba(0, 140, 170, ${takerAlpha * 0.4})`} />
        </radialGradient>
        <radialGradient id={`${uniqueId}-keeper`} cx="60%" cy="65%">
          <stop offset="0%" stopColor={`rgba(255, 100, 100, ${keeperAlpha * 1.2})`} />
          <stop offset="100%" stopColor={`rgba(200, 40, 40, ${keeperAlpha * 0.3})`} />
        </radialGradient>
        {isHot && (
          <filter id={`${uniqueId}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={glowIntensity} result="blur" />
            <feFlood floodColor="#00bcd4" floodOpacity="0.3" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      {/* Outer border glow */}
      <motion.polygon
        points={points}
        fill="none"
        stroke="rgba(0, 188, 212, 0.15)"
        strokeWidth={2}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Taker fill */}
      <motion.polygon
        points={innerPoints}
        fill={`url(#${uniqueId}-taker)`}
        stroke="rgba(0, 188, 212, 0.25)"
        strokeWidth={1}
        filter={isHot ? `url(#${uniqueId}-glow)` : undefined}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Keeper overlay */}
      {showOverlay && (
        <motion.polygon
          points={innerPoints}
          fill={`url(#${uniqueId}-keeper)`}
          stroke="rgba(255, 107, 107, 0.2)"
          strokeWidth={1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        />
      )}

      {/* Taker percentage */}
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fill="white"
        fontSize={12}
        fontWeight="bold"
        fontFamily="var(--font-heading)"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
      >
        {(takerProb * 100).toFixed(0)}%
      </text>

      {/* Keeper percentage */}
      {showOverlay && (
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fill="#ff6b6b"
          fontSize={9}
          fontFamily="var(--font-noto)"
          opacity={0.8}
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
        >
          {(keeperProb * 100).toFixed(0)}%
        </text>
      )}
    </g>
  );
}
