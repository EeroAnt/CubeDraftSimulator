export const extractDraftState = (draft, player) => {

  const seat = player.seat;
  console.log("breaks here",draft);
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
    canalDredgerOwner: draft.canalDredger || "false",
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

export const handleCanalDredger = (draft, seatNumber) => {
  draft.canalDredger = seatNumber;
  Object.values(draft.players).forEach(player => {
  	player.seat.canalDredger = "true";
  });
};