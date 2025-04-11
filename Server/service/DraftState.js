export const extractDraftState = (draft, player) => {

  const seat = player.seat;
  if (!seat) {
    console.error('Seat not found for player:', player.uuid);
    return null;
  }
  const state = {
    round: draft.round,
    seat: seat.token,
    packAtHand: seat.packAtHand.cards,
    commanders: seat.commanders,
    main: seat.main,
    side: seat.side,
    canalDredger: seat.canalDredger || "false",
  };
  return state;
};

export const extractQueues = (draft) => {
  const queues = [];
  draft.players.forEach(player => {
    queues.push({
      username: player.username,
      seat: player.seat.number,
      queue: player.seat.queue.length,
      hand: player.seat.packAtHand.cards.length ? 1 : 0
    });
  });
  queues.sort((a, b) => a.seat - b.seat);
  return queues;
};

export const handleCanalDredger = (draft, uuid) => {
  // Find the seat of the player who picked the last card
  const seatEntry = Object.entries(draft.table).find(
    ([_, seat]) => seat.player === uuid
  );

  if (!seatEntry) {
    console.error("Could not find seat for UUID:", uuid);
    return;
  }

  const [seatKey, seat] = seatEntry;

  // Mark this seat's token as the canalDredger
  draft.canalDredger = seat.token;

  // Assign canalDredger state per seat
  Object.values(draft.table).forEach(seatObj => {
    seatObj.canalDredger =
      seatObj.token !== draft.canalDredger ? "true" : "false";
  });
};