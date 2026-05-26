"use client";

import { useMemo } from "react";
import type { Player, PenaltyDot, ZoneDistribution } from "@/lib/types";
import HexZone from "./HexZone";

type GoalVisualizationProps = {
  taker: Player | null;
  keeper: Player | null;
  dots: PenaltyDot[];
  showOverlay: boolean;
};

const W = 540;
const H = 280;
const GOAL_X = 40;
const GOAL_Y = 30;
const GOAL_W = 460;
const GOAL_H = 200;
const POST = 8;

const HEX_SIZE = 40;

const ZONE_POSITIONS: Record<keyof ZoneDistribution, { cx: number; cy: number }> = {
  topLeft:      { cx: GOAL_X + GOAL_W * 0.18, cy: GOAL_Y + GOAL_H * 0.30 },
  topCenter:    { cx: GOAL_X + GOAL_W * 0.50, cy: GOAL_Y + GOAL_H * 0.30 },
  topRight:     { cx: GOAL_X + GOAL_W * 0.82, cy: GOAL_Y + GOAL_H * 0.30 },
  bottomLeft:   { cx: GOAL_X + GOAL_W * 0.18, cy: GOAL_Y + GOAL_H * 0.72 },
  bottomCenter: { cx: GOAL_X + GOAL_W * 0.50, cy: GOAL_Y + GOAL_H * 0.72 },
  bottomRight:  { cx: GOAL_X + GOAL_W * 0.82, cy: GOAL_Y + GOAL_H * 0.72 },
};

export const ZONE_POS = ZONE_POSITIONS;
export const SVG_W = W;
export const SVG_H = H;
export const GOAL_BOUNDS = { x: GOAL_X, y: GOAL_Y, w: GOAL_W, h: GOAL_H };

function dotColor(outcome: string): string {
  if (outcome === "goal") return "#76ff03";
  if (outcome === "saved") return "#ff6b6b";
  return "#555555";
}

function DotMarker({ dot, index }: { dot: PenaltyDot; index: number }) {
  const zone = ZONE_POSITIONS[dot.zone];
  if (!zone) return null;
  const seed = dot.id * 1337;
  const ox = ((seed % 30) - 15);
  const oy = (((seed * 7) % 26) - 13);
  const opacity = 0.5 + (index / 5) * 0.5;

  return (
    <g>
      <circle
        cx={zone.cx + ox}
        cy={zone.cy + oy}
        r={6}
        fill={dotColor(dot.outcome)}
        opacity={opacity}
      />
      <circle
        cx={zone.cx + ox}
        cy={zone.cy + oy}
        r={6}
        fill="none"
        stroke={dotColor(dot.outcome)}
        strokeWidth={2}
        opacity={opacity * 0.4}
      />
    </g>
  );
}

export default function GoalVisualization({
  taker,
  keeper,
  dots,
  showOverlay,
}: GoalVisualizationProps) {
  const netLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const cols = 16;
    const rows = 8;
    for (let i = 1; i < cols; i++) {
      const x = GOAL_X + POST + ((GOAL_W - POST * 2) / cols) * i;
      lines.push({ x1: x, y1: GOAL_Y + POST, x2: x, y2: GOAL_Y + GOAL_H });
    }
    for (let i = 1; i < rows; i++) {
      const y = GOAL_Y + POST + ((GOAL_H - POST) / rows) * i;
      lines.push({ x1: GOAL_X + POST, y1: y, x2: GOAL_X + GOAL_W - POST, y2: y });
    }
    return lines;
  }, []);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
      <defs>
        <filter id="post-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="blur1" />
          <feFlood floodColor="#ffd700" floodOpacity="0.5" result="c1" />
          <feComposite in="c1" in2="blur1" operator="in" result="g1" />
          <feGaussianBlur stdDeviation="12" result="blur2" in="SourceGraphic" />
          <feFlood floodColor="#ffd700" floodOpacity="0.2" result="c2" />
          <feComposite in="c2" in2="blur2" operator="in" result="g2" />
          <feMerge>
            <feMergeNode in="g2" />
            <feMergeNode in="g1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="post-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe44d" />
          <stop offset="50%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#b8960f" />
        </linearGradient>
        <linearGradient id="ground-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a3a1a" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0a0a0f" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="goal-depth" cx="50%" cy="30%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
        </radialGradient>
      </defs>

      {/* Ground */}
      <rect
        x={0}
        y={GOAL_Y + GOAL_H - 2}
        width={W}
        height={50}
        fill="url(#ground-grad)"
      />
      <line
        x1={20}
        y1={GOAL_Y + GOAL_H}
        x2={W - 20}
        y2={GOAL_Y + GOAL_H}
        stroke="#2a5a2a"
        strokeWidth={2}
        opacity={0.5}
      />

      {/* Goal interior depth */}
      <rect
        x={GOAL_X + POST}
        y={GOAL_Y + POST}
        width={GOAL_W - POST * 2}
        height={GOAL_H - POST}
        fill="url(#goal-depth)"
        rx={2}
      />

      {/* Net mesh */}
      {netLines.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="rgba(255, 215, 0, 0.04)"
          strokeWidth={0.5}
        />
      ))}

      {/* Hex zones */}
      {taker && keeper && (
        <g>
          {(Object.keys(ZONE_POSITIONS) as (keyof ZoneDistribution)[]).map(
            (zone) => (
              <HexZone
                key={zone}
                zone={zone}
                takerProb={taker.zones[zone]}
                keeperProb={keeper.zones[zone]}
                cx={ZONE_POSITIONS[zone].cx}
                cy={ZONE_POSITIONS[zone].cy}
                size={HEX_SIZE}
                showOverlay={showOverlay}
              />
            )
          )}
        </g>
      )}

      {/* Penalty dots */}
      {dots.map((dot, i) => (
        <DotMarker key={dot.id} dot={dot} index={i} />
      ))}

      {/* Goal frame — rendered last so it's on top */}
      <g filter="url(#post-glow)">
        <rect
          x={GOAL_X}
          y={GOAL_Y}
          width={GOAL_W}
          height={POST}
          fill="url(#post-grad)"
          rx={3}
        />
        <rect
          x={GOAL_X}
          y={GOAL_Y}
          width={POST}
          height={GOAL_H}
          fill="url(#post-grad)"
          rx={3}
        />
        <rect
          x={GOAL_X + GOAL_W - POST}
          y={GOAL_Y}
          width={POST}
          height={GOAL_H}
          fill="url(#post-grad)"
          rx={3}
        />
      </g>

      {/* Post caps (circular ends) */}
      <circle cx={GOAL_X + 4} cy={GOAL_Y + GOAL_H} r={5} fill="url(#post-grad)" filter="url(#post-glow)" />
      <circle cx={GOAL_X + GOAL_W - 4} cy={GOAL_Y + GOAL_H} r={5} fill="url(#post-grad)" filter="url(#post-glow)" />
    </svg>
  );
}
