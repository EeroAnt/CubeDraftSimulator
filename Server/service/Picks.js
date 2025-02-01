export function updateDraftPicks(draft, pickedCard, userSeat) {
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
}

export function pickCard(zone, cardToAdd, userSeat) {

  userSeat[zone] = userSeat[zone].concat(cardToAdd);

  userSeat.packAtHand.cards =
    userSeat.packAtHand.cards.filter(card => card.id !== cardToAdd.id);

}