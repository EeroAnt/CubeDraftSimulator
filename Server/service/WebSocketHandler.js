import { broadcastUserlist } from "./Broadcasts.js";
import { users, drafts, connections } from "./State.js";
import {
  createLobby,
  joinLobby,
  startDraft,
  rejoinDraft
} from "./DraftSetup.js";
import { sendDraftData } from "./DataBaseCommunications.js";
import { sendMessage } from "./Messaging.js";
import { handlePick, giveLastCard } from "./DraftFunctions.js";
import { setCommander, removeCommander, moveCards } from "./DeckManagement.js";
import { decrypt } from "./encryption.js";

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
 
  const decryptedMessage = decrypt(message.toString());
  const data = JSON.parse(decryptedMessage);

  console.log("Message from: " + uuid);
  console.log(data.type);

  if (data.type === "Admin") {

    if (process.env.PASSKEY === data.passkey) {
      console.log("Admin Connected");
      const message = {
        status: 'OK',
        type: 'Admin'
      };
      sendMessage(uuid, message);
    }

  } else if (data.type === "Login") {

    users[uuid].username = data.username;
    users[uuid].token = "";
    console.log("Login: " + data.username);

  } else if (data.type === "Create Lobby") {

    createLobby(data, uuid);

  } else if (data.type === "Join Lobby") {

    joinLobby(data, uuid);

  } else if (data.type === "Rejoin Lobby") {

    users[uuid].username = data.username;
    users[uuid].token = data.token;
    console.log("Login: " + data.username);
    joinLobby(data, uuid);

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

    const userSeat = users[uuid].seat;

    setCommander(data, userSeat, uuid);

  } else if (data.type === 'Remove Commander') {

    const userSeat = users[uuid].seat;

    removeCommander(data, userSeat, uuid);

  } else if (data.type === 'Move Cards') {

    const userSeat = users[uuid].seat;

    moveCards(data, userSeat, uuid);

  } else if (data.type === 'Rejoin Draft') {

    users[uuid].username = data.username;
    users[uuid].token = "";
    console.log("Login: " + data.username);

    rejoinDraft(data, uuid);

  } else if (data.type === 'Draft Data Decision') {
    if (data.decision) {
      const draftdata = {
        packs: drafts[data.token].picked_packs
      };
      sendDraftData(draftdata);
    }
  } else if (data.type === 'Get Seat Token') {
    const message = {
      status: 'OK',
      type: 'Seat token',
      seat: users[uuid].seat.token
    };
    sendMessage(uuid, message);
  }
};