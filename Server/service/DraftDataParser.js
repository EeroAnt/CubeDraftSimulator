export function parseDraftData(draft, draftDataDecision) {

  const draftedPools = draft.players.map(player => {
    const seatKey = `seat${player.seat.number}`;
    const playerData = draft.table[seatKey];

    if (!playerData) {
        console.warn(`No data found for seat ${player.seat.number}`);
        return null;
    }

    return {
        username: player.username,
        seatToken: player.seat.token,
        draftToken: draft.token,
        cards: playerData.commanders.concat(
          playerData.main, playerData.side).map(card => card.id)
    };
}).filter(player => player !== null);
  const draftData = {
    packs: draft.picked_packs,
    pools: draftedPools,
    draftDataDecision: draftDataDecision
  };
  return draftData;
}