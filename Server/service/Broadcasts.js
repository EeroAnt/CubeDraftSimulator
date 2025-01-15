import { connections, users } from "./State.js";

export const broadcastUserlist = (draft) => {
  Object.values(draft.players).forEach(player => {
	const result = draft.players.reduce((acc, player) => {
		acc.players[player.uuid] = player.username;
		return acc;
	  }, { status: "OK", type: "Playerlist", players: {} });

	const message = JSON.stringify(result);
	if (Object.keys(connections).includes(player.uuid)) {
	    connections[player.uuid].send(message);
    }
 });
};


export const broadcastDraftStatus = (draft, status) => {
  Object.values(draft.players).forEach(player => {
	const message = JSON.stringify({ status: "OK", type: status });
	connections[player.uuid].send(message);
  });
};


export const broadcastCanalDredger = (draft, seatNumber) => {
  Object.values(draft.players).forEach(player => {
	if (player.seat.number === seatNumber) {
	  const message = JSON.stringify({
      status: "OK",
      type: "Canal Dredger",
      seat: seatNumber,
      owner: true
    });
	  
    connections[player.uuid].send(message);
	} else {
  	const message = JSON.stringify({
      status: "OK",
      type: "Canal Dredger",
      seat: seatNumber,
      owner: false
    });

	  connections[player.uuid].send(message);
  }});
};

export function sendCards(uuid) {
  connections[uuid].send(JSON.stringify({
    status: "OK",
    type: "Picked Cards",
    commanders: users[uuid].seat.commanders,
    main: users[uuid].seat.main,
    side: users[uuid].seat.side
  }));
}
