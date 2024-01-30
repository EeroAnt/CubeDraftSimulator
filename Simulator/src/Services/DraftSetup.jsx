import axios from 'axios'
const baseUrl = 'http://localhost:3002/'

export const setupDraft = (id, players) => {
  const SetupUrl = baseUrl + 'api/init_draft/' + id +'/'+ players

  return axios.get(SetupUrl
	,{
	headers: {
	  'Access-Control-Allow-Origin': '*',
  }
}
)
}