# Database Content Service (DCS)

## Purpose
Provides a command-line interface for maintaining the cube contents in the PostgreSQL database. Enables controlled editing of card data and commander configuration, ensuring consistency and preventing accidental corruption.

## Accessed by
- Local administrators via terminal
- Direct connection to the local PostgreSQL instance

## Features & Modules

### 1. Add Cards to the Database
- Offers a sub-interface with options to add a single card or multiple cards.
- **Single card mode:**  
  - Prompts for a card name.
  - Queries the [Scryfall API](https://scryfall.com/docs/api) to fetch card data.
  - If a unique match is found and the card is not already in the database, it's added.
- **Multiple cards mode:**  
  - Reads a `.txt` file containing card names.
  - Performs the same process with rate limiting to respect API guidelines.

### 2. Search for Cards in the Database
- Allows searching by:
  - Card type
  - Oracle text
  - Card name (exact or partial match)
- If the result set contains fewer than 100 cards, prints a formatted list of names.

### 3. Remove Cards from the Database
 - Supports both single and bulk deletion modes.
 - Single mode:
   - Prompts for a card_id.
   - Deletes the card entry from the database if it exists.
 - Bulk mode:
   - Accepts a `.txt` file containing a list of card_ids.
   - Iterates through the list and deletes each valid entry.

Designed to prevent accidental deletions by requiring exact `card_id`s and disallowing partial matches or names.

### 4. Manage Commanders
- Adds or removes entries in the `commanders` table by linking existing `card_id`s.
- Ensures only cards already in the database can be selected as commanders.

### 5. Change Draft Pool of a Card
- Updates a card’s pool assignment to control how it is distributed across draft packs.
- Pools include color categories, multicolor, lands, and colorless.

### 6. Print Cube Contents
 - Exports a file named `cube.txt` listing all cards currently in the cube, grouped into two sections:
   - Commanders — fetched from the commanders table via a join with the cards table, ordered alphabetically.
   - Other cards — all cards not flagged as commanders, ordered by draft_pool and name.

 - Output format uses simple left-aligned text columns for readability:
   - Commanders: indented under their own section
   - Other cards: prefixed by their `draft_pool` (e.g. "R Lightning Bolt")

 - The resulting file serves multiple purposes:
   - Quick reference for play
   - Cube export for review
   - Inventory management for the physical cube

 - The output order mirrors the way the physical cube is stored, ensuring a one-to-one match between digital and physical organization.

### 7. Inspect Cube Contents
 - Provides a quick, console-based statistical overview of the cube’s composition.
 - Useful for spot-checking balance between pools, color identity distribution, and commander availability — even though more detailed analysis is available in the CubeStats web app.

The following summaries are printed to the terminal:

 - Draft Pool Sizes
   - Counts how many cards are assigned to each draft_pool (e.g., Red, Green, Multicolor, etc.).
   - Outputs pool names using readable labels (e.g., "Multicolor" instead of "M"), ordered by descending size.

 - Multicolor Breakdown
   - Shows the distribution of color_identity values within the multicolor pool.
   - Helps track how evenly colors are represented across multicolored cards.

 - Commander Overview
   - Prints the total number of commanders.
   - Outputs color identity distribution across the commander pool, grouped and sorted by count.

This feature is primarily intended for local maintenance and sanity-checks, especially before running drafts or making bulk edits.

## Notes
- The service is modular and interactive — all actions are performed via numbered menu selections in the CLI.
- Relies on PostgreSQL’s integrity constraints to prevent invalid state changes.
- Designed to minimize direct SQL use by wrapping all actions in Python logic and user prompts.

