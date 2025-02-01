import { calculateNextSeatNumber, shuffleArray } from './Utils.js';
import { sendMessage } from './Messaging.js';
import { broadcastCanalDredger } from './Broadcasts.js';

export function handlePick(data, draft, userSeat, uuid) {
  
  shuffleArray(userSeat.packAtHand.cards);

  const cardToAdd = userSeat.packAtHand.cards.find(
    card => card.id === data.card
  );

  if (cardToAdd) {

    pickCard(data.zone, cardToAdd, userSeat);
    updateDraftPicks(draft, cardToAdd, userSeat);

    if (cardToAdd.id === 1887) {
      console.log("Canal Dredger");
      broadcastCanalDredger(draft, userSeat.number);
    }

  } else {

    console.log("Card not found");

  }

  passPackToNextPlayer(draft, userSeat);

  sendCards(uuid, userSeat);
  
}

function updateDraftPicks(draft, pickedCard, userSeat) {

  if (draft.round === 0) {
    // Remove magic numbers
    draft.commanderpicks[pickedCard] =
      6 - userSeat.packAtHand.cards.length;

  } else {

    draft.picks[pickedCard] =
      16 - userSeat.packAtHand.cards.length;

  }

  userSeat.packAtHand.picks =
    userSeat.packAtHand.picks.concat(pickedCard);

  if (userSeat.packAtHand.cards.length === 0) {

    draft.picked_packs =
      draft.picked_packs.concat([userSeat.packAtHand.picks]);

  }
}

function pickCard(zone, cardToAdd, userSeat) {

  userSeat[zone] = userSeat[zone].concat(cardToAdd);

  userSeat.packAtHand.cards =
    userSeat.packAtHand.cards.filter(card => card.id !== cardToAdd.id);

}

function passPackToNextPlayer(draft, userSeat) {

  const nextSeatNumber = calculateNextSeatNumber(
    userSeat.number,
    draft.direction,
    draft.player_count
  );

  draft.table[`seat${nextSeatNumber}`].queue =
    draft.table[`seat${nextSeatNumber}`].
      queue.concat([userSeat.packAtHand]);

  userSeat.packAtHand = { "cards": [], "picks": [] };

}

export function sendCards(uuid, userSeat) {

  const message = {
    status: "OK",
    type: "Picked Cards",
    commanders: userSeat.commanders,
    main: userSeat.main,
    side: userSeat.side
  };

  sendMessage(uuid, message);

}