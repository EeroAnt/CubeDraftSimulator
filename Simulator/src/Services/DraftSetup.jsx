export const setupDraft = (token, numberOfPlayers, connection, numOfRounds, multiRatio, genericRatio, colorlessRatio, landRatio, commanderPackIncluded) => {
  connection.sendJsonMessage({	
	type: "Create Lobby",
	token: token,
	player_count: numberOfPlayers,
	number_of_rounds: numOfRounds,
	multi_ratio: multiRatio,
	generic_ratio: genericRatio,
	colorless_ratio: colorlessRatio,
	land_ratio: landRatio,
	commander_pack_included: commanderPackIncluded
  })
};