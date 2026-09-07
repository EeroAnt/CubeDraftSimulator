export const operateTools = (tool_calls, seat, partnerRule) => {
  const badCalls = []
  for (const call of tool_calls) {
    console.log(`${seat.player} calls \x1b[36m${call.tool}\x1b[0m-tool`);
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
          console.warn("add_game_plan missing parameters");
          continue;
        }
        if (seat.game_plans && Object.keys(seat.game_plans).length >= 3) {
          badCalls.push({ call, reason: "max 3 game plans, remove one first" });
          continue;
        }
        const addResult = addGamePlan(call.commander_ids, call.relevant_tags, call.game_plan, seat, partnerRule);
        if (!addResult.success) badCalls.push({ call, reason: addResult.reason });
        break;

      case "update_game_plan":
        if (!call.game_plan_key || !call.relevant_tags || !call.game_plan) {
          badCalls.push({ call, reason: "missing params" });
          console.warn("update_game_plan missing parameters");
          continue;
        }
        const updateResult = updateGamePlan(call.game_plan_key, call.relevant_tags, call.game_plan, seat);
        if (!updateResult.success) {
          badCalls.push({ call, reason: updateResult.reason });
        }
        break;

      case "remove_game_plan":
        if (!call.game_plan_key) {
          badCalls.push({ call, reason: "missing params" });
          console.warn("remove_game_plan missing parameters");
          continue;
        }
        const removeResult = removeGamePlan(call.game_plan_key, seat);
        if (!removeResult.success) {
          badCalls.push({ call, reason: removeResult.reason });
        }
        break;

      case "remove_tags_from_cards":
        if (!call.card_ids?.length) {
          badCalls.push({ call, reason: "missing params" });
          console.warn("remove_tags_from_cards missing parameters");
          continue;
        }
        removeTagsFromCards(call.card_ids, seat);
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

const addGamePlan = (commander_ids, relevant_tags, description, seat, partnerRule) => {
  const legalityResult = checkCommanderLegality(commander_ids, seat, partnerRule);

  if (!legalityResult.valid) {
    const label = legalityResult.commanders
      ? legalityResult.commanders.sort().join(" + ")
      : `[${commander_ids.join(", ")}]`;
    console.warn(`${seat.player} add_game_plan rejected (${label}): ${legalityResult.reason}`);
    return { success: false, reason: legalityResult.reason };
  }

  if (!seat.game_plans) seat.game_plans = {};
  const key = legalityResult.commanders.sort().join(" + ");
  const existed = !!seat.game_plans[key];

  seat.game_plans[key] = {
    commanders: legalityResult.commanders,
    color_identity: legalityResult.color_identity,
    relevant_tags,
    description
  };

  console.log(`${seat.player} \x1b[32m${existed ? "updated game plan" : "added game plan"}\x1b[0m: ${key}`);
  return { success: true, existed };
};

export const checkCommanderLegality = (card_ids, seat, partnerRule) => {
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

  // If two commanders, check partner legality per the active house rule
  if (commanders.length === 2) {
    switch (partnerRule) {
      case 0: {
        // 2-color legends have partner, no Gods
        for (const card of commanders) {
          const isGod = card.types.toLowerCase().includes("god");
          const colorCount = card.color_identity.length;
          if (colorCount > 2 || isGod) {
            return {
              valid: false,
              commanders: commanders.map(c => c.name),
              reason: `${card.name} cannot partner (${colorCount} colors or is a God)`
            };
          }
        }
        break;
      }
      case 1: {
        // Partner up to 4 combined colors, no Gods
        for (const card of commanders) {
          if (card.types.toLowerCase().includes("god")) {
            return {
              valid: false,
              commanders: commanders.map(c => c.name),
              reason: `${card.name} cannot partner (is a God)`
            };
          }
        }
        const combined = [...new Set(commanders.flatMap(c => c.color_identity.split("")))];
        if (combined.length > 4) {
          return {
            valid: false,
            commanders: commanders.map(c => c.name),
            reason: `Combined color identity is ${combined.length} colors (max 4)`
          };
        }
        break;
      }
      case 2:
        // Every legend has partner — no restrictions
        break;
      default:
        return { valid: false, reason: `Unknown partner rule: ${partnerRule}` };
    }
  }

  return {
    valid: true,
    commanders: commanders.map(c => c.name),
    color_identity: [...new Set(commanders.flatMap(c => c.color_identity.split("")))]
  };
};

const updateGamePlan = (key, relevant_tags, description, seat) => {
  if (!seat.game_plans?.[key]) {
    return { success: false, reason: `Game plan "${key}" not found` };
  }

  seat.game_plans[key].relevant_tags = relevant_tags;
  seat.game_plans[key].description = description;

  return { success: true };
};

const removeGamePlan = (key, seat) => {
  if (!seat.game_plans?.[key]) {
    return { success: false, reason: `Game plan "${key}" not found` };
  }

  if (!seat.past_game_plans) seat.past_game_plans = [];
  seat.past_game_plans.push(key);

  delete seat.game_plans[key];

  return { success: true };
};

const removeTagsFromCards = (card_ids, seat) => {
  for (const id of card_ids) {
    const card = seat.main.find(c => c.id === id);
    if (!card) continue;
    card.tags = [];
  }
};