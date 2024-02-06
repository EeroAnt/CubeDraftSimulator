import { NavBar, Dropdown, Button, setupDraft, Form } from "../../"
import { useEffect } from 'react'


export const Home = ({
	setMode, 
	setNumberOfPlayers, 
	numberOfPlayers, 
	username, 
	setUsername,
	connection,
	setOwner,
	setToken
}) =>{

	
  const login = (username) => {
	setUsername(username)
	connection.sendJsonMessage({
	  type: "Login",
	  username: username
	})
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
	console.log(newtoken) 
  }


  useEffect(() => {
	if (connection.lastJsonMessage && connection.lastJsonMessage.status === "Setup OK") {
	  setMode("Lobby")
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
	  <NavBar
		onClickDraftNavbar={() => setMode("Home")}
		onClickStatNavbar={() => setMode("Stats")}
	  />
	  <h1>Home</h1>

	  <h2>Who are you?</h2>
	  <Form onSubmit={login} name="loginform" />
	</div>
  ) : (
	<div className="main">
	  <NavBar 
	    onClickDraftNavbar={() => setMode("Home")}
	    onClickStatNavbar={() => setMode("Stats")}
	  />
	  <h1>Hi {username}</h1>
	  <h2>Setup a new Draft</h2>
	  <Dropdown name="number of players" handleChange={changePlayerNumber}/>
	  <Button name="init draft" onClick={(e)=>submitSetup()}/>

	  <h2>Join Draft with a token</h2>
	 
	  <Form onSubmit={joinDraft} name="joindraft" />
	</div>
  )
}