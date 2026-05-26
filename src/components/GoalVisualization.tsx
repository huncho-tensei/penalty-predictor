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

const W = 560;
const H = 290;
const GOAL_X = 50;
const GOAL_Y = 30;
const GOAL_W = 460;
const GOAL_H = 200;
const POST = 7;

const HEX_SIZE = 40;

const ZONE_POSITIONS: Record<keyof ZoneDistribution, { cx: number; cy: number }> = {
  topLeft:      { cx: GOAL_X + GOAL_W * 0.18, cy: GOAL_Y + GOAL_H * 0.28 },
  topCenter:    { cx: GOAL_X + GOAL_W * 0.50, cy: GOAL_Y + GOAL_H * 0.28 },
  topRight:     { cx: GOAL_X + GOAL_W * 0.82, cy: GOAL_Y + GOAL_H * 0.28 },
  bottomLeft:   { cx: GOAL_X + GOAL_W * 0.18, cy: GOAL_Y + GOAL_H * 0.70 },
  bottomCenter: { cx: GOAL_X + GOAL_W * 0.50, cy: GOAL_Y + GOAL_H * 0.70 },
  bottomRight:  { cx: GOAL_X + GOAL_W * 0.82, cy: GOAL_Y + GOAL_H * 0.70 },
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

function DotMarker({ dot, index, total }: { dot: PenaltyDot; index: number; total: number }) {
  const zone = ZONE_POSITIONS[dot.zone];
  if (!zone) return null;
  const seed = dot.id * 1337;
  const ox = ((seed % 30) - 15);
  const oy = (((seed * 7) % 26) - 13);
  const opacity = 0.4 + (index / total) * 0.6;

  return (
    <g>
      <circle cx={zone.cx + ox} cy={zone.cy + oy} r={4} fill="black" opacity={0.3} />
      <circle cx={zone.cx + ox} cy={zone.cy + oy - 1} r={5} fill={dotColor(dot.outcome)} opacity={opacity} />
      <circle cx={zone.cx + ox - 1.5} cy={zone.cy + oy - 3} r={1.5} fill="white" opacity={opacity * 0.4} />
    </g>
  );
}

export default function GoalVisualization({
  taker,
  keeper,
  dots,
  showOverlay,
}: GoalVisualizationProps) {
  const netV = useMemo(() => {
    const lines: { x: number }[] = [];
    const cols = 20;
    for (let i = 1; i < cols; i++) {
      lines.push({ x: GOAL_X + POST + ((GOAL_W - POST * 2) / cols) * i });
    }
    return lines;
  }, []);

  const netH = useMemo(() => {
    const lines: { y: number }[] = [];
    const rows = 10;
    for (let i = 1; i < rows; i++) {
      lines.push({ y: GOAL_Y + POST + ((GOAL_H - POST) / rows) * i });
    }
    return lines;
  }, []);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[680px]">
      <defs>
        {/* Post neon glow */}
        <filter id="post-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="b1" />
          <feFlood floodColor="#ffd700" floodOpacity="0.35" result="c1" />
          <feComposite in="c1" in2="b1" operator="in" result="g1" />
          <feGaussianBlur stdDeviation="14" result="b2" in="SourceGraphic" />
          <feFlood floodColor="#ffd700" floodOpacity="0.12" result="c2" />
          <feComposite in="c2" in2="b2" operator="in" result="g2" />
          <feMerge>
            <feMergeNode in="g2" />
            <feMergeNode in="g1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Floodlight glow from top */}
        <radialGradient id="floodlight" cx="50%" cy="0%">
          <stop offset="0%" stopColor="rgba(255, 220, 120, 0.07)" />
          <stop offset="60%" stopColor="rgba(255, 200, 80, 0.02)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Post gradient — white with metallic sheen */}
        <linearGradient id="post-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d4d4d4" />
          <stop offset="30%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f0f0f0" />
          <stop offset="100%" stopColor="#b0b0b0" />
        </linearGradient>
        <linearGradient id="crossbar-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#e8e8e8" />
          <stop offset="100%" stopColor="#c0c0c0" />
        </linearGradient>

        {/* Net depth shading */}
        <linearGradient id="net-depth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
        </linearGradient>

        {/* Grass gradient */}
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e5a1e" stopOpacity="0.7" />
          <stop offset="30%" stopColor="#174517" stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* Floodlight wash */}
      <rect x={0} y={0} width={W} height={H} fill="url(#floodlight)" />

      {/* Grass floor — aligned to goal width */}
      <rect x={GOAL_X - 10} y={GOAL_Y + GOAL_H} width={GOAL_W + 20} height={50} fill="url(#grass)" />
      <line x1={GOAL_X - 10} y1={GOAL_Y + GOAL_H + 1} x2={GOAL_X + GOAL_W + 10} y2={GOAL_Y + GOAL_H + 1} stroke="#2d6b2d" strokeWidth={1.5} opacity={0.6} />

      {/* Goal interior — dark depth */}
      <rect
        x={GOAL_X + POST}
        y={GOAL_Y + POST}
        width={GOAL_W - POST * 2}
        height={GOAL_H - POST}
        fill="url(#net-depth)"
        rx={1}
      />

      {/* Net mesh — vertical */}
      {netV.map((l, i) => (
        <line
          key={`nv-${i}`}
          x1={l.x} y1={GOAL_Y + POST}
          x2={l.x} y2={GOAL_Y + GOAL_H}
          stroke="rgba(200, 200, 200, 0.06)"
          strokeWidth={0.7}
        />
      ))}
      {/* Net mesh — horizontal */}
      {netH.map((l, i) => (
        <line
          key={`nh-${i}`}
          x1={GOAL_X + POST} y1={l.y}
          x2={GOAL_X + GOAL_W - POST} y2={l.y}
          stroke="rgba(200, 200, 200, 0.06)"
          strokeWidth={0.7}
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
        <DotMarker key={dot.id} dot={dot} index={i} total={dots.length} />
      ))}

      {/* Goal frame — white metallic posts with neon gold glow */}
      <g filter="url(#post-glow)">
        {/* Crossbar */}
        <rect x={GOAL_X} y={GOAL_Y} width={GOAL_W} height={POST} fill="url(#crossbar-metal)" rx={3} />
        {/* Left post */}
        <rect x={GOAL_X} y={GOAL_Y} width={POST} height={GOAL_H} fill="url(#post-metal)" rx={3} />
        {/* Right post */}
        <rect x={GOAL_X + GOAL_W - POST} y={GOAL_Y} width={POST} height={GOAL_H} fill="url(#post-metal)" rx={3} />
      </g>

      {/* Post base — ground contact circles */}
      <ellipse cx={GOAL_X + 3.5} cy={GOAL_Y + GOAL_H + 1} rx={5} ry={2} fill="rgba(255,255,255,0.15)" />
      <ellipse cx={GOAL_X + GOAL_W - 3.5} cy={GOAL_Y + GOAL_H + 1} rx={5} ry={2} fill="rgba(255,255,255,0.15)" />

      {/* Penalty spot */}
      <circle cx={W / 2} cy={GOAL_Y + GOAL_H + 25} r={3} fill="white" opacity={0.3} />
    </svg>
  );
}
