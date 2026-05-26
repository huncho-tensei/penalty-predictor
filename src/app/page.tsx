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
import { TakerSideStats, KeeperSideStats } from "@/components/SideStats";
import players from "@/data/players.json";

const typedPlayers = players as Player[];
const takers = typedPlayers.filter((p) => p.role === "taker");
const keepers = typedPlayers.filter((p) => p.role === "keeper");

const MAX_DOTS = 5;

export default function Home() {
  const [taker, setTaker] = useState<Player | null>(null);
  const [keeper, setKeeper] = useState<Player | null>(null);
  const [matchupConfirmed, setMatchupConfirmed] = useState(false);
  const [pressure, setPressure] = useState<PressureMode>("regular");
  const [dots, setDots] = useState<PenaltyDot[]>([]);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const dotIdRef = useRef(0);

  const selectionRef = useRef<HTMLDivElement>(null);
  const arenaRef = useRef<HTMLDivElement>(null);

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
    setMatchupConfirmed(false);
    setResult(null);
    setShowResult(false);
    setDots([]);
  }, []);

  const handleConfirmMatchup = useCallback(() => {
    if (!hasSelection) return;
    setMatchupConfirmed(true);
    setResult(null);
    setShowResult(false);
    setDots([]);
    setTimeout(() => {
      arenaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [hasSelection]);

  const handleReselect = useCallback(() => {
    setResult(null);
    setShowResult(false);
    setDots([]);
    selectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      setMatchupConfirmed(false);
    }, 700);
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
    <>
      {/* ========== SCREEN 1: MATCHUP SELECTION ========== */}
      <section
        ref={selectionRef}
        className="relative flex flex-col items-center justify-center min-h-screen px-4 py-10 gap-8"
      >
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
        <FootballerQuote minimized={false} />

        {/* Matchup Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <MatchupSelector
            selectedTaker={taker}
            selectedKeeper={keeper}
            onTakerChange={(p) => { setTaker(p); setMatchupConfirmed(false); }}
            onKeeperChange={(p) => { setKeeper(p); setMatchupConfirmed(false); }}
            onRandomise={handleRandomise}
          />
        </motion.div>

        {/* Confirm button */}
        <AnimatePresence>
          {hasSelection && !matchupConfirmed && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              onClick={handleConfirmMatchup}
              className="btn-heartbeat px-10 py-4 rounded-full bg-purple text-white font-heading text-2xl tracking-widest"
            >
              SELECT MATCHUP
            </motion.button>
          )}
        </AnimatePresence>

        {/* Preview of selection */}
        <AnimatePresence>
          {hasSelection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-4 sm:gap-6"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getTeamFlag(taker!.teamCode)}</span>
                <span className="font-heading text-xl sm:text-2xl tracking-wider text-teal">{taker!.name}</span>
              </div>
              <span className="font-heading text-sm text-foreground/15 tracking-widest">VS</span>
              <div className="flex items-center gap-2">
                <span className="font-heading text-xl sm:text-2xl tracking-wider text-coral">{keeper!.name}</span>
                <span className="text-2xl">{getTeamFlag(keeper!.teamCode)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GitHub credit */}
        <a
          href="https://github.com/huncho-tensei"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-6 left-6 font-noto text-[11px] text-foreground/20 hover:text-foreground/40 transition-colors duration-200 tracking-wider"
        >
          built by <span className="text-foreground/30 hover:text-purple">@huncho-tensei</span>
        </a>

        {/* Scroll hint */}
        {matchupConfirmed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="absolute bottom-6 font-noto text-xs text-foreground/30 tracking-wider"
          >
            SCROLL DOWN TO ARENA
          </motion.div>
        )}
      </section>

      {/* ========== SCREEN 2: PENALTY ARENA ========== */}
      {matchupConfirmed && taker && keeper && (
        <section
          ref={arenaRef}
          className="relative flex flex-col items-center min-h-screen px-4 py-10 gap-8 overflow-hidden"
        >
          {/* Stadium ambience background */}
          <div
            className="absolute inset-0 z-0 opacity-[0.04]"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 80% 40% at 50% 60%, rgba(255, 200, 80, 0.5) 0%, transparent 50%),
                radial-gradient(ellipse 30% 50% at 10% 50%, rgba(255, 210, 100, 0.3) 0%, transparent 60%),
                radial-gradient(ellipse 30% 50% at 90% 50%, rgba(255, 210, 100, 0.3) 0%, transparent 60%),
                radial-gradient(ellipse 100% 30% at 50% 100%, rgba(40, 100, 40, 0.8) 0%, transparent 50%)
              `,
              filter: "blur(40px)",
            }}
          />
          {/* Stadium edge shapes */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent z-10" />

          {/* Fight card header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-4 sm:gap-8">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{getTeamFlag(taker.teamCode)}</span>
                <span className="font-heading text-3xl sm:text-4xl tracking-wider text-teal">{taker.name}</span>
              </div>
              <span className="font-heading text-xl text-foreground/15 tracking-widest">VS</span>
              <div className="flex items-center gap-3">
                <span className="font-heading text-3xl sm:text-4xl tracking-wider text-coral">{keeper.name}</span>
                <span className="text-4xl">{getTeamFlag(keeper.teamCode)}</span>
              </div>
            </div>
            <div className="w-full max-w-[500px] h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
          </motion.div>

          {/* Pressure Toggle */}
          <div className="relative z-10">
            <PressureToggle value={pressure} onChange={setPressure} />
          </div>

          {/* Goal + Side Stats */}
          <div className="relative z-10 flex items-center justify-center gap-6 w-full">
            <TakerSideStats player={taker} opponent={keeper} />

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

            <KeeperSideStats player={keeper} opponent={taker} />
          </div>

          {/* Result — broadcast lower-third */}
          <div className="relative z-10 min-h-[60px] w-full max-w-[640px]">
            <ResultDisplay outcome={result?.outcome ?? null} visible={showResult} />
          </div>

          {/* Stats */}
          <div className="relative z-10">
            <PlayerStats
              taker={taker}
              keeper={keeper}
              scoreProbability={scoreProbability}
            />
          </div>

          {/* Action buttons */}
          <div className="relative z-10 flex gap-4 mt-2">
            <button
              onClick={handleReselect}
              className="px-6 py-4 rounded-full border border-white/10 text-foreground/40 font-heading text-base tracking-wider transition-all duration-200 hover:border-white/20 hover:text-foreground/60"
            >
              RE-SELECT
            </button>
            <button
              onClick={handleTakePenalty}
              disabled={isPlaying}
              className="btn-heartbeat px-10 py-4 rounded-full bg-purple text-white font-heading text-2xl tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
            >
              TAKE PENALTY
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-4 rounded-full border border-white/10 text-foreground/40 font-heading text-base tracking-wider transition-all duration-200 hover:border-white/20 hover:text-foreground/60"
            >
              CLEAR
            </button>
          </div>
        </section>
      )}
    </>
  );
}
