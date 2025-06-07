import { broadcastUserlist } from "./Broadcasts.js";
const NPCNames = [
  "NPC-Goofy",
  "NPC-Donald",
  "NPC-Shakira",
  "NPC-Steamboat",
  "NPC-Steve"
];

const getNPCName = (draft) => {
  const takenNames = draft["players"].map(player => player.name);
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
    uuid: npcName,
    token: draft["token"],
    seat: "",
    isNPC: true
  };
  draft["players"].push(npc);
  broadcastUserlist(draft);
};