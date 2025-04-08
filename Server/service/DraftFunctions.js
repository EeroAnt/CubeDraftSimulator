import { calculateNextSeatNumber, shuffleArray } from './Utils.js';
import { queueMessage } from './Messaging.js';
import { handleCanalDredger } from './DraftState.js';

export function handlePick(data, draft, userSeat, uuid) {

  shuffleArray(userSeat.packAtHand.cards);

  const cardToAdd = userSeat.packAtHand.cards.find(
    card => card.id === data.card
  );

  if (cardToAdd) {

    pickCard(data.zone, cardToAdd, userSeat);
    updateDraftPicks(draft, cardToAdd.id, userSeat);

    if (cardToAdd.id === 1887) {
      console.log("Canal Dredger");
      draft.canalDredger = userSeat.number;
      handleCanalDredger(draft, userSeat.number);
    }

  } else {

    console.log("Card not found");

  }

  passPackToNextPlayer(draft, userSeat);

  sendCards(uuid, userSeat);

};

function updateDraftPicks(draft, pickedCard, userSeat) {

  if (draft.round === 0) {

    const pickObject = {
      "id": pickedCard,
      "pick": 5 - userSeat.packAtHand.cards.length
    };
    draft.commanderpicks.push((pickObject));

  } else {

    const pickObject = {
      "id": pickedCard,
      "pick": 15 - userSeat.packAtHand.cards.length
    };

    draft.picks.push((pickObject));

  }

  userSeat.packAtHand.picks =
    userSeat.packAtHand.picks.concat(pickedCard);

  if (userSeat.packAtHand.cards.length === 0) {

    draft.picked_packs =
      draft.picked_packs.concat([userSeat.packAtHand.picks]);

  }
};

function pickCard(zone, cardToAdd, userSeat) {

  userSeat[zone] = userSeat[zone].concat(cardToAdd);

  userSeat.packAtHand.cards =
    userSeat.packAtHand.cards.filter(card => card.id !== cardToAdd.id);

};

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

};

export function sendCards(uuid, userSeat) {

  const message = {
    status: "OK",
    type: "Picked Cards",
    commanders: userSeat?.commanders || [],
    main: userSeat?.main || [],
    side: userSeat?.side || []
  };

  queueMessage(uuid, message);

};

export function sendPackAtHand(uuid, userSeat) {
  const message = {
    status: "OK",
    type: "Pack",
    pack: userSeat.packAtHand.cards
  };
  queueMessage(uuid, message);
}

export function giveLastCard(draft, pack) {

  draft.table[`seat${draft.canalDredger}`].queue =
    draft.table[`seat${draft.canalDredger}`].queue.concat([pack]);
  pack = { "cards": [], "picks": [] };

};
