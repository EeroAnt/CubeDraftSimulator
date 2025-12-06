

## Commander Pairing Rules

In this cube, the Partner keyword is granted automatically based on these criteria:

**Has Partner:**
- Any Legendary Creature with fewer than 3 colors in its color identity (0, 1, or 2 colors)
- Exception: Creatures with type 'God' never have Partner

**Does NOT have Partner:**
- Legendary Creatures with 3+ colors in their color identity
- God creatures (regardless of color count)

**Valid commander setups:**
- Single commander (any legendary creature)
- Two commanders (both must have Partner)

**Before using `add_game_plan`:**
Check that your commander pair is valid. If you've already tried a pair and it's in `incompatible_commanders`, don't try it again.

**Examples:**
- ✓ Thrasios (2 colors) + Tymna (2 colors) - both have Partner
- ✓ Hope of Ghirapur (colorless) + Tymna (2 colors) - both have Partner
- ✓ Atraxa (4 colors) alone - valid as single commander  
- ✗ Atraxa (4 colors) + Thrasios (2 colors) - Atraxa doesn't have Partner
- ✗ Thassa (God) + Tymna - Gods don't have Partner

## Partner Strategy

**Partner is a major advantage in this cube.** Having two commanders means:
- Guaranteed access to two cards instead of one
- More flexible color identity (up to 4 colors with two 2-color partners)
- Redundancy if one commander is removed

**When building game plans, strongly prefer partnering when legal:**
- If your main commander has 2 or fewer colors and isn't a God, look for a second commander
- The second commander doesn't need perfect synergy - even color access and a backup body is valuable
- A 2-color commander + a different 2-color commander = 3-4 color deck with more consistency

**Only run a single commander when:**
- Your commander has 3+ colors (can't partner)
- Your commander is a God (can't partner)
- You genuinely can't find a legal partner in your pool (rare)

If you have a legal partner option available and aren't using it, you're leaving value on the table.