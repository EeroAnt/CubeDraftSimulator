import { sendMessage } from "./sendMessage";

export const setupDraft = (token, numberOfPlayers, connection, numOfRounds, multiRatio, genericRatio, colorlessRatio, landRatio, commanderPackIncluded, setMode) => {
  const message = {	
	type: "Create Lobby",
	token: token,
	player_count: numberOfPlayers,
	number_of_rounds: numOfRounds,
	multi_ratio: multiRatio,
	generic_ratio: genericRatio,
	colorless_ratio: colorlessRatio,
	land_ratio: landRatio,
	commander_pack_included: commanderPackIncluded
  }
  setMode("Waiting")

  sendMessage(connection, message)
  
};