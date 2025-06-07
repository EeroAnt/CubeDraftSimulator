import {
  connections,
  drafts,
  users,
  broadcastedQueues,
  draftStates,
  lastBroadcastTimestamps
} from "./State.js";
import { queueMessage } from "./Messaging.js";
import { extractDraftState, extractQueues } from "./DraftState.js";
import deepEqual from "fast-deep-equal";

const BROADCAST_INTERVAL_MS = 10_000;


export const broadcastUserlist = (draft) => {
  Object.values(draft.players).forEach(player => {
	const result = draft.players.reduce((acc, player) => {
		acc.players[player.uuid] = player.username;
    if (player.isNPC) {
      acc.hasNPC = true;
    }
		return acc;
	  }, { status: "OK", type: "Playerlist", players: {}, hasNPC: false });

	const message = result;
	if (Object.keys(connections).includes(player.uuid)) {
      
    queueMessage(player.uuid, message);
    
    }
 });
};

export const broadcastLobbies = () => {
  const draftsToBroadcast = Object.values(drafts).map(draft => {
    if (draft.state === "Setup Complete") {
      return {
        token: draft.token,
        players: draft.players.length,
        maxPlayers: draft.player_count
      };
    }
  });
  const message = {
    status: "OK",
    type: "Drafts",
    drafts: draftsToBroadcast
  };
  Object.values(users).forEach(user => {
    if (user.draftSelection) {
      console.log("Broadcasting drafts to " + user.username);
      queueMessage(user.uuid, message);
    }
  });
};

export const broadcastDraftStatus = (draft, status) => {
  const message = { status: "OK", type: status };
  Object.values(draft.players).forEach(player => {
    queueMessage(player.uuid, message);
  });
};

export const broadcastDraftState = (draft) => {
  console.log("Broadcasting draft state to players", draft.token);
  const queues = extractQueues(draft);
  draft.players.forEach(player => {
    const state = extractDraftState(draft, player);
    const message = {
      status: "OK",
      type: "DraftState",
      state: state,
      queues: queues,
    };

    const lastSent = lastBroadcastTimestamps[player.uuid] || 0;
    const timeSinceLast = Date.now() - lastSent;

    const shouldSend =
      !deepEqual(queues, broadcastedQueues[draft.token]) ||
      !deepEqual(state, draftStates[player.uuid]) ||
      timeSinceLast > BROADCAST_INTERVAL_MS;

    if (!shouldSend) {
      return;
    }
    
    broadcastedQueues[draft.token] = queues;
    draftStates[player.uuid] = state;
    lastBroadcastTimestamps[player.uuid] = Date.now();
    queueMessage(player.uuid, message);
  });
};

export const broadcastQueues = (draft) => {
  const queues = [];
  draft.players.forEach(player => {
    queues.push({
      username: player.username,
      seat: player.seat.number,
      queue: player.seat.queue.length,
      hand: player.seat.packAtHand.cards.length ? 1 : 0
    });
  });
  queues.sort((a, b) => a.seat - b.seat);
  const message = {
    status: "OK",
    type: "Queues",
    queues: queues
  };
};

export const broadcastRound = (draft) => {

  const message = {
    status: "OK",
    type: "Round",
    round: draft.round,
  };
  
  Object.values(draft.players).forEach(player => {
    queueMessage(player.uuid, message);
  });
};