import { users, drafts, intervalIDs } from "./State.js";
import { getDraft } from "./DataBaseCommunications.js";
import { queueMessage } from "./Messaging.js";
import { broadcastUserlist, broadcastDraftStatus } from "./Broadcasts.js";
import { shuffleArray } from "./Utils.js";
import { checkDraftStatus } from "./DraftStatus.js";
import { sendCards, sendPackAtHand } from "./DraftFunctions.js";

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

      queueMessage(uuid, message);

      if (message.status === "Setup OK") {

        broadcastUserlist(drafts[data.token]);
        intervalIDs[data.token] = setInterval(() =>
          checkDraftStatus(drafts[data.token]), 5000);

      }

    } catch (error) {

      console.log(error);

    }

  } else {
    console.log("Wait for setting up the draft");
  }
};

export function joinLobby(data, uuid) {

  if (Object.keys(drafts).includes(data.token) === false) {

    const message = { status: 'No Draft Found With That Token' };
    queueMessage(uuid, message);

  } else if (drafts[data.token].players.length >=
    drafts[data.token].player_count) {

    const message = { status: 'Lobby Full' };
    queueMessage(uuid, message);

  } else if (drafts[data.token].state === 'drafting') {

    const message = { status: 'Draft Already Started' };
    queueMessage(uuid, message);

  } else {

    users[uuid].draftSelection = false;
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
    drafts[data.token].picks = [];
    drafts[data.token].commanderpicks = [];
    drafts[data.token].picked_packs = [];
    drafts[data.token].last_round =
      Math.max(...Object.keys(drafts[data.token].rounds).map(Number));

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
  if (intervalIDs[data.token]) {
    clearInterval(intervalIDs[data.token]);
  }

  intervalIDs[data.token] = setInterval(() => {
    checkDraftStatus(drafts[data.token]);
  }, 500);

};

export function rejoinDraft(data, uuid) {

  if (Object.keys(drafts).includes(data.token)) {

    users[uuid].token = data.token;
    drafts[data.token].players =
      drafts[data.token].players.concat(users[uuid]);
    broadcastUserlist(drafts[data.token]);

    for (const seat in drafts[data.token].table) {

      if (drafts[data.token].table[seat].token === data.seat &&
        drafts[data.token].table[seat].player === "") {

        drafts[data.token].table[seat].player = uuid;
        users[uuid].seat = drafts[data.token].table[seat];
      }
    }

    sendCards(uuid, users[uuid].seat);
    if (users[uuid].seat.packAtHand.cards.length > 0) {
      sendPackAtHand(uuid, users[uuid].seat);
    }
  }
};
