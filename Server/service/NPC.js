import { broadcastUserlist } from "./Broadcasts.js";
import { intervalIDs } from "./State.js";
import { handlePick } from "./DraftFunctions.js";
import { pickCardWithLLM, analyzePoolWithLLM } from "./AI/LLMCalls.js";
import { findSeatByUUID, parsePickDataFromSeat, parseAnalysisDataFromSeat, getNPCState } from "./Utils.js";

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
  const state = npcStates.get(npcUUID);
  if (state?.currentAnalysis) {
    state.currentAnalysis.abort();
  }
  npcStates.delete(npcUUID);
  console.log(`Removed NPC: ${npc.username}`);
};

const processNPC = async (npcUUID, draft) => {
  const seat = findSeatByUUID(draft, npcUUID);

  // try to pick with llm, fall back to random if failed

  const state = getNPCState(npcUUID);

  state.hasCardsToPickFrom = !!seat?.packAtHand?.cards.length;
  // Already picking, don't start another
  if (state.isPicking || state.isAnalyzing) return;
  if (state.hasCardsToPickFrom) {
    state.isPicking = true;
    try {
      await NPCPick(draft, seat, npcUUID)
      state.analysisComplete = false;
    } finally {
      state.isPicking = false
    }
  } else {
    if (state.analysisComplete) return;
    
    state.isAnalyzing = true;
    try {
      console.log("we analyzing")
      await NPCAnalyze(seat, npcUUID);
      state.analysisComplete = true;
    } finally {
      console.log("we done analyzing")
      state.isAnalyzing = false;
    }
  }
};

const NPCPick = async (draft, seat, npcUUID) => {
  console.log(`NPC ${npcUUID} is picking a card.`);
  const state = getNPCState(npcUUID)
  let cardId, reasoning;

  try {
    const pickingData = parsePickDataFromSeat(seat)
    const pickResult = await pickCardWithLLM(pickingData);
    cardId = pickResult.card;
    reasoning = pickResult.reasoning;
  } catch (error) {
    console.warn('LLM pick failed, falling back to random:', error);
    cardId = seat.packAtHand.cards[Math.floor(Math.random() * seat.packAtHand.cards.length)].id;
    reasoning = "Random pick (LLM unavailable)";
  }

  state.latestReasoning = reasoning

  const data = {
    card: cardId,
    zone: "main",
    isNPC: true
  };
  handlePick(data, draft, seat, npcUUID);
}

const NPCAnalyze = async (seat, npcUUID) => {
  const state = getNPCState(npcUUID)
  const analysisData = parseAnalysisDataFromSeat(seat, state.reasoning)
  const context = await analyzePoolWithLLM(analysisData, npcUUID)
  seat["analysis_summary"] = context.summary
}