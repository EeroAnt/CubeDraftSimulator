import { connections, drafts, users } from "./State.js";
import { queueMessage } from "./Messaging.js";

export const broadcastUserlist = (draft) => {
  Object.values(draft.players).forEach(player => {
	const result = draft.players.reduce((acc, player) => {
		acc.players[player.uuid] = player.username;
		return acc;
	  }, { status: "OK", type: "Playerlist", players: {} });

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
  Object.values(draft.players).forEach(player => {
    queueMessage(player.uuid, message);
  });
};

export const broadcastCanalDredger = (draft, seatNumber) => {
  Object.values(draft.players).forEach(player => {
	if (player.seat.number === seatNumber) {
	  const message = {
      status: "OK",
      type: "Canal Dredger",
      owner: "T"
    };

	  queueMessage(player.uuid, message);

	} else {
  	const message = {
      status: "OK",
      type: "Canal Dredger",
      owner: ""
    };

    queueMessage(player.uuid, message);

  }});
};

export const broadcastRound = (draft) => {

  const message = {
    status: "OK",
    type: "Round",
    round: (draft.round == 0) ? "Commander" : draft.round,
  };
  
  Object.values(draft.players).forEach(player => {
    queueMessage(player.uuid, message);
  });
};