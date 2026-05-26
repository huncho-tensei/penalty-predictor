"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Player, PressureMode, PenaltyDot, SimulationResult } from "@/lib/types";
import { calculateScoreProbability } from "@/lib/probability";
import { simulatePenalty } from "@/lib/simulation";
import MatchupSelector, { getTeamFlag } from "@/components/MatchupSelector";
import GoalVisualization, { SVG_W, SVG_H } from "@/components/GoalVisualization";
import PenaltyAnimation from "@/components/PenaltyAnimation";
import ResultDisplay from "@/components/ResultDisplay";
import PlayerStats from "@/components/PlayerStats";
import PressureToggle from "@/components/PressureToggle";
import FootballerQuote from "@/components/FootballerQuote";
import players from "@/data/players.json";

const typedPlayers = players as Player[];
const takers = typedPlayers.filter((p) => p.role === "taker");
const keepers = typedPlayers.filter((p) => p.role === "keeper");

const MAX_DOTS = 5;

export default function Home() {
  const [taker, setTaker] = useState<Player | null>(null);
  const [keeper, setKeeper] = useState<Player | null>(null);
  const [pressure, setPressure] = useState<PressureMode>("regular");
  const [dots, setDots] = useState<PenaltyDot[]>([]);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const dotIdRef = useRef(0);

  const hasSelection = taker !== null && keeper !== null;

  const scoreProbability =
    hasSelection ? calculateScoreProbability(taker, keeper, pressure) : null;

  const handleRandomise = useCallback(() => {
    const randomTaker = takers[Math.floor(Math.random() * takers.length)];
    let randomKeeper = keepers[Math.floor(Math.random() * keepers.length)];
    while (randomKeeper.teamCode === randomTaker.teamCode) {
      randomKeeper = keepers[Math.floor(Math.random() * keepers.length)];
    }
    setTaker(randomTaker);
    setKeeper(randomKeeper);
    setResult(null);
    setShowResult(false);
  }, []);

  const handleTakePenalty = useCallback(() => {
    if (!taker || !keeper || isPlaying) return;

    const sim = simulatePenalty(taker, keeper, pressure);
    setResult(sim);
    setIsPlaying(true);
    setShowResult(false);

    setTimeout(() => {
      setShowResult(true);
    }, 1100);

    setTimeout(() => {
      dotIdRef.current += 1;
      const newDot: PenaltyDot = {
        id: dotIdRef.current,
        outcome: sim.outcome,
        zone: sim.takerZone,
        missType: sim.missType,
      };
      setDots((prev) => [...prev.slice(-(MAX_DOTS - 1)), newDot]);
      setIsPlaying(false);
    }, 1500);
  }, [taker, keeper, pressure, isPlaying]);

  const handleClear = useCallback(() => {
    setDots([]);
    setResult(null);
    setShowResult(false);
  }, []);

  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-10 gap-8">
      {/* Title */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1
          className="font-heading text-5xl sm:text-6xl text-gold tracking-wide"
          style={{
            WebkitTextStroke: "2.5px #ffd700",
            paintOrder: "stroke fill",
            textShadow: "0 0 40px rgba(255, 215, 0, 0.2)",
          }}
        >
          PENALTY SHOOTOUT PREDICTOR
        </h1>
        <p className="font-heading text-xl sm:text-2xl text-foreground/40 mt-2 tracking-[0.3em]">
          FIFA WORLD CUP 2026
        </p>
      </motion.div>

      {/* Quote */}
      <FootballerQuote minimized={hasSelection} />

      {/* Matchup Selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <MatchupSelector
          selectedTaker={taker}
          selectedKeeper={keeper}
          onTakerChange={setTaker}
          onKeeperChange={setKeeper}
          onRandomise={handleRandomise}
        />
      </motion.div>

      {/* Progressive reveal */}
      <AnimatePresence>
        {hasSelection && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-8 w-full"
          >
            {/* Player names — fight card style */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{getTeamFlag(taker.teamCode)}</span>
                <span className="font-heading text-2xl sm:text-3xl tracking-wider text-teal">{taker.name}</span>
              </div>
              <span className="font-heading text-lg text-foreground/15 tracking-widest">VS</span>
              <div className="flex items-center gap-2">
                <span className="font-heading text-2xl sm:text-3xl tracking-wider text-coral">{keeper.name}</span>
                <span className="text-3xl">{getTeamFlag(keeper.teamCode)}</span>
              </div>
            </div>
            <div className="w-full max-w-[400px] h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

            {/* Pressure Toggle */}
            <PressureToggle value={pressure} onChange={setPressure} />

            {/* Goal Visualization */}
            <div className="relative w-full max-w-[640px]">
              <GoalVisualization
                taker={taker}
                keeper={keeper}
                dots={dots}
                showOverlay={true}
              />
              <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H + 40}`}
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                <PenaltyAnimation result={result} isPlaying={isPlaying} />
              </svg>
            </div>

            {/* Result — broadcast lower-third */}
            <div className="min-h-[60px] w-full max-w-[640px]">
              <ResultDisplay outcome={result?.outcome ?? null} visible={showResult} />
            </div>

            {/* Stats */}
            <PlayerStats
              taker={taker}
              keeper={keeper}
              scoreProbability={scoreProbability}
            />

            {/* Action buttons */}
            <div className="flex gap-4 mt-2">
              <button
                onClick={handleTakePenalty}
                disabled={isPlaying}
                className="btn-heartbeat px-10 py-4 rounded-full bg-purple text-white font-heading text-2xl tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
              >
                TAKE PENALTY
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-4 rounded-full border border-white/10 text-foreground/40 font-heading text-lg tracking-wider transition-all duration-200 hover:border-white/20 hover:text-foreground/60"
              >
                CLEAR
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
