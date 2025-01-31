import { checkIfRoundIsDone, calculateNextSeatNumber } from "./Utils.js";
import { broadcastDraftStatus } from "./Broadcasts.js";
import { users, connections, intervalIDs } from "./State.js";
import { sendMessage } from "./Messaging.js";

export function checkDraftStatus(draft) {
  if (draft.state === 'drafting' && draft.players.length > 0) {
    if (checkIfRoundIsDone(draft.table)) {
      draft.round++;
      if (draft.round < Object.keys(draft.rounds).length) {
        goToNextRound(draft);
      } else {
        draft.state = 'deckbuilding';
        broadcastDraftStatus(draft, "Post Draft");
        clearInterval(intervalIDs[draft.token]);
      }
    } else {
      for (const seat in draft.table) {
        if (draft.table[seat].packAtHand.cards.length === 0 &&
          draft.table[seat].queue.length > 0) {

          console.log('giving pack to player');

          draft.table[seat].packAtHand = draft.table[seat].queue.shift();
          connections[draft.table[seat].player].send(JSON.stringify({
            status: "OK",
            type: "Pack",
            pack: draft.table[seat].packAtHand.cards
          }));
        }
      }
    }
  } else if (draft.players.length === 0 && draft.state === 'drafting') {
    draft.state = 'disconnected';
    console.log('disconnected');

  } else if (draft.state === 'done') {
    console.log('draft ended');
    clearInterval(intervalIDs[draft.token]);
    broadcastDraftStatus(draft, "End Draft");
  } else if (draft.state === 'deckbuilding') {

  } else {
    clearInterval(intervalIDs[draft.token]);
    console.log('draft ended');
  }
}


function goToNextRound(draft) {
  console.log('round:', draft.round);
  draft.direction *= -1;
  for (let i = 0; i < draft.player_count; i++) {
    const player = draft.players[i];
    const pack = [draft.rounds[draft.round][`pack${i}`]];

    const { left, right } = checkNeighbours(draft, player);

    const message = {
      status: "OK",
      type: "Neighbours",
      left: left,
      right: right,
      direction: draft.direction,
      seatToken: player.seat.token
    };
    
    sendMessage(player.uuid, message);

    player.seat.queue = pack;
  }
}

function checkNeighbours(draft, player) {
  const playerOnTheLeft =
    users[draft.table[`seat${[calculateNextSeatNumber(
      player.seat.number,
      1,
      draft.player_count)]}`].player];

  const playerOnTheRight =
    users[draft.table[`seat${[calculateNextSeatNumber(
      player.seat.number,
      -1,
      draft.player_count
    )]}`].player];

  return {
    left: playerOnTheLeft.username,
    right: playerOnTheRight.username
  };
}