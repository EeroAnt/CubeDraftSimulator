const express = require('express')
const app = express()
const axios = require('axios')
let data = []

app.get('/api/draft', (request, response) => {
  axios.get('http://127.0.0.1:5000/setup/trial534').then(res => {
	console.log(res.data['pack0'])
	data = res.data
  })
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})