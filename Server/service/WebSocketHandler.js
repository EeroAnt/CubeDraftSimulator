import { broadcastUserlist, broadcastLobbies } from "./Broadcasts.js";
import { users, drafts, connections, intervalIDs } from "./State.js";
import {
  createLobby,
  joinLobby,
  startDraft,
  rejoinDraft
} from "./DraftSetup.js";
import { sendDraftData } from "./DataBaseCommunications.js";
import { parseDraftData } from "./DraftDataParser.js";
import { queueMessage } from "./Messaging.js";
import { handlePick, giveLastCard } from "./DraftFunctions.js";
import { setCommander, removeCommander, moveCards } from "./DeckManagement.js";
import { decrypt } from "./encryption.js";

export const handleClose = (uuid) => {
  clearInterval(intervalIDs[uuid]);
  if (users[uuid].token && drafts[users[uuid].token]) {
    broadcastUserlist(drafts[users[uuid].token]);
    if (Object.keys(drafts).includes(users[uuid].token)) {
      console.log('deleting player from the draft');
      drafts[users[uuid].token].players =
        drafts[users[uuid].token].players.filter(
          player => player.uuid !== uuid
        );
      users[uuid].seat
        ? users[uuid].seat.player = ""
        : console.log("Not seated");
      broadcastUserlist(drafts[users[uuid].token]);
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

  if (data.type === "Login") {

    users[uuid].username = data.username;
    users[uuid].token = "";
    console.log("Login: " + data.username);

  } else if (data.type === "Create Lobby") {

    createLobby(data, uuid);

  } else if (data.type === "Get Lobbies") {

    users[uuid].draftSelection = true;
    broadcastLobbies();

  } else if (data.type === "Join Lobby") {

    joinLobby(data, uuid);

  } else if (data.type === "Rejoin Lobby") {
    if (data.token && drafts[data.token]) {


      users[uuid].username = data.username;
      users[uuid].token = data.token;
      console.log("Login: " + data.username);
      joinLobby(data, uuid);
    } else {
      const message = { status: 'No Draft' };
      queueMessage(uuid, message);
    }

  } else if (data.type === 'Start Draft') {

    startDraft(data);

  } else if (data.type === 'Pick') {

    const draft = drafts[data.token];
    const userSeat = users[uuid].seat;

    handlePick(data, draft, userSeat, uuid);

  } else if (data.type === 'Give Last Card') {

    const draft = drafts[data.token];
    const pack = users[uuid].seat.packAtHand;

    giveLastCard(draft, pack);

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

    if (data.token && drafts[data.token]) {
      users[uuid].username = data.username;
      users[uuid].token = "";
      console.log("Login: " + data.username);

      rejoinDraft(data, uuid);
    } else {
      const message = { status: 'No Draft' };
      queueMessage(uuid, message);
    }

  } else if (data.type === 'Draft Data Decision') {
    if (data.decision) {
      const draftData = parseDraftData(drafts[data.token]);
      sendDraftData(draftData);
    }
  } else if (data.type === 'Get Seat Token') {
    const message = {
      status: 'OK',
      type: 'Seat token',
      seat: users[uuid].seat.token
    };
    queueMessage(uuid, message);
  }
};