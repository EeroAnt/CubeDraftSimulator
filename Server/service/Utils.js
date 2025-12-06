import { npcStates } from "./State.js";

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export function calculateNextSeatNumber(
  seatNumber,
  direction,
  player_count
) {
  if (seatNumber + direction < 0) {
	return player_count - 1;
  } else { return (seatNumber + direction) % player_count;}
};

export function checkIfRoundIsDone(table) {
  for (const seat in table) {
  	if (table[seat].packAtHand.cards.length > 0) {
	    return false;
  	}
	  if (table[seat].queue.length > 0) {
	    return false;
  	}
  } return true;
};

export function findSeatByUUID(draft, uuid) {
  for (const seatKey of Object.keys(draft.table)) {
    const seat = draft.table[seatKey];
    if (seat.player === uuid) {
      return seat;
    }
  }
  return null;
}

const buildGamePlanStats = (seat) => {
  if (!seat.game_plans || !Object.keys(seat.game_plans).length) return null;
  
  const toColorArray = (ci) => {
    if (!ci) return [];
    if (Array.isArray(ci)) return ci.map(c => String(c).trim()).filter(Boolean);
    return String(ci).trim().split('').map(c => c.trim()).filter(Boolean);
  };

  const gamePlans = {};
  for (const [key, plan] of Object.entries(seat.game_plans)) {
    const planColors = toColorArray(plan.color_identity);
    
    // All cards fitting color identity
    const fittingCards = seat.main.filter(card => {
      const cardColors = toColorArray(card.color_identity);
      // if plan has no colors, treat as match-none (or change to match-all by removing this check)
      if (!planColors.length) return false;
      return cardColors.every(c => planColors.includes(c));
    });
    
    // Non-land cards fitting color identity
    const nonLandFitting = fittingCards.filter(card => !(card.types || '').toLowerCase().includes('land'));

    // --- mana curve ---
    const curve = {};
    for (const card of nonLandFitting) {
      const mv = card.mana_value;
      if (mv === null || mv === undefined) continue;
      curve[mv] = (curve[mv] || 0) + 1;
    }

    // Count by card type (only non-zero)
    const typeStats = {};
    const cardTypes = ['creature', 'instant', 'sorcery', 'enchantment', 'artifact', 'planeswalker', 'battle', 'land'];
    for (const type of cardTypes) {
      const count = fittingCards.filter(card => (card.types || '').toLowerCase().includes(type)).length;
      if (count > 0) typeStats[type] = count;
    }
    
    // Count by relevant tag (include zeros)
    const tagStats = {};
    for (const tag of (plan.relevant_tags || [])) {
      tagStats[tag] = fittingCards.filter(card => card.tags?.includes(tag)).length;
    }

    gamePlans[key] = {
      ...plan,
      cards_in_colors: nonLandFitting.length,
      type_breakdown: typeStats,
      tag_breakdown: tagStats,
      curve
    };
  }

  return gamePlans;
};


const parseCardData = (card, includeTags = false, includeID = true) => ({
  name: card.name,
  mana_value: card.mana_value,
  color_identity: card.color_identity.split(''),
  types: card.types,
  oracle_text: card.oracle_text,
  ...(includeID && {id: card.id}),
  ...(includeTags && { tags: card.tags || [] })
});

export const parsePickDataFromSeat = (seat) => {
  const data = {
    cards_to_pick_from: seat.packAtHand.cards.map(card => parseCardData(card))
  };
  
  if (seat.tags?.length) data.available_tags = seat.tags;
  
  const gamePlans = buildGamePlanStats(seat);
  if (gamePlans) data.game_plans = gamePlans;

  if (seat.analysis_summary) data.analysis_summary = seat.analysis_summary
  
  return data;
};

export const parseAnalysisDataFromSeat = (seat, reasoning) => {
  const data = {
    cards: seat.main.map(card => parseCardData(card, true))
  };
  
  if (reasoning) data.latestReasoning = reasoning;
  if (seat.tags?.length) data.available_tags = seat.tags;
  if (seat.incompatible_commanders?.length) data.incompatible_commanders = seat.incompatible_commanders;
  if (seat.past_game_plans) data.past_game_plans = seat.past_game_plans
  
  const gamePlans = buildGamePlanStats(seat);
  if (gamePlans) data.game_plans = gamePlans;
  
  return data;
};

export const parseWriteUpDataFromSeat = (seat) => {
  const data = {
    cards: seat.main.map(card => parseCardData(card, true, false))
  };

  const gamePlans = buildGamePlanStats(seat);
  if (gamePlans) data.game_plans = gamePlans;

  if (seat.past_game_plans) data.past_game_plans = seat.past_game_plans

  return data;
};

export const getNPCState = (npcUUID) => {
  if (!npcStates.has(npcUUID)) {
    npcStates.set(npcUUID, {
      isPicking: false,
      isAnalyzing: false,
      hasCardsToPickFrom: false,
      context: null,
      latestReasoning: null,
      analysisComplete: true,
    });
  }
  return npcStates.get(npcUUID);
};