import { checkIfRoundIsDone } from "./Utils.js";
import {
  broadcastDraftStatus,
} from "./Broadcasts.js";
import { drafts, intervalIDs } from "./State.js";

export function checkDraftStatus(draft) {
  if (draft.state === 'drafting' && draft.players.length > 0) {
    if (checkIfRoundIsDone(draft.table)) {
      draft.round++;
      if (draft.round <= draft.last_round) {
        goToNextRound(draft);
      } else {
        console.log(`Draft ${draft.token} ended successfully`);
        draft.state = 'deckbuilding';
        broadcastDraftStatus(draft, "Post Draft");
        clearInterval(intervalIDs[draft.token]);
      }
    } else {
      dealPacks(draft);
    }
  } else if (draft.players.length === 0 && draft.state === 'drafting') {
    draft.state = 'disconnected';
    console.log(`Draft ${draft.token} disconnected`);
    clearInterval(intervalIDs[draft.token]);

  } else if (draft.state === 'done') {
    console.log(`Draft ${draft.token} ended`);
    clearInterval(intervalIDs[draft.token]);
    broadcastDraftStatus(draft, "End Draft");
  } else if (draft.players.length == 0 && draft.state === 'Setup Complete') {
    console.log(`Lobby ${draft.token} empty`);
    console.log(`Deleting lobby ${draft.token}`);
    delete drafts[draft.token];
    clearInterval(intervalIDs[draft.token]);
  } else if (draft.players.length == 0) {
    clearInterval(intervalIDs[draft.token]);
    console.log(`Draft ${draft.token} ended`);
  }
}

function goToNextRound(draft) {
  console.log('round:', draft.round);
  draft.direction *= -1;
  for (let i = 0; i < draft.player_count; i++) {
    const player = draft.players[i];
    const pack = [draft.rounds[draft.round][`pack${i}`]];

    player.seat.queue = pack;
  }
}

function dealPacks(draft) {
  for (const seat in draft.table) {
    if (draft.table[seat].packAtHand.cards.length === 0 &&
      draft.table[seat].queue.length > 0) {
      draft.table[seat].packAtHand = draft.table[seat].queue.shift();
    }
  }
}