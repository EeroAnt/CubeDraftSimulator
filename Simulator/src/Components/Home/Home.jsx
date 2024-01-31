import { NavBar, Dropdown, Button, setupDraft, Form } from "../../"

export const Home = ({
	setMode, 
	setNumberOfPlayers, 
	numberOfPlayers, 
	username, 
	setUsername, 
	setToken
}) =>{
  


  const changePlayerNumber = (e) => {
	e.preventDefault()
	setNumberOfPlayers(e.target.value)
  }

  const submitSetup = (e) => {
	setMode("Lobby")
	var token = function() {
		return Math.random().toString(36).slice(2,6)
	}
	const newtoken = token()
	setupDraft(numberOfPlayers, newtoken)
	setToken(newtoken)
	console.log(newtoken)
  }

  const joinDraft = (e) => {
	setToken(e)
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
	  <Form onSubmit={setUsername} />
	</div>
  ) : (
	<div className="main">
	  <NavBar 
	    onClickDraftNavbar={() => setMode("Home")} 
	    onClickStatNavbar={() => setMode("Stats")}
	  />
	  <h1>Home</h1>
	  <Dropdown name="number of players" handleChange={changePlayerNumber}/>
	  <Button name="init draft" onClick={(e)=>submitSetup()}/>

	  <h2>Join Draft {username}</h2>
	 
	  <Form onSubmit={joinDraft} />
	</div>
  )
}