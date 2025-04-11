import { broadcastUserlist, broadcastLobbies } from "./Broadcasts.js";
import {
  users,
  drafts,
  connections,
  intervalIDs,
  messageQueues,
  last_acked_message,
  retryCounts,
  retryTimers
} from "./State.js";
import {
  createLobby,
  joinLobby,
  startDraft,
  rejoinDraft
} from "./DraftSetup.js";
import { sendDraftData } from "./DataBaseCommunications.js";
import { parseDraftData } from "./DraftDataParser.js";
import { queueMessage, processMessageQueue } from "./Messaging.js";
import { handlePick, giveLastCard, sendCards } from "./DraftFunctions.js";
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

  const decryptedMessage = decrypt(
    message.toString(),
    process.env.MY_ENCRYPTION
  );
  const data = JSON.parse(decryptedMessage);

  console.log("Message from: " + uuid);
  console.log(data.type);
  switch (data.type) {
    case "Connect":
      console.log("New connection: " + uuid);
      break;

    case "Login":
      users[uuid].username = data.username;
      users[uuid].token = "";
      console.log("Login: " + data.username);
      break;

    case "Create Lobby":
      createLobby(data, uuid);
      break;

    case "Get Lobbies":
      users[uuid].draftSelection = true;
      broadcastLobbies();
      break;

    case "Join Lobby":
      joinLobby(data, uuid);
      break;

    case "Rejoin Lobby":
      if (data.token && drafts[data.token]) {

        users[uuid].username = data.username;
        users[uuid].token = data.token;
        console.log("Login: " + data.username);
        joinLobby(data, uuid);

      } else {
        const message = { status: 'No Draft' };
        queueMessage(uuid, message);
      }
      break;

    case "Start Draft":
      startDraft(data);
      break;

    case "Pick":
      handlePick(data, drafts[data.token], users[uuid].seat, uuid);
      break;

    case "Give Last Card":
      giveLastCard(drafts[data.token], users[uuid].seat.packAtHand);
      break;

    case "Set Commander":
      setCommander(data, users[uuid].seat);
      if (drafts[data.token].state === "deckbuilding") {
        sendCards(uuid, users[uuid].seat);
      }
      break;

    case "Remove Commander":
      removeCommander(data, users[uuid].seat);
      if (drafts[data.token].state === "deckbuilding") {
        sendCards(uuid, users[uuid].seat);
      }
      break;

    case "Move Cards":
      moveCards(data, users[uuid].seat);
      if (drafts[data.token].state === "deckbuilding") {
        sendCards(uuid, users[uuid].seat);
      }
      break;

    case "Rejoin Draft":

      if (data.token && drafts[data.token]) {
        users[uuid].username = data.username;
        users[uuid].token = "";
        console.log("Login: " + data.username);

        rejoinDraft(data, uuid);
      } else {
        const message = { status: 'No Draft' };
        queueMessage(uuid, message);
      }

    case "Draft Data Decision":
      if (data.decision) {
        const draftData = parseDraftData(drafts[data.token]);
        sendDraftData(draftData);
      }
    case "Get Seat Token":
      const message = {
        status: 'OK',
        type: 'Seat token',
        seat: users[uuid].seat.token
      };
      queueMessage(uuid, message);
      break;
    case "Ack":
      if (last_acked_message[uuid] === data.ackToken) {
        clearTimeout(retryTimers[uuid]);
        messageQueues[uuid].shift();
        last_acked_message[uuid] = null;
        retryCounts[uuid] = 0;
        processMessageQueue(uuid);
      }
      break;
    default:
      console.log("Unknown message type: " + JSON.stringify(data));
      break;
  }
}