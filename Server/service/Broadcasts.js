import { connections, users } from "./State.js";
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


export const broadcastDraftStatus = (draft, status) => {
  Object.values(draft.players).forEach(player => {
	  const message = { status: "OK", type: status };
    
    sendMessage(player.uuid, message);

  });
};


export const broadcastCanalDredger = (draft, seatNumber) => {
  Object.values(draft.players).forEach(player => {
	if (player.seat.number === seatNumber) {
	  const message = {
      status: "OK",
      type: "Canal Dredger",
      seat: seatNumber,
      owner: true
    };

	  sendMessage(player.uuid, message);

	} else {
  	const message = {
      status: "OK",
      type: "Canal Dredger",
      seat: seatNumber,
      owner: false
    };

    sendMessage(player.uuid, message);

  }});
};

export function sendCards(uuid) {
  const message = {
    status: "OK",
    type: "Picked Cards",
    commanders: users[uuid].seat.commanders,
    main: users[uuid].seat.main,
    side: users[uuid].seat.side
  };

  sendMessage(uuid, message);
  
}
