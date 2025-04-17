# CubeStatsData ETL

## Purpose
Extracts and transforms draft data from the local PostgreSQL database into a static JSON file (`data.json`) that powers the CubeStats web application. This enables lightweight, read-only statistics rendering in the browser with no live database connection.

## Accessed by
- Manually executed from the local machine (for now)
- Consumes data from the same PostgreSQL instance used by the draft app

## Output
- `data.json`, structured for use by the CubeStats frontend
- Currently hosted on GitHub Pages

## Structure of `data.json`

### 1. `aggregates`
Precomputed statistics used for visual summaries and charts.

- `color_id_averages`:  
  Average pick rate per color identity across all drafted cards.
- `draft_pool_averages`:  
  Pick rate averages broken down by `draft_pool`.
- `color_distribution_of_multi`:  
  Counts of each color combination within the **multicolor** draft pool.
- `color_distribution_of_commanders`:  
  Distribution of color identities among available commanders.

### 2. `cards`
Detailed card-level information used for filtering and display in the frontend.

- `drafted_cards`:  
  Cards that have been drafted in recorded sessions.
  Draft data is based on these cards.
- `cards_not_drafted`:  
  Cards in the cube that have not yet appeared in any recorded draft setup.
  These cards haven't been part of the draft pool due to the cube's large size and the limited number of recorded drafts so far.

### 3. `colors`
Used by the frontend to build color filters, color identity breakdowns, and aggregate stats.

- `picked_commander_color_ids`:  
  All color identities that have been present as commanders in drafts.
- `picked_multicolor_color_ids`:  
  Multicolor identities that have appeared in drafts.
- `single_color_ids`, `two_color_ids`, `three_color_ids`:  
  Categorized color identities based on number of colors.
- `not_picked_color_ids`:  
  Color combinations of the cards that have not yet appeared in any draft. May change between updates.

## Update Process
- The script is run manually from the local machine.
- Reads from the `drafts`, `picked_packs`, `picked_commander_packs`, `cards`, and `commanders` tables.
- Generates **temporary tables** to simplify querying:
  - `temp_picked_cards`:  
    Expands each `picked_packs` row into 15 individual picks, tracking `pick` order, `draft_pool`, and `color_identity`.
  - `temp_picked_commanders`:  
    Similar unpacking logic for 5-card commander picks.
- SQL queries group and aggregate data to compute pick averages and color identity distributions.
- The results are structured into a nested dictionary and written to `data.json`.
- This file is then pushed to GitHub Pages, where it is accessed by the CubeStats frontend.

## Notes
- Designed for static deployment — does not require live database access by the frontend.
- SQL queries used in the ETL process are stored in a separate file in the repository for reference.
- The output format is tightly coupled with the CubeStats frontend; any structural changes should be made with care.
- In the future, this ETL process may be automated via a scheduled script or CI workflow.
