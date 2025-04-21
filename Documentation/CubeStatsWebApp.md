# CubeStats WebApp

## Purpose
A companion interface to explore data from the custom Magic: The Gathering cube draft system. The CubeStats WebApp provides analytics on card usage, pick behavior, and cube balance. Its primary use is to assist with cube tuning, card evaluation, and ongoing design decisions based on draft data.

## Accessed by
- Users navigating to the CubeStats web interface
- App fetches the latest `data.json` file from GitHub Pages on page load

## Frontend Stack
- Built with **React**
- Uses **Recharts** for charting (`BarChart`, `PieChart`, etc.)
- Styled with **Tailwind CSS**
- Navigation and view switching are handled via local state (`mode`) — no client-side routing or URLs

## Folder Structure Highlights
- `src/components/`: Shared UI components, charts, buttons, filters, navbar
- `src/Views/`: Contains the main views, conditionally rendered based on `mode`:
  - `Overview`
  - `ColorId` (Color Identity)
  - `DraftPool`
  - `Commander`
  - `NotDrafted`
  - `CardView` and `Home`

## Hosting & Deployment
- Hosted as a **static site** on Azure Free Tier Web App
- Built output (`dist/`) is deployed directly to the backend
- The Node.js backend is minimal: it fetches the `data.json` on load and serves it to the frontend
- No frontend rebuild is required when `data.json` is updated — the backend always fetches the most recent version

## Update Workflow for data
1. Run the ETL script to generate a new `data.json`
2. Push the updated file to GitHub Pages
3. On next app refresh, the backend fetches the fresh data and serves it to the React frontend

## Main Features

### Overview
- Shows average pick rates across color identities and draft pools
- Visualizes multicolor breakdowns to assess cube balance

### Color Identity View
- Groups cards by their color identity (single, two, or three-color)
- Displays both bottom 20 and top 20 cards by average pick rate after applying filters (e.g., mana value).
- Helps identify underused cards (bottom 20) and evaluate consistently high picks (top 20).
- Designed to highlight the extremes — useful for cube tuning, card swaps, or understanding player behavior.

### Draft Pool View
- Displays cards grouped by draft pool (`Red`, `Blue`, `Multicolor`, `Colorless`, `Lands`)
- After filtering (e.g., by mana value), shows the bottom and top 20 cards by pick rate to surface performance outliers.
- Useful for balancing pool content and ensuring representation across color and archetype boundaries.

### Commanders
- View all commanders by color identity, with draft pick data where available
- Includes a breakdown of card type distributions from all colors allowed under each commander's identity — useful for evaluating archetype support

### Not Drafted
- Lists all cube cards that haven’t yet appeared in a recorded draft
- Useful for identifying cards that are still untested or not selected during pack setup
- Helps guide future playtesting and cube adjustments

## Notes
- The app relies on `data.json` structure staying consistent — changes to the format should be mirrored in the frontend
- Designed to work seamlessly with the backend and ETL pipeline without live database access
