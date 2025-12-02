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

export const parsePickDataFromSeat = (seat) => {
  return seat.packAtHand.cards.map(card => ({
    id: card.id,
    name: card.name,
    mana_value: card.mana_value,
    color_identity: card.color_identity,
    types: card.types,
    oracle_text: card.oracle_text
  }));
};

export const parseAnalysisDataFromSeat = (seat, reasoning) => {
  const data = {
    cards: seat.main.map(card => ({
      id: card.id,
      name: card.name,
      mana_value: card.mana_value,
      color_identity: card.color_identity,
      types: card.types,
      oracle_text: card.oracle_text,
      tags: card.tags || []
    }))
  };
  
  if (reasoning) data.latestReasoning = reasoning;
  if (seat.analysis_summary) data.previousAnalysis = seat.analysis_summary;
  
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