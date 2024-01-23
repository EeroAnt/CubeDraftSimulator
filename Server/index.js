const express = require('express')
const app = express()
const axios = require('axios')



app.get('/api/init_draft/:player_count/:token', (request, response) => {
  const player_count = request.params.player_count
  const token = request.params.token
  axios.get(`http://127.0.0.1:5000/${player_count}/${token}`).then(res => {
  response.send("draft ready")
  return res.data
  }).catch(err => {
	console.log(err)
	console.log("Something went wrong with the draft setup")
  })
})
 
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})