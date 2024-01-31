import { useState, useEffect } from 'react'
import Form from './Components/Forms/Forms.jsx'
import Buttons from './Components/Buttons/Buttons.jsx'
import DraftSetup from './Services/DraftSetup.jsx'
import Packs from './Services/Packs.jsx'
import Image from './Components/CardImage/CardImage.jsx'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import NavBar from './Components/'


function App() {
  const [mode, setMode] = useState("Index")
  const [numberOfPlayers, setNumberOfPlayers] = useState(4)

  const changePlayerNumber = (event) => {
	event.preventDefault()
	setNumberOfPlayers(event.target.value)
  }

  const setupDraft = (event) => {
	event.preventDefault()
	setMode("Setup")
	var token = function() {
		return Math.random().toString(36).slice(2,6)
	}
	DraftSetup.setupDraft(numberOfPlayers, token())
  }

  const cancelSetup = (event) => {
	event.preventDefault()
	setMode("Index")
	setNumberOfPlayers(4)
  }

  const initDraft = (event) => {
	event.preventDefault()
	setMode("Draft")
  }

  

  if (mode === "Index") {
  return (
    <>
	  <NavBar />
	  <h1>Let's draft cube!</h1>
	  <Form.Dropdown name="number of players" handleChange={changePlayerNumber}/>
	  <Buttons.Button name="init draft" onClick={setupDraft}/>
	</>
  )
  }
  if (mode === "Setup"){
	return (
	  <>
	  	<NavBar />
	    <h1>Let's draft cube!</h1>
		<h3>Number of players = {numberOfPlayers}</h3>
		<Buttons.Button name="start draft" onClick={initDraft}/>
		<Buttons.Button name="cancel" onClick={cancelSetup}/>
	  </>
	)
  }
  if (mode === "Draft"){
	return (  
	<>
	  <h1>Under construction</h1>
	  <h2>Let's not draft cube yet</h2>
	  <Button name="Go Back" onClick={cancelSetup}/>
	</>
  )
}
}


export default App
