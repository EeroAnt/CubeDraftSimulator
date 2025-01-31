import {
  broadcastUserlist,
  broadcastDraftStatus,
  broadcastCanalDredger,
  sendCards
} from "./Broadcasts.js";
import { users, drafts, connections, intervalIDs } from "./State.js";
import {
  shuffleArray,
  calculateNextSeatNumber
} from './Utils.js';
import { getDraft, sendDraftData } from "./DataBaseCommunications.js";
import { checkDraftStatus } from "./DraftStatus.js";

export const handleClose = (uuid) => {
  if (users[uuid].token && drafts[users[uuid].token]) {
    broadcastUserlist(drafts[users[uuid].token], connections);
    if (Object.keys(drafts).includes(users[uuid].token)) { 
	    console.log('deleting');
      drafts[users[uuid].token].players =
        drafts[users[uuid].token].players.filter(
          player => player.uuid !== uuid
        );
	    users[uuid].seat
       ? users[uuid].seat.player=""
       : console.log("Not seated");
	  }
  }
  console.log(`Connection closed: ${uuid}`);
  delete users[uuid];
  delete connections[uuid];
};

export const handleMessage = (message, uuid) => {
  // decrypting here
  const data = JSON.parse(message.toString());
  console.log(data);
  console.log("Message from: " + uuid);


  if (data.type === "Admin") {
    if (process.env.PASSKEY === data.passkey) {
      connections[uuid].send(JSON.stringify({
        status : 'OK',
        type : 'Admin'
      }));
    }

  } else if (data.type === "Get Data") {
    // Remove this from frontend as well

  } else if (data.type === "Login"){
    users[uuid].username = data.username;
    users[uuid].token = "";
    console.log("Login: " + data.username);


  } else if (data.type === "Create Lobby") {
  if (users[uuid].token === "") {
    users[uuid].token = data.token;
    const commander_pack_included = data.commander_pack_included ? 1 : 0;
    console.log('Current users:', users);
    getDraft(
      data.token,
      data.player_count,
      uuid,
      commander_pack_included,
      data.number_of_rounds,
      data.multi_ratio,
      data.generic_ratio,
      data.colorless_ratio,
      data.land_ratio
    );
  } else {
    console.log("Wait for setting up the draft");
  }

  } else if (data.type === "Join Draft") {

  if (Object.keys(drafts).includes(data.token) === false) {
    connections[uuid].send(JSON.stringify({
      status : 'No Draft Found With That Token'
    }));

  } else if (drafts[data.token].players.length >=
      drafts[data.token].player_count) {
    
        connections[uuid].send(JSON.stringify({ status : 'Lobby Full'}));

  } else if (drafts[data.token].state === 'drafting') {
    connections[uuid].send(JSON.stringify({
      status : 'Draft Already Started'
    }));
  } else {
    users[uuid].token = data.token;
    drafts[data.token].players =
      drafts[data.token].players.concat(users[uuid]);
    broadcastUserlist(drafts[data.token]);
  }


  } else if (data.type === 'Start Draft') {
  if (drafts[data.token].state === "Setup Complete") {
    drafts[data.token].state = 'drafting';
    broadcastDraftStatus(drafts[data.token],"Start Draft");
    shuffleArray(drafts[data.token].players);
    for (let i = 0; i < drafts[data.token].player_count; i++) {
    drafts[data.token].table[`seat${i}`].player =
      drafts[data.token].players[i].uuid;

    const player = drafts[data.token].players[i];
    player.seat = drafts[data.token].table[`seat${i}`];
    player.seat.number = i;
    player.seat.commanders = [];
    }
    }
  checkDraftStatus(drafts[data.token]);
  intervalIDs[data.token] = setInterval(() =>
    checkDraftStatus(drafts[data.token]), 500);


  } else if (data.type === 'Pick') {
    if (drafts[data.token].round === 0) {
      // Remove magic numbers
      drafts[data.token].commanderpicks[data.card] =
        6-users[uuid].seat.packAtHand.cards.length;
    } else {
      drafts[data.token].picks[data.card] =
        16-users[uuid].seat.packAtHand.cards.length;
    }
    shuffleArray(users[uuid].seat.packAtHand.cards);
    users[uuid].seat[data.zone] =
      users[uuid].seat[data.zone].concat(
        users[uuid].seat.packAtHand.cards.filter(
          card => card.id === data.card
        )[0]
      );
    users[uuid].seat.packAtHand.cards =
      users[uuid].seat.packAtHand.cards.filter(card => card.id !== data.card);
    users[uuid].seat.packAtHand.picks =
      users[uuid].seat.packAtHand.picks.concat(data.card);

    if (data.card === 1887) {
      console.log("Canal Dredger");
      broadcastCanalDredger(drafts[data.token], users[uuid].seat.number);
    }
  
    const nextSeatNumber = calculateNextSeatNumber(
      users[uuid].seat.number,
      drafts[data.token].direction,
      drafts[data.token].player_count
    );

    if (users[uuid].seat.packAtHand.cards.length === 0) {
      drafts[data.token].picked_packs =
        drafts[data.token].picked_packs.concat(
          [users[uuid].seat.packAtHand.picks]);
      }

      drafts[data.token].table[`seat${nextSeatNumber}`].queue =
        drafts[data.token].table[`seat${nextSeatNumber}`].
          queue.concat([users[uuid].seat.packAtHand]);
      users[uuid].seat.packAtHand = {"cards": [], "picks" : []};
      sendCards(uuid);
  
  } else if (data.type === 'Give Last Card') {
    drafts[data.token].table[`seat${data.seat}`].queue =
      drafts[data.token].table[`seat${data.seat}`].queue.
        concat([users[uuid].seat.packAtHand]);
    users[uuid].seat.packAtHand = {"cards": [], "picks" : []};

  } else if (data.type === 'Set Commander') {
    users[uuid].seat.commanders =
      users[uuid].seat.commanders.concat(
        users[uuid].seat.main.concat(
          users[uuid].seat.side).filter(card => card.id === data.card));
    users[uuid].seat.main =
      users[uuid].seat.main.filter(card => card.id !== data.card);
    users[uuid].seat.side =
      users[uuid].seat.side.filter(card => card.id !== data.card);
    sendCards(uuid);
  

  } else if (data.type === 'Remove Commander') {
    users[uuid].seat[data.zone] =
      users[uuid].seat[data.zone].concat(
        users[uuid].seat.commanders.filter(card => card.id === data.card));
    users[uuid].seat.commanders =
      users[uuid].seat.commanders.filter(card => card.id !== data.card);

    sendCards(uuid);


  } else if (data.type === 'Move Cards') {
    for (const card of data.cards) {
      !users[uuid].seat[data.to].includes(card)
       ?
      (users[uuid].seat[data.to] = users[uuid].seat[data.to].concat(card))
       : 
      (console.log("Card already in the zone"));
      users[uuid].seat[data.from] =
        users[uuid].seat[data.from].filter(c => c.id !== card.id);
    }

    sendCards(uuid);
  } else if (data.type === 'Rejoin Draft') {
    if (Object.keys(drafts).includes(data.table)) {
      for (const seat in drafts[data.table].table) {
        if (drafts[data.table].table[seat].token === data.seat &&
          drafts[data.table].table[seat].player === "") {

      drafts[data.table].table[seat].player = uuid;
      drafts[data.table].players =
        drafts[data.table].players.concat(users[uuid]);
      users[uuid].token = data.table;
      users[uuid].seat = drafts[data.table].table[seat];
      users[uuid].seat.number = parseInt(seat.replace('seat',''));
      const playerOnTheLeft =
        users[drafts[data.table].table[`seat${[calculateNextSeatNumber(
          users[uuid].seat.number,
          1,
          drafts[data.table].player_count
        )]}`].player];

      const playerOnTheRight =
        users[drafts[data.table].table[`seat${[calculateNextSeatNumber(
          users[uuid].seat.number,
          -1,
          drafts[data.table].player_count
        )]}`].player];

      connections[uuid].send(JSON.stringify({
        status: "OK",
        type: "Neighbours",
        left: playerOnTheLeft.username,
        right: playerOnTheRight.username,
        direction: drafts[data.table].direction,
        seatToken: users[uuid].seat.token
      }));

      connections[uuid].send(JSON.stringify({
        status : 'OK',
        type : 'Rejoin Draft'
      }));

      sendCards(uuid);
      
      if (
        Array(drafts[data.table].table[seat].packAtHand.cards).length > 0
      ) {
        connections[uuid].send(JSON.stringify({
          status : 'OK',
          type : 'Pack',
          pack : drafts[data.table].table[seat].packAtHand.cards
        }));
      }
    }}} else {
        connections[uuid].send(JSON.stringify({
          status : 'Draft Disappeared'
        }));
      }
  } else if (data.type === 'Draft Data Decision') {
  if (data.decision) {
    const draftdata = {
      picks : drafts[data.token].picks,
      commanderpicks : drafts[data.token].commanderpicks,
      packs : drafts[data.token].picked_packs
      };
    sendDraftData(draftdata);
    }
  }
};