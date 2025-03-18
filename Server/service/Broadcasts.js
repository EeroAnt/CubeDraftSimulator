import { connections, drafts, users } from "./State.js";
import { sendMessage } from "./Messaging.js";

export const broadcastUserlist = (draft) => {
  Object.values(draft.players).forEach(player => {
	const result = draft.players.reduce((acc, player) => {
		acc.players[player.uuid] = player.username;
		return acc;
	  }, { status: "OK", type: "Playerlist", players: {} });

	const message = result;
	if (Object.keys(connections).includes(player.uuid)) {
      
    sendMessage(player.uuid, message);
    
    }
 });
};

export const broadcastDrafts = () => {
  const draftsToBroadcast = Object.values(drafts).map(draft => {
    return {
      token: draft.token,
      players: draft.players.length
    };
  });
  console.log(users);
  console.log(draftsToBroadcast);
};

export const broadcastDraftStatus = (draft, status) => {
  const message = { status: "OK", type: status };
  Object.values(draft.players).forEach(player => {
    sendMessage(player.uuid, message);
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
    sendMessage(player.uuid, message);
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

	  sendMessage(player.uuid, message);

	} else {
  	const message = {
      status: "OK",
      type: "Canal Dredger",
      owner: ""
    };

    sendMessage(player.uuid, message);

  }});
};
