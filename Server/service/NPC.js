import { broadcastUserlist } from "./Broadcasts.js";
import { intervalIDs } from "./State.js";
import { handlePick } from "./DraftFunctions.js";
import { analyzePoolInBackground, pickCardWithLLM } from "./AI/LLMCalls.js";

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

// Track NPC state
const npcStates = new Map();

const getNPCState = (npcUUID) => {
  if (!npcStates.has(npcUUID)) {
    npcStates.set(npcUUID, {
      isPicking: false,
      isAnalyzing: false,
      context: null,
    });
  }
  return npcStates.get(npcUUID);
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
  if (!seat?.packAtHand?.cards.length) return;
  // try to pick with llm, fall back to random if failed

  const state = getNPCState(npcUUID);

  // Already picking, don't start another
  if (state.isPicking) return;
  state.isPicking = true;

  // // Cancel any ongoing analysis when new pick is needed
  // if (state.currentAnalysis) {
  //   state.currentAnalysis.abort();
  //   state.currentAnalysis = null;
  //   state.isAnalyzing = false;
  // }
  
  console.log(`NPC ${npcUUID} is picking a card.`);

  let cardId, reasoning;
  try {
    const pickResult = await pickCardWithLLM(seat);
    cardId = pickResult.card;
    reasoning = pickResult.reasoning;
  } catch (error) {
    console.warn('LLM pick failed, falling back to random:', error);
    cardId = seat.packAtHand.cards[Math.floor(Math.random() * seat.packAtHand.cards.length)].id;
    reasoning = "Random pick (LLM unavailable)";
  }

  console.log(`card ${cardId} was picked with reasoning:\n${reasoning}`)

  const data = {
    card: cardId,
    zone: "main",
    isNPC: true
  };
  handlePick(data, draft, seat, npcUUID);
  state.isPicking = false;
  // setup for next pack
  // analyzePoolInBackground(npcUUID, seat, reasoning);

};

function findSeatByUUID(draft, uuid) {
  for (const seatKey of Object.keys(draft.table)) {
    const seat = draft.table[seatKey];
    if (seat.player === uuid) {
      return seat;
    }
  }
  return null;
}
