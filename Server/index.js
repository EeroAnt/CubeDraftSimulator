const express = require('express')
const app = express()
const axios = require('axios')

let notes = [
  {
	id: 1,
	content: "HTML is easy",
	important: true
  },
  {
	id: 2,
	content: "Browser can execute only JavaScript",
	important: false
  },
  {
	id: 3,
	content: "GET and POST are the most important methods of HTTP protocol",
	important: true
  }
]
 
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// app.post('/api/notes', (request, response) => {
//   const note = request.body
//   console.log(note)
//   response.json(note)
// })
const generateId = () => {
  const maxId = notes.length > 0
	? Math.max(...notes.map(n => n.id))
	: 0
  return maxId + 1
}
app.post('/api/notes', (request, response) => {
  const body = request.body
 axios.get('http://localhost:3002/pack0').then(response => {
	console.log(response.data)
  })
  .catch(error => {
	console.log("Error: ", error)
  })
  const note = {
	content: body.content,
	important: body.important || false,
	id: generateId(),
  }
  notes = notes.concat(note)

  response.json(note)
})

app.post('/api', (request, response) => {
  console.log(request.body)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})