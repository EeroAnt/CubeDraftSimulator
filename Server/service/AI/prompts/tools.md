

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

The system will first validate the commander pairing against the active custom commander rule.
If invalid, the pair is added to `incompatible_commanders` for future reference.
If valid, a game plan is created with:
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