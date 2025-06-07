import { broadcastUserlist } from "./Broadcasts.js";
import { messageQueues, intervalIDs } from "./State.js";
import { handlePick } from "./DraftFunctions.js";

const NPCNames = [
  "NPC-Goofy",
  "NPC-Donald",
  "NPC-Shakira",
  "NPC-Steamboat",
  "NPC-Steve",
  "NPC-UrMum"
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
  messageQueues[npc.uuid] = [];
    intervalIDs[npc.uuid] = setInterval(() => processNPC(npc.uuid, draft), 6000);
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
  delete messageQueues[npc.uuid];
  console.log(`Removed NPC: ${npc.username}`);
};

const processNPC = (npcUUID, draft) => {
  console.log(`Processing NPC: ${npcUUID}`);
  const seat = findSeatByUUID(draft, npcUUID);
  console.log(seat);
  if (seat?.packAtHand?.cards) {
    const data = {
      card: seat.packAtHand.cards[Math.floor(Math.random() * seat.packAtHand.cards.length)].id,
      zone: "main",
      isNPC: true
    };
    console.log(`NPC ${npcUUID} is picking a card.`);
    console.log(data);
    handlePick(data, draft, seat, npcUUID);
  }
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
