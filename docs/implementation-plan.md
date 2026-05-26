# Implementation Plan — Penalty Shootout Predictor

## Context

Portfolio project for FIFA 2026 World Cup. ~2 hour build. Spec finalized at `docs/specs/2026-05-25-penalty-predictor-design.md`. Next.js 15 + TypeScript, Framer Motion, Tailwind, SVG hexagonal heatmaps, research-backed probability model.

## Phase 1: Scaffold (10 min)

1. `npx create-next-app@latest . --typescript --tailwind --app --eslint`
2. Install deps: `framer-motion`
3. Git init + initial commit
4. Set up Google Fonts (Barlow Condensed + Noto Sans) in `layout.tsx`
5. Set up dark theme base in `globals.css` (charcoal background, FIFA 2026 color variables)
6. Create folder structure: `components/`, `data/`, `lib/`, `public/sounds/`

## Phase 2: Data Layer (35 min)

7. Define TypeScript types in `lib/types.ts` (Player, ZoneDistribution, Team, PressureMode)
8. Create `data/teams.json` — all 48 teams with FIFA code, flag emoji, confederation
9. Create `data/research-baselines.json` — foot-based default zone distributions + zone save difficulty table + keeper multiplier formula
10. Create `data/players.json` — ~216 players across all 48 teams
    - Research and populate using RotoWire, Oddspedia, FBRef, ThePuntersPage
    - Real conversion/save rates where available
    - Derived zone distributions based on dominant foot for the rest
    - Mark each player `source: "verified" | "derived"`
11. Create `data/quotes.json` — 15-20 quotes from World Cup legends

## Phase 3: Probability Engine (15 min)

12. `lib/probability.ts` — score probability calculation
    - Zone save difficulty constants
    - Keeper quality multiplier from save rate
    - Pressure mode modifiers
    - Overall P(score) formula
13. `lib/simulation.ts` — per-penalty simulation
    - Weighted random zone selection
    - Miss roll (with pressure modifier)
    - Same-zone save roll (zone difficulty × keeper multiplier)
    - Returns: { outcome: "goal" | "saved" | "miss", takerZone, keeperZone, missType? }

## Phase 4: Core Components (25 min)

14. `components/HexZone.tsx` — single SVG hexagon with dynamic fill color + hover label
15. `components/GoalVisualization.tsx` — SVG goal frame (neon glow) + 6 hex zones + dot history layer
16. `components/PenaltyAnimation.tsx` — Framer Motion ball trajectory + keeper gloves dive animation
17. `components/MissAnimation.tsx` — 4 miss variants (left post, right post, crossbar, over bar)
18. `components/ResultDisplay.tsx` — "GOAL!" / "SAVED!" / "MISS!" with Framer Motion entrance

## Phase 5: UI Components (20 min)

19. `components/MatchupSelector.tsx` — two cascading Team > Player dropdowns
20. `components/PressureToggle.tsx` — 3 pill buttons (Regular, Early, Decisive)
21. `components/SlotRoll.tsx` — vertical scroll animation for Randomise Matchup
22. `components/PlayerStats.tsx` — taker/keeper stat panels
23. `components/FootballerQuote.tsx` — quote with Framer Motion layout relocation animation
24. `components/SoundToggle.tsx` — mute/unmute speaker icon

## Phase 6: Page Assembly + Progressive Reveal (15 min)

25. `app/page.tsx` — compose all components
    - State management: selected taker, keeper, pressure mode, results history, sound on/off
    - Progressive reveal: AnimatePresence for goal viz + stats appearing on selection
    - Quote relocation trigger on player selection
    - Wire "Take Penalty" button to simulation engine
    - Wire "Clear" button to reset dots + result
    - Wire "Randomise Matchup" to random selection + slot animation

## Phase 7: Audio (5 min)

26. `lib/audio.ts` — preload + play sound effects
27. Source 4 royalty-free sound files (goal, save, post, over) — freesound.org or similar
28. Place in `public/sounds/`

## Phase 8: Polish + Responsive (10 min)

29. Mobile responsive tweaks (stacked layout, scaled goal)
30. Hover states, transitions, loading states
31. Favicon + meta tags + OG image for social sharing

## Phase 9: Deploy + README (10 min)

32. Create GitHub repo (`penalty-predictor`)
33. Write README with:
    - Screenshot/GIF of the app
    - "How the model works" section citing research sources
    - Live Vercel link
    - Tech stack badges
34. Deploy to Vercel
35. Final commit

## Build Order (critical path)

```
Types → Data JSON → Probability engine → GoalVisualization + HexZone
→ PenaltyAnimation + MissAnimation → MatchupSelector → Page assembly
→ Progressive reveal + quote → SlotRoll + Sound → Polish → Deploy
```

## Verification

- [ ] All 48 teams appear in dropdowns with correct players
- [ ] Selecting taker + keeper shows heatmap with correct zone colors
- [ ] Score probability updates with pressure mode changes
- [ ] "Take Penalty" produces weighted-random outcomes across repeated clicks
- [ ] Goal/save/miss animations play correctly with sound
- [ ] Stacked dots appear (max 5, oldest fades)
- [ ] Clear button resets dots but not player selection
- [ ] Randomise Matchup triggers slot animation and selects valid players
- [ ] Quote relocates to corner on player selection
- [ ] Mobile layout works
- [ ] Deployed and live on Vercel
