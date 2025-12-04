export const operateTools = (tool_calls, seat) => {
  const badCalls = []
  for (const call of tool_calls) {
    switch (call.tool) {
      case "tag_cards":
        if (!call.card_ids || !call.tag) {
          badCalls.push({ call, reason: "missing params" } )
          console.warn("tag_card missing parameters");
          continue;
        }
        tagCards(call.card_ids, call.tag, seat);
        break;
      case "add_game_plan":
        if (!call.commander_ids || !call.relevant_tags || !call.game_plan) {
          badCalls.push({ call, reason: "missing params" } )
          console.warn("tag_card missing parameters");
          continue;
        }
        if (seat.game_plans && Object.keys(seat.game_plans).length >= 3) {
          badCalls.push({ call, reason: "max 3 game plans, remove one first" });
          continue;
        }
        addGamePlan(call.commander_ids, call.relevant_tags, call.game_plan, seat)
        break;
      default:
        badCalls.push({ call, reason: "unknown tool" } )
    }
  }
  return badCalls
}

const tagCards = (card_ids, tag, seat) => {

  if (!seat.tags) seat.tags = [];
  if (!seat.tags.includes(tag)) seat.tags.push(tag);

  for (const id of card_ids) {
    const card = seat.main.find(c => c.id === id);
    if (!card) continue;
    
    if (!card.tags) card.tags = [];
    if (!card.tags.includes(tag)) card.tags.push(tag);
  }
};

const addGamePlan = (commander_ids, relevant_tags, description, seat) => {
  const legalityResult = checkCommanderLegality(commander_ids, seat);
  
  if (!legalityResult.valid) {
    if (!seat.incompatible_commanders) seat.incompatible_commanders = [];
    if (legalityResult.commanders) {
      const key = legalityResult.commanders.map(c => c.name).sort().join(" + ");
      if (!seat.incompatible_commanders.includes(key)) {
        seat.incompatible_commanders.push(key);
      }
    }
    return;
  }

  if (!seat.game_plans) seat.game_plans = {};

  const key = legalityResult.commanders.map(c => c.name).sort().join(" + ");
  
  seat.game_plans[key] = {
    commanders: legalityResult.commanders,
    color_identity: legalityResult.color_identity,
    relevant_tags: relevant_tags,
    description: description
  };

  return;
};

const checkCommanderLegality = (card_ids, seat) => {
  if (card_ids.length === 0 || card_ids.length > 2) {
    return { valid: false, reason: "Must provide 1 or 2 card IDs" };
  }

  const commanders = card_ids.map(id => seat.main.find(c => c.id === id)).filter(Boolean);
  
  if (commanders.length !== card_ids.length) {
    return { valid: false, reason: "One or more cards not found" };
  }

  // Check each card is a legendary creature
  for (const card of commanders) {
    if (!card.types.includes("Legendary") || !card.types.includes("Creature")) {
      return { valid: false, reason: `${card.name} is not a legendary creature` };
    }
  }

  // If two commanders, check partner legality
  if (commanders.length === 2) {
    for (const card of commanders) {
      const isGod = card.types.toLowerCase().includes("god");
      const colorCount = card.color_identity.length;
      const hasHouseRulePartner = colorCount <= 2 && !isGod;

      if (!hasHouseRulePartner) {
        return {
          valid: false,
          commanders: commanders.map(c => c.name),
          reason: `${card.name} cannot partner (${colorCount} colors or is a God)`
        };
      }
    }
  }

  return { 
    valid: true, 
    commanders: commanders.map(c => c.name),
    color_identity: [...new Set(commanders.flatMap(c => c.color_identity.split('')))]
  };
};