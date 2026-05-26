# Penalty Shootout Predictor — Design Spec

## Overview

Interactive web app that predicts penalty shootout outcomes between any two players from the 2026 FIFA World Cup. Users select a penalty taker from one team and a goalkeeper from another, then see a hexagonal heatmap of shot/dive tendencies and an animated simulation of the penalty.

Built as a portfolio piece to demonstrate frontend engineering, data visualization, and sports analytics thinking.

## Tech Stack

- **Framework:** Next.js 15 + TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Visualization:** SVG (inline, no charting library)
- **Audio:** HTML5 Audio (net swish, thud, post clang)
- **Fonts:** Barlow Condensed (headlines/stats) + Noto Sans (body/labels) via Google Fonts
- **Deployment:** Vercel
- **Data:** Static JSON dataset in-repo

## Visual Design

### Color Palette (FIFA World Cup 2026 multicolor system)

| Role | Color | Usage |
|------|-------|-------|
| Background | Dark charcoal / near-black | Base layer |
| Primary accent | Gold (#FFD700 range) | Score probability, headlines, key highlights |
| Taker heatmap | Teal/turquoise gradient | Shot placement zones |
| Keeper heatmap | Coral/red gradient | Dive tendency zones |
| Buttons/interactive | Purple | Hover states, active toggles, CTAs |
| Goal indicator | Lime green | Goal dots, success states |
| Save indicator | Coral | Save dots |
| Miss indicator | Grey | Miss dots |

Inspired by the FIFA 2026 multicolor brand system (coral, turquoise, purple, lime green) used in fan-facing tournament materials.

### Typography

- **Headlines, stats, player names, results (GOAL!, SAVED!):** Barlow Condensed — bold, condensed, sporty. Closest free match to the proprietary FWC 2026 geometric font.
- **Body text, labels, descriptions:** Noto Sans — the actual official secondary font of the 2026 World Cup. Clean and readable.

### Goal Frame

Neon/glowing outlined edges on dark background. No realistic textures — the hexagons and animations are the visual focus. Data-viz aesthetic over football-pitch realism.

### Button Style

Rounded pill-shaped buttons with soft hover transitions. Purple fill with gold or white text.

### Layout Behavior

Progressive reveal:
1. Initial state: title + footballer quote + team/player selectors only
2. On player selection: goal visualization, pressure toggle, and stats animate in
3. On "Take Penalty": animation plays, result appears, dot stacks

### Footballer Quote

- Displays below the title on page load
- Random quote from a World Cup legend on each reload
- When user selects both players, the quote smoothly animates (Framer Motion layout animation) to a small corner position and stays there at reduced size
- Quotes sourced from well-known World Cup participants (Pele, Maradona, Zidane, Messi, Ronaldo, etc.)

## Data

### Scope

All 48 qualified teams. Per team:
- Top 3 penalty takers (designated or historically most frequent)
- Top 1-2 goalkeepers (starting GK + backup if notable)

Total: ~144 takers, ~72 keepers, ~216 players.

### Data Sources

#### Tier 1 — Player selection + conversion rates
- **RotoWire WC 2026 Penalty Takers** — designated penalty taker for every team, organized by group
- **Oddspedia WC 2026 Penalty Cheat Sheet** — career penalty accuracy, consistency ratings
- **ThePuntersPage Penalty Stats** — player-level conversion rates across 60+ leagues
- **Fantasy Football Pundit Penalty DB** — historical penalty stats database

#### Tier 2 — Deeper stats (career records, save rates)
- **FBRef** — career penalty stats per player (taken, scored, saved for keepers). Top 5 leagues + internationals.
- **Transfermarkt** — career penalty records per player profile
- **SofaScore** — match-level penalty data, player career stats

#### Tier 3 — Shot placement / zone distributions
- **Understat** — shot-level x/y coordinates including penalties, Big 5 leagues since 2014
- **soccerdata Python package** — unified scraper for FBRef, Understat, WhoScored, SofaScore

#### Tier 4 — Keeper-specific
- **BeSoccer Penalties Saved Rankings** — league-by-league keeper save rankings
- **GiveMeSport Keeper Rankings** — career save rates for top keepers

#### Research baselines (for derived distributions)
- PLOS One 2024 study — penalty height-category save rates
- ResearchGate — zone-by-zone save probability tables
- Northwestern Sports Analytics — World Cup penalty shootout data
- Bruin Sports Analytics — penalty placement math
- MDPI laterality study — foot-based directional tendencies

### Data Workflow

1. **Player selection:** RotoWire + Oddspedia to identify 3 takers + 1-2 keepers per team
2. **Conversion/save rates:** FBRef + ThePuntersPage + Transfermarkt for real numbers
3. **Zone distributions:** Understat for top players with enough penalty data. Research-backed foot-based defaults for the rest.
4. **Cross-reference:** SofaScore/BeSoccer to verify numbers aren't stale
5. **Rosters:** Official FIFA/ESPN squad announcements. Update JSON as final squads drop.

### Player Data Model

```ts
type Player = {
  id: string                    // kebab-case: "lionel-messi"
  name: string                  // "Lionel Messi"
  team: string                  // "Argentina"
  teamCode: string              // "ARG" (FIFA code)
  role: "taker" | "keeper"
  foot: "left" | "right"
  penaltiesTaken?: number       // career penalties taken (takers)
  penaltiesFaced?: number       // career penalties faced (keepers)
  conversionRate?: number       // 0-1, takers only
  saveRate?: number             // 0-1, keepers only
  zones: ZoneDistribution       // probability per hex zone
  source: "verified" | "derived" // whether stats are player-specific or foot-based
}

type ZoneDistribution = {
  topLeft: number
  topCenter: number
  topRight: number
  bottomLeft: number
  bottomCenter: number
  bottomRight: number
}
// All values 0-1, must sum to 1.0
```

### Data File Structure

```
data/
  players.json          // all ~216 players
  teams.json            // 48 teams with flag emoji, FIFA code, group
  research-baselines.json  // foot-based default distributions + sources
  quotes.json           // footballer quotes for the home screen
```

## Probability Model

### Step-by-step simulation (per penalty click)

```
1. Roll miss chance:
   - Base miss rate derived from (1 - conversionRate) adjusted for on-target saves
   - Average ~15%, modified by pressure mode
   - If MISS → play dedicated miss animation (post/crossbar/over bar)

2. If on target, roll taker's shot zone:
   - Weighted random selection from taker's 6-zone distribution

3. Roll keeper's dive zone:
   - Weighted random selection from keeper's 6-zone distribution (independent)

4. If keeper dives to DIFFERENT zone → GOAL

5. If keeper dives to SAME zone:
   - Roll against: base_save_chance[zone] × keeper_quality_multiplier
   - Cap save probability at 95% (nothing is guaranteed)
   - Result: GOAL or SAVED
```

### Zone Save Difficulty (when keeper dives correctly)

Derived from academic research on shot height and placement:

| Zone | Base save chance | Rationale |
|------|-----------------|-----------|
| Top-left | 8% | Upper third saves at ~9.1% per research |
| Top-center | 12% | Slightly more reachable than corners |
| Top-right | 8% | Mirror of top-left |
| Bottom-left | 30% | Medium height saves at ~33.5% |
| Bottom-center | 40% | Easiest zone — central and low |
| Bottom-right | 30% | Mirror of bottom-left |

### Keeper Quality Multiplier

Derived from real save rate vs. league average (17%):

```
keeper_multiplier = player_save_rate / 0.17
```

Applied as: `effective_save_chance = base_save_chance[zone] × keeper_multiplier`
Capped at 95%.

### Pressure Modes

Three modes, all research-backed (PLOS One 2024, Opta Analyst):

| Mode | Label | Context | Miss rate modifier | Keeper modifier |
|------|-------|---------|-------------------|-----------------|
| 1 | Regular Penalty | In-game spot kick (~80% conversion) | Base (~15%) | 1.0x |
| 2 | Shootout (Early) | Kicks 1-2 in a shootout (~79% conversion) | +2% | +0.05x |
| 3 | Shootout (Decisive) | Kicks 4-5, must score (~65-70% conversion) | +8% | +0.15x |

### Score Probability Display

Pre-simulation probability shown before clicking "Take Penalty":

```
P(score) = (1 - miss_rate) × SUM over all zones [
  P(taker_zone) × (1 - P(keeper_zone) × effective_save_chance[zone])
]
```

Displayed as a percentage with one decimal place.

## UI Layout

### Screen: Home / Matchup Selector

Single-page app with progressive reveal.

```
+-------------------------------------------------------+
|              PENALTY SHOOTOUT PREDICTOR                |
|              FIFA World Cup 2026                       |
|                                                       |
|    "Some people think football is a matter of         |
|     life and death..." — Bill Shankly                 |
+-------------------------------------------------------+
|                                                       |
|   [Team Dropdown] > [Player Dropdown]                 |
|           PENALTY TAKER                               |
|                                                       |
|         [ RANDOMISE MATCHUP ]                         |
|                                                       |
|   [Team Dropdown] > [Player Dropdown]                 |
|           GOALKEEPER                                  |
|                                                       |
+- - - - - BELOW REVEALS ON SELECTION - - - - - - - - -+
|                                                       |
|  Pressure: [ Regular ] [ Early ] [ Decisive ]         |
|                                                       |
|              [ GOAL VISUALIZATION ]                   |
|              (neon frame + hex heatmap)                |
|              (stacked penalty dots, max 5)            |
|                                                       |
|            Score Probability: 74%                     |
|                                                       |
|        [ TAKE PENALTY ]     [ CLEAR ]                 |
|                                                       |
+-------------------------------------------------------+
|   Taker Stats        |     Keeper Stats               |
|   Penalties: 42      |     Penalties Faced: 38        |
|   Conversion: 84%    |     Save Rate: 26%             |
|   Source: Verified    |     Source: Derived             |
+-------------------------------------------------------+
```

### Matchup Selector

- Two cascading dropdowns: Team > Player
- Teams sorted alphabetically, grouped by confederation
- Players show name + role indicator
- Selecting both a taker and keeper triggers the progressive reveal

### Randomise Matchup Button

- Selects a random taker from any team and a random keeper from any other team
- Player names animate with a vertical slot-machine scroll effect (Framer Motion layout animation) before landing on final selection
- Slot roll duration: ~1.5s with easing deceleration

### Goal Visualization (SVG)

- Goal frame rendered as SVG with neon/glowing outlined edges
- Interior divided into 6 hexagonal zones (2 rows x 3 columns)
- Heatmap coloring per zone:
  - Taker: teal/turquoise gradient (darker = higher probability of shooting there)
  - Keeper: coral/red gradient (darker = higher probability of diving there)
  - Overlay mode to show both simultaneously
- Zones show percentage labels on hover
- Stacked penalty dots: last 5 results shown as small colored dots (lime green = goal, coral = saved, grey = miss) at the position the ball landed. Oldest fades out when 6th penalty is taken.

### Animation Sequence

Triggered by "Take Penalty" button:

1. **Reset** (0ms): Clear previous result text (dots persist)
2. **Heatmap fade-in** (0-400ms): Hex zones color in with taker tendencies
3. **Keeper overlay** (400-700ms): Keeper dive tendencies overlay appears
4. **Ball fires** (700-1100ms): Ball SVG animates from penalty spot to target zone
5. **Keeper dives** (700-1100ms, simultaneous): Keeper gloves SVG animate to their dive zone
6. **Result** (1100-1500ms): "GOAL!", "SAVED!", or "MISS!" with sound effect
7. **Dot added** (1500ms): Small dot appears on the goal at the ball's landing position

### Miss Animations (dedicated)

When a miss is rolled, one of these plays randomly:
- Ball hits left post (rebounds off frame)
- Ball hits right post (rebounds off frame)
- Ball hits crossbar (bounces down/away)
- Ball sails over the bar (flies up and out of frame)

Each has a distinct sound effect (metallic clang for post/bar, whoosh for over).

### Sound Effects

- **Goal:** Net swish / crowd roar
- **Saved:** Thud / catch sound
- **Post/crossbar:** Metallic clang
- **Over bar:** Whoosh
- Muted by default with a speaker toggle icon (respects user preference)

### Clear Button

Resets: all stacked dots, result text, and animation state. Does not reset the selected players or pressure mode.

## Component Architecture

```
app/
  layout.tsx              // root layout, fonts, metadata
  page.tsx                // single page app
components/
  MatchupSelector.tsx     // team + player dropdowns + randomise button
  GoalVisualization.tsx   // SVG goal + hex heatmap + dot history
  HexZone.tsx             // individual hexagon with color + label
  PenaltyAnimation.tsx    // ball + keeper animation layer
  MissAnimation.tsx       // post/crossbar/over animations
  ResultDisplay.tsx       // goal/save/miss outcome
  PlayerStats.tsx         // stats panel below visualization
  PressureToggle.tsx      // 3-button pressure mode selector
  SlotRoll.tsx            // slot machine name animation for randomise
  SoundToggle.tsx         // mute/unmute control
  FootballerQuote.tsx     // quote display with relocation animation
data/
  players.json
  teams.json
  research-baselines.json
  quotes.json
lib/
  probability.ts          // score probability calculation
  simulation.ts           // weighted random zone selection + outcome resolution
  types.ts                // shared TypeScript types
  audio.ts                // sound effect loading and playback
public/
  sounds/
    goal.mp3
    save.mp3
    post.mp3
    over.mp3
```

## Responsive Behavior

- Desktop: side-by-side stat panels below the goal
- Mobile: stacked layout, goal scales down, dropdowns go full-width
- Goal SVG uses viewBox for fluid scaling

## Scope Boundaries

### In scope
- All 48 teams, ~216 players with real/derived penalty data
- FIFA 2026 multicolor visual identity
- Hexagonal heatmap with teal (taker) / coral (keeper) gradients
- Neon goal frame on dark background
- Research-backed probability model with zone difficulty + keeper quality
- Three pressure modes (Regular, Shootout Early, Shootout Decisive)
- Animated penalty simulation with 3 outcomes (goal/save/miss)
- Dedicated miss animations (post, crossbar, over)
- Randomise Matchup with slot-machine animation
- Progressive reveal UI
- Footballer quote (prominent → corner on interaction)
- Stacked penalty dots (last 5) + clear button
- Sound effects (muted by default)
- Responsive single-page design
- Deployed to Vercel
- README with GIF demo + model explanation + live link

### Out of scope
- User accounts or saved matchups
- Full shootout simulation (5-round series) — single penalty only for v1
- Backend / API — everything is client-side with static JSON
- Real-time data updates — JSON is a snapshot, updated manually
- Player photos — text names only (avoids licensing issues)

## Deployment

- Vercel via `vercel` CLI or GitHub integration
- No environment variables needed
- Static JSON bundled at build time via Next.js imports

## Open Decisions

None — all decisions resolved during brainstorming.
