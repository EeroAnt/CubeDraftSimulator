import { broadcastUserlist } from "./Broadcasts.js";
import { users, drafts, connections } from "./State.js";
import { createLobby, joinDraft, startDraft } from "./DraftSetup.js";
import { calculateNextSeatNumber } from './Utils.js';
import { sendDraftData } from "./DataBaseCommunications.js";
import { sendMessage } from "./Messaging.js";
import { handlePick, sendCards, giveLastCard } from "./DraftFunctions.js";

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
        ? users[uuid].seat.player = ""
        : console.log("Not seated");
    }
  }
  console.log(`Connection closed: ${uuid}`);
  delete users[uuid];
  delete connections[uuid];
};

export async function handleMessage(message, uuid) {
  // decrypting here
  const data = JSON.parse(message.toString());
  console.log(data);
  console.log("Message from: " + uuid);


  if (data.type === "Admin") {

    if (process.env.PASSKEY === data.passkey) {
      console.log("Admin Connected");
      const message = {
        status: 'OK',
        type: 'Admin'
      };
      sendMessage(uuid, message);
    }

  } else if (data.type === "Get Data") {
    // Remove this from frontend as well

  } else if (data.type === "Login") {

    users[uuid].username = data.username;
    users[uuid].token = "";
    console.log("Login: " + data.username);

  } else if (data.type === "Create Lobby") {

    createLobby(data, uuid);

  } else if (data.type === "Join Draft") {

    joinDraft(data, uuid);

  } else if (data.type === 'Start Draft') {

    startDraft(data);

  } else if (data.type === 'Pick') {
    
    const draft = drafts[data.token];
    const userSeat = users[uuid].seat;

    handlePick(data, draft, userSeat, uuid);

  } else if (data.type === 'Give Last Card') {

    const draft = drafts[data.token];
    const pack = users[uuid].seat.packAtHand;

    giveLastCard(data, draft, pack);

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
          users[uuid].seat.number = parseInt(seat.replace('seat', ''));
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
            status: 'OK',
            type: 'Rejoin Draft'
          }));

          sendCards(uuid);

          if (
            Array(drafts[data.table].table[seat].packAtHand.cards).length > 0
          ) {
            connections[uuid].send(JSON.stringify({
              status: 'OK',
              type: 'Pack',
              pack: drafts[data.table].table[seat].packAtHand.cards
            }));
          }
        }
      }
    } else {
      connections[uuid].send(JSON.stringify({
        status: 'Draft Disappeared'
      }));
    }
  } else if (data.type === 'Draft Data Decision') {
    if (data.decision) {
      const draftdata = {
        picks: drafts[data.token].picks,
        commanderpicks: drafts[data.token].commanderpicks,
        packs: drafts[data.token].picked_packs
      };
      sendDraftData(draftdata);
    }
  }
};