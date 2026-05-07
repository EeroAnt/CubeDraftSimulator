import { checkIfRoundIsDone } from "./Utils.js";
import {
  broadcastDraftStatus,
} from "./Broadcasts.js";
import { drafts, intervalIDs } from "./State.js";

export function checkDraftStatus(draft) {
  const nonNPCPlayers = draft.players.filter(player => !player.isNPC);
  if (draft.state === 'drafting' && nonNPCPlayers.length > 0) {
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
  } else if (nonNPCPlayers.length === 0 && draft.state === 'drafting') {
    clearNPCIntervals(draft);
    draft.state = 'disconnected';
    console.log(`Draft ${draft.token} disconnected`);
    clearInterval(intervalIDs[draft.token]);
  } else if (draft.state === 'done') {
    clearNPCIntervals(draft);
    console.log(`Draft ${draft.token} ended`);
    clearInterval(intervalIDs[draft.token]);
    broadcastDraftStatus(draft, "End Draft");
  } else if (nonNPCPlayers == 0 && draft.state === 'Setup Complete') {
    console.log(`Lobby ${draft.token} empty`);
    clearNPCIntervals(draft);
    console.log(`Deleting lobby ${draft.token}`);
    delete drafts[draft.token];
    clearInterval(intervalIDs[draft.token]);
  } else if (nonNPCPlayers.length == 0) {
    clearNPCIntervals(draft);
    clearInterval(intervalIDs[draft.token]);
    console.log(`Draft ${draft.token} abandoned`);
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

function clearNPCIntervals(draft) {
  draft.players.forEach(player => {
    if (player.isNPC && intervalIDs[player.uuid]) {
      clearInterval(intervalIDs[player.uuid]);
      delete intervalIDs[player.uuid];
    }
  });
}