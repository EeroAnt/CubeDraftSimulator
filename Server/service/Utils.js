export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export function calculateNextSeatNumber(
  seatNumber,
  direction,
  player_count
) {
  if (seatNumber + direction < 0) {
	return player_count - 1;
  } else { return (seatNumber + direction) % player_count;}
};

export function checkIfRoundIsDone(table) {
  for (const seat in table) {
  	if (table[seat].packAtHand.cards.length > 0) {
	    return false;
  	}
	  if (table[seat].queue.length > 0) {
	    return false;
  	}
  } return true;
};