import { sendCards } from "./DraftFunctions.js";

export function setCommander(data, userSeat, uuid) {

  userSeat.commanders =
    (userSeat.commanders || []).concat(
      userSeat.main.concat(
        userSeat.side).filter(card => card.id === data.card));

  userSeat.main =
    userSeat.main.filter(card => card.id !== data.card);

  userSeat.side =
    userSeat.side.filter(card => card.id !== data.card);

  sendCards(uuid, userSeat);

};

export function removeCommander(data, userSeat, uuid) {

  userSeat[data.zone] = userSeat[data.zone].concat(
    userSeat.commanders.filter(card => card.id === data.card));

  userSeat.commanders =
    userSeat.commanders.filter(card => card.id !== data.card);

  sendCards(uuid, userSeat);

};

export function moveCards(data, userSeat, uuid) {

  for (const card of data.cards) {

    !userSeat[data.to].includes(card)
      ?
      (userSeat[data.to] = userSeat[data.to].concat(card))
      :
      (console.log("Card already in the zone"));

    userSeat[data.from] =
      userSeat[data.from].filter(c => c.id !== card.id);

  }

  sendCards(uuid, userSeat);

};