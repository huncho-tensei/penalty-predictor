# Penalty Shootout Predictor

Predict penalty outcomes between any two players from the **2026 FIFA World Cup**. Pick a taker, pick a keeper, and watch a research-backed probability model simulate the penalty with animated visuals.

**[Live Demo](https://penalty-predictor-ivory.vercel.app)**

## What It Does

- Select from **all 48 qualified teams** and **145 real players** (97 penalty takers, 48 goalkeepers)
- View a **hexagonal heatmap** showing where the taker shoots and where the keeper dives
- Simulate penalties with **context-aware animations** — top corners rocket straight in, center shots curve
- Three **pressure modes** (Regular, Shootout Early, Shootout Decisive) backed by real tournament data
- **Broadcast-style result bar** slides in for GOAL / SAVED / MISSED outcomes
- Side panels with **comparison bars**, keeper multipliers, and **"Did you know?"** facts for top players

## How the Model Works

Each penalty simulation follows 5 steps:

1. **Miss check** — roll against the taker's miss rate (avg ~15%, higher under pressure). If miss → ball hits post, crossbar, or sails over.
2. **Taker shoots** — weighted random selection from their 6-zone distribution (derived from dominant foot + published research).
3. **Keeper dives** — independent weighted random selection from their dive tendency distribution.
4. **Different zones** → GOAL (keeper guessed wrong).
5. **Same zone** → roll against `zone_difficulty × keeper_multiplier`. Top corners are ~8% saveable. Bottom center is ~40%.

### Zone Save Difficulty

| Zone | Save chance (correct dive) |
|------|---------------------------|
| Top corners | 8% |
| Top center | 12% |
| Bottom corners | 30% |
| Bottom center | 40% |

### Keeper Quality Multiplier

```
multiplier = player_save_rate / league_average (0.17)
```

Alisson (41% save rate) = **2.41x**. Dibu Martinez (33%) = **1.94x**. Average keeper = **1.0x**.

### Pressure Modes

| Mode | Avg conversion | Source |
|------|---------------|--------|
| Regular | 82.3% | FIFA data 1978–2022 |
| Shootout Early | 79.3% | PLOS One 2024 |
| Shootout Decisive | 70.2% | Opta Analyst |

### Model Validation

Monte Carlo simulation (10,000 penalties per matchup) confirms the probability calculations are accurate within 0.5%. Full analysis in [`docs/model-analysis.md`](docs/model-analysis.md).

## Data Sources

- **Player assignments**: [RotoWire 2026 WC Penalty Takers](https://www.rotowire.com/soccer/article/2026-world-cup-penalty-corner-and-free-kick-takers-by-team-114076)
- **Conversion/save rates**: FBRef, Transfermarkt, ThePuntersPage, Oddspedia
- **Zone distributions**: Understat (verified players), MDPI laterality study + Bruin Sports Analytics (derived)
- **Zone difficulty**: PLOS One 2024, ResearchGate height-category studies
- **Pressure modifiers**: Opta Analyst, PLOS One alternating-order study
- **Squads**: Official FIFA/ESPN squad announcements (May 2026)

Players marked `verified` have real per-player stats. Players marked `derived` use research-backed distributions based on their dominant foot.

## Tech Stack

- **Next.js 16** + TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations (ball trajectory, keeper dive, pressure slider, progressive reveal)
- **SVG** for goal visualization, hexagonal heatmap, net mesh, penalty dots
- **Vercel** for deployment

## Run Locally

```bash
git clone https://github.com/huncho-tensei/penalty-predictor.git
cd penalty-predictor
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/           — Next.js App Router (single page)
  components/    — React components (GoalVisualization, HexZone, PenaltyAnimation, etc.)
  data/          — Static JSON (145 players, 48 teams, research baselines, quotes)
  lib/           — Probability engine, simulation, types, team colors, fun facts
docs/
  specs/         — Design specification
  model-analysis.md — Full Monte Carlo validation and player rankings
```
