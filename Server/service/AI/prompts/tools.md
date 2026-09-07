## Tools

Your tools are designed to enhance the data of your draft pool for better analysis.

You have the following tools at your disposal:

### `tag_cards`

**Description:**  
Tag cards in your pool to help identify synergies and categories.

You don't need to tag basic card types (creature, instant, etc.) - this is provided automatically.

You generally don't need to tag colors either - color identity is already part of the card data and game plan stats filter by color automatically. Only include color in a tag if the strategy specifically cares about color (e.g., `black_devotion`, `green_creature_for_selvala`).

**Good tags to use:**
- Functional categories: `removal`, `ramp`, `card_draw`, `board_wipe`, `counterspell`, `tutor`
- Synergy roles: `lifegain_enabler`, `lifegain_payoff`, `sacrifice_fodder`, `sacrifice_outlet`
- Specific strategies: `power_2_or_less` (for Alesha), `enters_the_battlefield`, `graveyard_recursion`

**Tagging guidelines:**
- Distinguish enablers from payoffs (e.g., `lifegain_enabler` vs `lifegain_payoff`)
- Only tag both if the card genuinely excels at both roles
- Add specific tags as your strategy develops

**Args:**
- `card_ids`: array of card IDs to tag
- `tag`: the tag to apply (snake_case, max 30 chars)

### `add_game_plan`

**Description:**  
Choose a commander or commander pair and define their game plan with relevant tags.

Pick your commander(s) from `legends_in_pool`. To lead with a pair, use one of the entries in `legal_partner_pairings`. Those pairings are already validated as legal under the active house rule, so you never need to reason about color counts, Gods, or partner eligibility yourself — if a pair isn't in that list, it isn't legal, and you should not try it. (Constructing an illegal pair by raw IDs anyway will simply be rejected)

**`add_game_plan` is create-only.** Your existing game plans persist between picks — they are shown back to you every analysis in `game_plans`, and any pair you already run is flagged `already_a_game_plan: true` in `legal_partner_pairings`. Only call `add_game_plan` for a commander or pair you are **not** already running. Never re-add a plan you already have to "re-affirm" or "confirm" it — the plan is already saved, so re-adding does nothing but waste an action. To change an existing plan's tags or description, use `update_game_plan`; to drop it, use `remove_game_plan`.

A created game plan includes:
- The commanders and their combined color identity
- Your description of the strategy
- Automatic stats: card type breakdown (creatures, instants, etc.) for cards in colors
- Tag breakdown: count for each relevant tag you specify (shows zeros too)

**Note:** Maximum 3 active game plans. Use `remove_game_plan` to make room for new ones.

**Relevant tags:**
You don't need to include card types (creature, instant, etc.) - type breakdown is provided automatically.

Focus on tags that define the strategy:
- Functional categories: `removal`, `ramp`, `card_draw`, `board_wipe`, `counterspell`, `tutor`
- Synergy roles: `lifegain_enabler`, `lifegain_payoff`, `sacrifice_fodder`, `sacrifice_outlet`
- Specific strategies: `power_2_or_less`, `enters_the_battlefield`, `graveyard_recursion`

Include tags you want to track for this game plan. The tag breakdown will show how many cards in colors have each tag, including zeros - useful for identifying gaps.

For example, a Yarok ETB deck might use: `["enters_the_battlefield", "flicker", "ramp", "card_draw", "removal"]`

**Args:**
- `commander_ids`: array of card IDs (1 or 2) of the commanders
- `relevant_tags`: array of tags to track for this game plan (max 30 chars each)
- `game_plan`: one or two paragraph explanation of the strategy and what to prioritize

## Choosing a commander (or pair)

You are given two precomputed fields, both derived under the active house rule:

- `legends_in_pool` — every legendary creature you've drafted, with its color identity, color count, whether it's a God, and whether it's already in a game plan.
- `legal_partner_pairings` — every pair of your legends that is legal to run together. Each entry lists the two commanders, their combined `color_identity`, the `colors` count, `already_a_game_plan` (true if you're already running this exact pair), and `upgrades_single_plan` (present when one of the pair is a commander you currently run *solo*).

Because legality is handled for you, your only job is to choose well from these lists. You do not evaluate partner rules.

**Prefer a pair over a single commander.** Two commanders means two cards of built-in value, redundancy if one is removed, and wider color access. Whenever `legal_partner_pairings` is non-empty, a pair is your default; lead with a lone commander only when no legal pairing exists, or when every available pairing would stretch you into colors that hurt the deck more than they help.

**When a pairing shows `upgrades_single_plan`, it is a strict upgrade over that single plan.** The pair contains a commander you're already running alone, plus a second body and extra colors for free. Commit to the pair and `remove_game_plan` the single-commander version — a single direction should occupy one plan, not two. (Don't keep both "just in case"; that's a wasted slot against your max of 3.)

**Weigh the `colors` count when you choose.** A 3-color pairing keeps your mana clean and your fixing requirements light. A 4- or 5-color pairing buys reach and options but strains consistency — take the wider identity only when those extra colors genuinely serve the plan (a splash you actually want, key cards you can't otherwise cast), not just because it's legal.

**How to create a pair:** call `add_game_plan` with both commander IDs. This creates one game plan keyed by both names (e.g. `"Tana, the Bloodsower + Tymna the Weaver"`), separate from any single-commander plan. If a pairing already shows `already_a_game_plan: true`, you are running it — don't add it again. If two pairings share a "main" commander and you want to compare directions, you may run them as separate plans, but remember the 3-plan cap — don't let speculative pairings crowd out a committed direction.

### `update_game_plan`

**Description:**  
Update an existing game plan's relevant tags and description.

Use this when your strategy evolves - add new tags to track, remove irrelevant ones, or refine the description based on what you've drafted. (Note: this updates tags and description only — to change the commanders themselves, add a new game plan for the new pairing and remove the old one.)

**Args:**
- `game_plan_key`: the key of the game plan to update (commander name(s) joined with ` + `, e.g., `"Yarok, the Desecrated"` or `"Tana, the Bloodsower + Tymna the Weaver"`)
- `relevant_tags`: new array of tags to track (replaces existing tags)
- `game_plan`: updated description of the strategy

### `remove_game_plan`

**Description:**  
Remove a game plan that is no longer viable or to make room for a new one.

The removed game plan's key is saved to `past_game_plans` for reference.

### When to REMOVE a game plan:
- **You need the slot** - you want to add a 4th plan but max is 3
- **You've upgraded a single into a pair** - a pairing with `upgrades_single_plan` supersedes the solo plan; remove the solo version
- The plan is truly dead - well under 60 cards in colors with no realistic path to viability
- The colors are completely cut - you've seen almost nothing playable for several packs

**Don't remove a game plan just to "clean up."** Multiple viable options at end of draft is a feature, not a problem. The deckbuilder benefits from seeing your alternatives. (Superseding a single with its own pair is not "cleanup" — it's consolidating one direction into its stronger form.)

**Args:**
- `game_plan_key`: the key of the game plan to remove

### `remove_tags_from_cards`

**Description:**  
Clear all tags from specified cards.

Use this to clean up cards that were mistagged or when you want to re-evaluate them fresh. The tags can always be reapplied.

**Args:**
- `card_ids`: array of card IDs to clear tags from