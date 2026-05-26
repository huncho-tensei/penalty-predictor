# Penalty Predictor — Model Analysis & Baseline Stats

Generated 2026-05-26. Based on 145 players (97 takers, 48 keepers) across all 48 World Cup teams.

## Global Statistics (Regular Pressure)

- **Total possible matchups:** 4,559
- **Average score probability:** 82.3%
- **Median score probability:** 82.2%
- **Standard deviation:** 3.9%
- **Range:** 68.4% – 92.0%

## Pressure Mode Calibration

| Mode | Model avg | Real-world target | Source |
|------|-----------|-------------------|--------|
| Regular | 82.3% | 79–82% | FIFA data 1978–2022 |
| Early (shootout kicks 1-2) | 79.3% | ~79% | PLOS One 2024 |
| Decisive (shootout kicks 4-5) | 70.2% | 65–70% | Opta Analyst, PLOS One |

Modifiers applied:
- Regular: base miss rate, 1.0x keeper
- Early: miss +3%, keeper +0.05x
- Decisive: miss +12%, keeper +0.20x

## Monte Carlo Validation (10,000 penalties per matchup)

### Elite Matchups — Regular Pressure

| Taker | Keeper | Predicted | Simulated (10k) |
|-------|--------|-----------|-----------------|
| Kane | Dibu Martinez | 84.9% | 84.4% |
| Messi | Pickford | 77.5% | 77.1% |
| Palmer | Kim Seung-gyu | 91.9% | 91.8% |
| Foster | Alisson | 69.6% | 69.9% |
| Mbappé | Maignan | 81.8% | 82.2% |
| Haaland | Diogo Costa | 85.3% | 85.2% |
| Ronaldo | Dibu Martinez | 81.2% | 80.9% |
| Salah | Alisson | 77.1% | 77.2% |
| Bruno | Livaković | 87.0% | 87.0% |
| Çalhanoğlu | Kobel | 89.9% | 89.6% |

### Elite Matchups — Decisive Pressure

| Taker | Keeper | Simulated (10k) |
|-------|--------|-----------------|
| Kane | Dibu Martinez | 73.4% |
| Messi | Pickford | 65.1% |
| Palmer | Kim Seung-gyu | 80.1% |
| Foster | Alisson | 58.6% |
| Mbappé | Maignan | 69.3% |
| Haaland | Diogo Costa | 73.0% |
| Ronaldo | Dibu Martinez | 69.2% |
| Salah | Alisson | 65.7% |
| Bruno | Livaković | 74.8% |
| Çalhanoğlu | Kobel | 77.6% |

## Aggregate Outcome Distribution (100k sampled sims per mode)

| Mode | Goals | Saved | Missed |
|------|-------|-------|--------|
| Regular | 82.3% | 7.3% | 10.4% |
| Early | 79.6% | 7.0% | 13.5% |
| Decisive | 70.2% | 7.2% | 22.6% |

Key insight: saves stay roughly constant (~7%) across pressure modes. The drop in goals under pressure comes almost entirely from increased misses — consistent with research showing players sky penalties more under pressure, not that keepers improve.

## Score Probability Distribution (Regular, all 4,559 matchups)

```
60-65%  |      0
65-70%  |     16  ▏
70-75%  |    110  ██
75-80%  |    942  █████████████████████
80-85%  |  2,614  █████████████████████████████████████████████████████████
85-90%  |    780  █████████████████
90-95%  |     97  ██
95-100% |      0
```

Distribution is roughly normal, centered at 82%, with thin tails. No matchup exceeds 92% or drops below 68%.

## Taker Rankings (avg score prob across all keepers)

| Rank | Player | Team | Conv. Rate | Avg Goal% | Source |
|------|--------|------|-----------|-----------|--------|
| 1 | Cole Palmer | ENG | 90% | 90.7% | verified |
| 2 | Hakan Çalhanoğlu | TUR | 89% | 89.9% | verified |
| 3 | Harry Kane | ENG | 88% | 89.2% | verified |
| 4 | Bruno Fernandes | POR | 88% | 88.9% | verified |
| 5 | Viktor Gyökeres | SWE | 88% | 88.7% | verified |
| 6 | Kendry Páez | ECU | 88% | 88.5% | derived |
| 7 | Brahim Díaz | MAR | 88% | 88.3% | derived |
| 8 | Erling Haaland | NOR | 87% | 87.9% | verified |
| 9 | Omar Marmoush | EGY | 87% | 87.6% | verified |
| 10 | Romelu Lukaku | BEL | 87% | 87.5% | verified |

