export default function calculateNextSeatNumber(
  seatNumber,
  direction,
  player_count
) {
  if (seatNumber + direction < 0) {
	return player_count - 1;
  } else { return (seatNumber + direction) % player_count;}
}