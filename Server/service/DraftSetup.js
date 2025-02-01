import { users, drafts, intervalIDs } from "./State.js";
import { getDraft } from "./DataBaseCommunications.js";
import { sendMessage } from "./Messaging.js";
import { broadcastUserlist, broadcastDraftStatus } from "./Broadcasts.js";
import { shuffleArray } from "./Utils.js";
import { checkDraftStatus } from "./DraftStatus.js";

export async function createLobby(data, uuid) {

  if (users[uuid].token === "") {

    users[uuid].token = data.token;
    const commander_pack_included = data.commander_pack_included ? 1 : 0;

    try {
      const message = await getDraft(
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

      sendMessage(uuid, message);
      console.log(message);

      if (message.status === "Setup OK") {

        broadcastUserlist(drafts[data.token]);

      }

    } catch (error) {

      console.log(error);

    }

  } else {
    console.log("Wait for setting up the draft");
  }
};

export function joinDraft(data, uuid) {

  if (Object.keys(drafts).includes(data.token) === false) {

    const message = { status: 'No Draft Found With That Token' };
    sendMessage(uuid, message);

  } else if (drafts[data.token].players.length >=
    drafts[data.token].player_count) {

    const message = { status: 'Lobby Full' };
    sendMessage(uuid, message);

  } else if (drafts[data.token].state === 'drafting') {

    const message = { status: 'Draft Already Started' };
    sendMessage(uuid, message);

  } else {

    users[uuid].token = data.token;
    drafts[data.token].players =
      drafts[data.token].players.concat(users[uuid]);
    broadcastUserlist(drafts[data.token]);

  }
};

export function startDraft(data) {
  
  if (drafts[data.token].state === "Setup Complete") {

    drafts[data.token].state = 'drafting';
    broadcastDraftStatus(drafts[data.token], "Start Draft");
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

};