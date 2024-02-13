import { MyNavBar, Dropdown, Button, setupDraft, Form } from "../../"
import { useState, useEffect } from 'react'


export const Home = ({
	setMode, 
	setNumberOfPlayers, 
	numberOfPlayers, 
	username, 
	setUsername,
	connection,
	setOwner,
	setToken,
	setAdmin
}) =>{
  const [draftInitiated, setDraftInitiated] = useState(false)
  const [password, setPassword] = useState("")

  const login = (username) => {
	setUsername(username)
	connection.sendJsonMessage({
	  type: "Login",
	  username: username
	})
  }


  const passkey = (value) => {
	setPassword(value)
	if (value === import.meta.env.VITE_ADMIN_PASSKEY) {
	  setAdmin(true)
	}
  }




  const changePlayerNumber = (e) => {
	e.preventDefault()
	setNumberOfPlayers(Number(e.target.value))
  }


  const submitSetup = (e) => {
	setOwner(true)
	var token = function() {
		return Math.random().toString(36).slice(2,6)
	}
	const newtoken = token()
	setToken(newtoken)
	setupDraft(newtoken, numberOfPlayers, connection)
	setDraftInitiated(true)
	console.log(newtoken) 
  }


  useEffect(() => {
	if (connection.lastJsonMessage && connection.lastJsonMessage.status === "Setup OK") {
	  setMode("Lobby")
	} else if (connection.lastJsonMessage && connection.lastJsonMessage.status === "Setup Failed") {
	  alert("Setup failed"+connection.lastJsonMessage.error)
	}
	  }, [connection.lastJsonMessage])


  const joinDraft = (token) => {
	connection.sendJsonMessage({
	  type: "Join Draft",
	  token: token,
	  username: username
	})
	setToken(token)
	setMode("Lobby")

  }

  
  return !username ? (
	<div className="main">
	  <MyNavBar
		onClickDraftNavBar={() => setMode("Home")}
		onClickStatNavBar={() => setMode("Stats")}
	  />
	  <h1>Home</h1>

	  <h2>Who are you?</h2>
	  <Form onSubmit={login} name="loginform" />
	  {(password === "") ? (
		<>
		  <h2>Admin passkey</h2>
		  <Form onSubmit={passkey} name="passkey" /> 
		</>): (null)}
	</div>
  ) : (
	<div className="main">
	  <MyNavBar 
	    onClickDraftNavbar={() => setMode("Home")}
	    onClickStatNavbar={() => setMode("Stats")}
	  />
	  <h1>Hi {username}</h1>
	  {draftInitiated ? (
		<h2>Waiting for response</h2>
	  ) : (
	  <>
	  <h2>Setup a new Draft</h2>
	  <Dropdown name="number of players" handleChange={changePlayerNumber}/>
	  <Button name="init draft" onClick={(e)=>submitSetup()}/>

	  <h2>Join Draft with a token</h2>
	 
	  <Form onSubmit={joinDraft} name="joindraft" />
	  </>
	  )}
	</div>
  )
}