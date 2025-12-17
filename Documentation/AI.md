# LLM-Based NPC Drafters

## Purpose
Provides AI-powered opponents for the MTG Commander Cube draft when human players are unavailable. NPCs use an LLM backend to make strategic picks, analyze their card pools, build game plans, and generate post-draft write-ups — simulating a thoughtful human drafter.

## Accessed by
- Draft hosts via the lobby interface (add/remove NPC buttons)
- The Node.js backend, which manages NPC lifecycle and triggers LLM calls

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     NPC Lifecycle                           │
├─────────────────────────────────────────────────────────────┤
│  addNPC() ──► 200ms interval ──► processNPC() loop          │
│                                    │                        │
│                ┌───────────────────┼───────────────┐        │
│                ▼                   ▼               ▼        │
│          Has cards?           No cards?      Deckbuilding?  │
│                │                   │               │        │
│                ▼                   ▼               ▼        │
│           NPCPick()         analyzePool()    createWriteUp()│
│                │                   │               │        │
│                ▼                   ▼               ▼        │
│         pickCardWithLLM    analyzePoolWithLLM   cleanup     │
│                                    │                        │
│                          ┌─────────┴─────────┐              │
│                          ▼                   ▼              │
│                      Tool calls          Summary            │
│                   (tag, game plan)     (for picker)         │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### NPC.js — Lifecycle Management

Handles NPC creation, removal, and the main processing loop.

**Key Functions:**

- `addNPC(draft)` — Assigns a random name from a predefined pool, creates a unique UUID, and starts the 200ms processing interval.
- `removeNPC(draft)` — Cleans up intervals, aborts pending operations, and removes state.
- `processNPC(npcUUID, draft)` — Main tick function that routes to picking, analysis, or write-up generation based on draft state.

**NPC State Flags:**
- `isPicking` — Currently making a pick (prevents overlapping calls)
- `isAnalyzing` — Currently running pool analysis
- `analysisComplete` — Analysis finished, waiting for next pack
- `hasCardsToPickFrom` — Pack is available; when set during analysis, allows one final iteration but signals the LLM to produce a summary for the picker rather than making more tool calls
- `reassess_game_plans` — Triggers deeper strategic evaluation at pack boundaries

### LLMCalls.js — LLM Interaction Layer

Bridges the NPC logic and the LLM backend.

- `pickCardWithLLM(pickData)` — Sends pack contents and game plan context to the LLM. Returns a card ID, reasoning, and optional tags.
- `analyzePoolWithLLM(seat, npcUUID)` — Runs an iterative analysis loop (up to 5 calls) where the LLM can make tool calls to tag cards, create game plans, and refine strategy before returning a summary.

### Caller.js — API Communication

Manages the actual LLM API calls with retry logic and structured output parsing.

- Uses **Zod schemas** for type-safe response parsing (`Pick`, `Analysis`, `ToolCall`)
- Implements **rate limit handling** with automatic retry and backoff
- Includes a **30-second timeout** per call to prevent hangs
- `createWriteUp(seat, npcUUID)` — Generates a post-draft summary (3-minute timeout for longer output)

### Client.js — Load Balancing

Rotates through multiple Azure OpenAI endpoints to distribute rate limits.

- Seven regional endpoints (France, Germany, Italy, Poland, Sweden, Spain, Switzerland)
- Round-robin selection via `nextClientIndex()`
- Each call uses a fresh client instance

### Tools.js — In-Draft Tool Execution

Executes tool calls returned by the analysis LLM.

**Available Tools:**

| Tool | Purpose |
|------|---------|
| `tag_cards` | Apply functional tags (removal, ramp, etc.) to cards |
| `add_game_plan` | Create a strategy around 1-2 commanders |
| `update_game_plan` | Modify tags or description of existing plan |
| `remove_game_plan` | Delete a plan (moved to `past_game_plans`) |
| `remove_tags_from_cards` | Clear tags for re-evaluation |

**Commander Validation:**
- Validates partner legality based on custom house rules
- Tracks invalid pairings in `incompatible_commanders` to prevent repeated attempts
- Computes combined color identity for valid pairs

## Prompt System

Prompts are stored as markdown files in `service/AI/prompts/` and loaded via `PromptReader.js`.

| Prompt | Purpose |
|--------|---------|
| `pick_a_card.md` | Instructions for making a single pick |
| `analyzer.md` | Pool analysis and game plan management |
| `tools.md` | Tool definitions and usage guidelines |
| `default_commander_rule.md` | House rules for partner commanders |
| `writeup.md` | Post-draft summary generation |

The analyzer prompt includes stage-specific guidance (early/mid/late draft) and handles the `reassess_game_plans` flag for periodic strategic review.

## NPC Behavior

### Pick Phase
1. Check if pack has cards
2. If only one card remains, auto-pick it
3. Otherwise, call `pickCardWithLLM()` with:
   - Available cards in pack
   - Active game plans with color identities
   - Tags already in use
   - Analysis summary (if available)
4. Apply any tags returned by the LLM
5. Fall back to random pick if LLM fails

### Analysis Phase
1. Triggered when no pack is available and analysis isn't complete
2. Runs up to 5 iterations of `analyzePoolWithLLM()`
3. Each iteration can make tool calls (tag cards, manage game plans)
4. Bad tool calls are collected and fed back for correction
5. Ends when `analysis_ready: true` or cards arrive
6. Final summary stored on seat for picker context

### Write-Up Phase
1. Triggered when draft reaches `deckbuilding` state
2. Saves draft pool to file via `saveDraftPool()`
3. Generates write-up via `createWriteUp()`
4. Cleans up interval and state

## Fallback Behavior

The system degrades gracefully:
- **LLM timeout** — Falls back to random pick
- **Rate limiting** — Retries up to 5 times with parsed wait times
- **Invalid response** — Catches parse errors, uses random pick
- **Tool call failures** — Collects bad calls, reports back to LLM for correction

## Configuration

Environment variables required:
- `MODEL` — Azure OpenAI model deployment name
- `ENDPOINT_*` / `KEY_*` — Credentials for each regional endpoint (France, Germany, Italy, Poland, Sweden, Spain, Switzerland)

## Output Files

NPCs generate files in the `./drafts/` directory:
- `{npcUUID}_pool.json` — Final draft pool (via `saveDraftPool()`)
- `{npcUUID}_writeup.txt` — Post-draft analysis

## Notes
- NPCs use the same seat structure as human players, making them interchangeable from the draft engine's perspective
- The 200ms tick rate balances responsiveness with API call efficiency
- Game plan limit (3) prevents cognitive overload in the prompts while allowing strategic flexibility
- Tags are the primary mechanism for tracking synergies — the LLM is instructed to tag aggressively since game plan statistics depend on them