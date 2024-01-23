import { useState, useEffect } from 'react'
import Form from './Components/Forms.jsx'
import Buttons from './Components/Buttons.jsx'
import DraftSetup from './Services/DraftSetup.jsx'
import Packs from './Services/Packs.jsx'
import Image from './Components/Image.jsx'
import './App.css'


function App() {
  const [mode, setMode] = useState(0)
  const [numberOfPlayers, setNumberOfPlayers] = useState(4)

  const changePlayerNumber = (event) => {
	event.preventDefault()
	setNumberOfPlayers(event.target.value)
  }

  const setupDraft = (event) => {
	event.preventDefault()
	setMode(1)
	var token = function() {
		return Math.random().toString(36).slice(2,6)
	}
	DraftSetup.setupDraft(numberOfPlayers, token())
  }

  const cancelSetup = (event) => {
	event.preventDefault()
	setMode(0)
	setNumberOfPlayers(4)
  }

  const initDraft = (event) => {
	event.preventDefault()
	setMode(2)
  }

  

  if (mode === 0) {
  return (
    <>
	  <h1>Let's draft cube!</h1>
	  <Form.Dropdown name="number of players" handleChange={changePlayerNumber}/>
	  <Buttons.Button name="init draft" onClick={setupDraft}/>
	</>
  )
  }
  else if (mode === 1){
	return (
	  <>
	    <h1>Let's draft cube!</h1>
		<h3>Number of players = {numberOfPlayers}</h3>
		<Buttons.Button name="start draft" onClick={initDraft}/>
		<Buttons.Button name="cancel" onClick={cancelSetup}/>
	  </>
	)
  }
  else {
	return (  
	<>
	  <h1>Under construction</h1>
	  <h2>Let's not draft cube yet</h2>
	  <Buttons.Button name="Go Back" onClick={cancelSetup}/>
	</>
  )
}
}


export default App