## Keeper Rankings (avg goal% scored against, lower = better)

| Rank | Player | Team | Save Rate | Avg Goal% Against | Source |
|------|--------|------|-----------|-------------------|--------|
| 1 | Alisson | BRA | 41% | 75.1% | verified |
| 2 | Emiliano Martínez | ARG | 33% | 77.9% | verified |
| 3 | Diogo Costa | POR | 27% | 79.8% | verified |
| 4 | Dominik Livaković | CRO | 26% | 80.2% | verified |
| 5 | Jordan Pickford | ENG | 25% | 80.2% | verified |
| 6 | Yassine Bounou | MAR | 25% | 80.4% | verified |
| 7 | Ronwen Williams | RSA | 23% | 81.1% | derived |
| 8 | Alireza Beiranvand | IRN | 23% | 81.1% | verified |
| 9 | Marc-André ter Stegen | GER | 22% | 81.5% | verified |
| 10 | Mike Maignan | FRA | 21% | 81.8% | verified |

## Elite Taker vs Elite Keeper Grid (Regular Pressure)

|  | Dibu | Pickford | Alisson | Maignan | D. Costa | Kobel | Livaković | Beiranvand | Bounou |
|--|------|----------|---------|---------|----------|-------|-----------|------------|--------|
| Kane | 84.9% | 87.3% | 82.2% | 88.7% | 86.8% | 89.1% | 87.1% | 88.0% | 87.3% |
| Ronaldo | 81.2% | 83.6% | 78.6% | 84.9% | 83.0% | 85.3% | 83.4% | 84.2% | 83.6% |
| Messi | 75.4% | 77.5% | 72.9% | 79.1% | 77.2% | 79.5% | 77.6% | 78.5% | 77.8% |
| Mbappé | 78.0% | 80.4% | 75.4% | 81.8% | 79.9% | 82.2% | 80.2% | 81.1% | 80.4% |
| Salah | 79.8% | 82.0% | 77.1% | 83.7% | 81.7% | 84.1% | 82.1% | 83.0% | 82.3% |
| Haaland | 83.3% | 85.6% | 80.5% | 87.4% | 85.3% | 87.8% | 85.7% | 86.7% | 85.9% |
| Bruno | 84.4% | 87.0% | 81.6% | 88.4% | 86.4% | 88.8% | 86.7% | 87.6% | 86.9% |
| Palmer | 85.9% | 88.3% | 83.0% | 90.1% | 88.0% | 90.6% | 88.4% | 89.4% | 88.6% |
| Çalhanoğlu | 85.4% | 88.0% | 82.6% | 89.4% | 87.4% | 89.9% | 87.7% | 88.7% | 88.0% |
| Gyökeres | 84.1% | 86.7% | 81.2% | 88.2% | 86.1% | 88.6% | 86.5% | 87.4% | 86.7% |

## Zone Save Difficulty (base save chance when keeper dives correctly)

| Zone | Base save % | Source |
|------|------------|--------|
| Top-left | 8% | Upper third ~9.1%, PLOS One |
| Top-center | 12% | Central but high |
| Top-right | 8% | Mirror of top-left |
| Bottom-left | 30% | Medium height ~33.5% |
| Bottom-center | 40% | Easiest zone |
| Bottom-right | 30% | Mirror of bottom-left |

## Keeper Quality Multiplier Formula

```
keeper_multiplier = player_save_rate / 0.17 (league average)
effective_save_chance = min(base_zone_difficulty × keeper_multiplier, 0.95)
```

| Keeper | Save Rate | Multiplier |
|--------|-----------|-----------|
| Alisson | 41% | 2.41x |
| Dibu Martinez | 33% | 1.94x |
| Diogo Costa | 27% | 1.59x |
| Pickford | 25% | 1.47x |
| Maignan | 21% | 1.24x |
| Courtois | 17% | 1.00x |
| Average | 17% | 1.00x |

## Data Sources

- Conversion/save rates: FBRef, Transfermarkt, ThePuntersPage, Oddspedia
- Penalty taker assignments: RotoWire 2026 WC breakdown
- Zone difficulty: PLOS One 2024, ResearchGate height-category studies
- Pressure modifiers: Opta Analyst World Cup shootout data, PLOS One
- Foot-based distributions: MDPI laterality study, Bruin Sports Analytics
