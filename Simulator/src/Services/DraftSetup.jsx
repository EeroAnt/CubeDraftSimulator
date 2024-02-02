import axios from 'axios'
const baseUrl = 'http://localhost:3002/'

export const setupDraft = (token, numberOfPlayers, connection) => {
  const SetupUrl = baseUrl + 'api/init_draft/' + numberOfPlayers +'/'+ token

  return axios.get(SetupUrl).then(res => {
	connection.sendJsonMessage({
		type: "Create Lobby",
		token: token,
		player_count: numberOfPlayers
	  })
  })
}