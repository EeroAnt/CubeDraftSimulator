import { broadcastUserlist } from "./Broadcasts.js";
import { intervalIDs, npcStates } from "./State.js";
import { handlePick } from "./DraftFunctions.js";
import { pickCardWithLLM, analyzePoolWithLLM } from "./AI/LLMCalls.js";
import { findSeatByUUID, parsePickDataFromSeat, getNPCState } from "./Utils.js";
import { saveDraftPool } from "./NPCResults.js";
import { createWriteUp } from "./AI/Caller.js";

const NPCNames = [
  "NPC-Goofy",
  "NPC-Donald",
  "NPC-Shakira",
  "NPC-Steamboat",
  "NPC-Steve",
  "NPC-UrMum",
  "NPC-CrayonEater",
  "NPC-TrueAGI"
];

const getNPCName = (draft) => {
  const takenNames = draft["players"].map(player => player.username);
  const availableNames = NPCNames.filter(name => !takenNames.includes(name));
  if (availableNames.length === 0) return null;
  return availableNames[Math.floor(Math.random() * availableNames.length)];
};


export const addNPC = (draft) => {
  if (!draft || !draft["players"] || !draft["token"]) {
    console.log("Invalid draft data provided.");
    return;
  }
  if (draft["players"].length >= draft["player_count"]) {
    console.log("Cannot add NPC, player limit reached.");
    return;
  }
  const npcName = getNPCName(draft);
  if (!npcName) {
    console.log("No available NPC names left.");
    return;
  }
  const npc = {
    username: npcName,
    uuid: npcName+draft["token"],
    token: draft["token"],
    isNPC: true
  };
  intervalIDs[npc.uuid] = setInterval(() => processNPC(npc.uuid, draft), 200);
  draft["players"].push(npc);
  broadcastUserlist(draft);
};

export const removeNPC = (draft) => {
  if (!draft || !draft["players"] || !draft["token"]) {
    console.log("Invalid draft data provided.");
    return;
  }
  const npcIndex = draft["players"].findIndex(player => player.isNPC);
  if (npcIndex === -1) {
    console.log("No NPC found in the draft.");
    return;
  }
  const npc = draft["players"][npcIndex];
  draft["players"].splice(npcIndex, 1);
  broadcastUserlist(draft);
  clearInterval(intervalIDs[npc.uuid]);
  delete intervalIDs[npc.uuid];
  const state = npcStates.get(npc.uuid);
  if (state?.currentAnalysis) {
    state.currentAnalysis.abort();
  }
  npcStates.delete(npc.uuid);
  console.log(`Removed NPC: ${npc.username}`);
};

const processNPC = async (npcUUID, draft) => {
  const seat = findSeatByUUID(draft, npcUUID);
  const state = getNPCState(npcUUID);
  if (!seat) return;

  // Handle deckbuilding phase - generate write-up then clean up
  if (draft.state === 'deckbuilding') {
    if (state.isWritingUp) return;
    
    state.isWritingUp = true;
    try {
      console.log(`${npcUUID} is writing draft recap.`);
      saveDraftPool(seat, npcUUID)
      await createWriteUp(seat, npcUUID);
    } catch (error) {
      console.warn(`${npcUUID} write-up failed:`, error.message);
    } finally {
      console.log(`${npcUUID} has finished write-up.`);
      clearInterval(intervalIDs[npcUUID]);
      npcStates.delete(npcUUID);
    }
    return;
  }
  
  state.reassess_game_plans = (seat.main.length - 5) % 15 === 0;

    state.hasCardsToPickFrom = !!seat?.packAtHand?.cards.length;
  if (draft.last_round !== undefined) {
    state.packsRemaining = draft.last_round - draft.round;
  }

  if (state.isPicking || state.isAnalyzing) return;
  
  if (state.hasCardsToPickFrom) {
    state.isPicking = true;
    try {
      await NPCPick(draft, seat, npcUUID);
      state.analysisComplete = false;
    } finally {
      state.isPicking = false;
    }
  } else {
    if (state.analysisComplete || seat.queue.length > 0) return;
    
    state.isAnalyzing = true;
    try {
      console.log(`${npcUUID} is analysing its pool.`);
      const context = await analyzePoolWithLLM(seat, npcUUID);
      if (context?.summary) {
        seat.analysis_summary = context.summary;
      }
      state.analysisComplete = true;
    } catch (error) {
      console.warn(`${npcUUID} analysis failed:`, error.message);
      state.analysisComplete = true;  // Mark complete to avoid infinite retry loop
    } finally {
      console.log(`${npcUUID} has finished analyzing.`);
      state.isAnalyzing = false;
    }
  }
};

const NPCPick = async (draft, seat, npcUUID) => {
  console.log(`${npcUUID} is picking a card.`);
  const state = getNPCState(npcUUID)
  let cardId, reasoning;

  if (seat.packAtHand.cards < 2) {
    cardId = seat.packAtHand.cards[0].id;
    reasoning = "Last card in the pack";
  } else {
    try {
      const pickingData = parsePickDataFromSeat(seat)
      const pickResult = await pickCardWithLLM(pickingData);

      // Validate the picked card exists in the pack
      const pickedCard = seat.packAtHand.cards.find(c => c.id === pickResult.card);
      if (!pickedCard) {
        throw new Error(`LLM picked invalid card ID: ${pickResult.card}`);
      }

      cardId = pickResult.card;
      reasoning = pickResult.reasoning;
      
      if (pickResult.tags?.length) {
        const card = seat.packAtHand.cards.find(c => c.id === cardId);
        if (card) {
          if (!card.tags) card.tags = [];
          for (const tag of pickResult.tags) {
            if (!card.tags.includes(tag)) card.tags.push(tag);
            // Also add to seat's tag registry
            if (!seat.tags) seat.tags = [];
            if (!seat.tags.includes(tag)) seat.tags.push(tag);
          }
        }
      }
    } catch (error) {
      console.warn('LLM pick failed, falling back to random:', error);
      cardId = seat.packAtHand.cards[Math.floor(Math.random() * seat.packAtHand.cards.length)].id;
      reasoning = "Random pick (LLM unavailable)";
    }
  }
  state.latestReasoning = reasoning

  const data = {
    card: cardId,
    zone: "main",
    isNPC: true
  };
  handlePick(data, draft, seat, npcUUID);
}
