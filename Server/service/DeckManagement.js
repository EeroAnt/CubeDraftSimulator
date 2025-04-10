export function setCommander(data, userSeat) {

  userSeat.commanders =
    (userSeat.commanders || []).concat(
      userSeat.main.concat(
        userSeat.side).filter(card => card.id === data.card));

  userSeat.main =
    userSeat.main.filter(card => card.id !== data.card);

  userSeat.side =
    userSeat.side.filter(card => card.id !== data.card);

};

export function removeCommander(data, userSeat) {

  userSeat[data.zone] = userSeat[data.zone].concat(
    userSeat.commanders.filter(card => card.id === data.card));

  userSeat.commanders =
    userSeat.commanders.filter(card => card.id !== data.card);

};

export function moveCards(data, userSeat) {

  for (const card of data.cards) {

    !userSeat[data.to].includes(card)
      ?
      (userSeat[data.to] = userSeat[data.to].concat(card))
      :
      (console.log("Card already in the zone"));

    userSeat[data.from] =
      userSeat[data.from].filter(c => c.id !== card.id);
  }
};