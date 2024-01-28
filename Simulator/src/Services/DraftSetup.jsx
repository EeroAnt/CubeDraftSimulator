import axios from 'axios'
const baseUrl = 'http://localhost:3002/'

const setupDraft = (id, players) => {
  const SetupUrl = baseUrl + 'api/drafts/' + id +'/'+ players

  return axios.get(SetupUrl
	,{
	headers: {
	  'Access-Control-Allow-Origin': '*',
  }
}
)
}

export default { setupDraft }
