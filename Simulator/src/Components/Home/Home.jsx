import { NavBar, Dropdown, Button, setupDraft, Form } from "../../"

export const Home = ({
	setMode, 
	setNumberOfPlayers, 
	numberOfPlayers, 
	username, 
	setUsername, 
	token,
	setToken
}) =>{
	
  const changePlayerNumber = (event) => {
	event.preventDefault()
	setNumberOfPlayers(event.target.value)
  }
  
  const changeUsername = (event) => {
	setUsername(event.target.value)
  }

  const changeToken = (event) => {
	setToken(event.target.value)
  }

  const submitSetup = (event) => {
	setMode("Setup")
	var token = function() {
		return Math.random().toString(36).slice(2,6)
	}
	setupDraft(numberOfPlayers, token())
  }

  return (
	<div className="main">
		<NavBar 
		  onClickDraftNavbar={() => setMode("Home")} 
		  onClickStatNavbar={() => setMode("Stats")}
		/>
		<h1>Home</h1>
		<Dropdown name="number of players" handleChange={changePlayerNumber}/>
	    <Button name="init draft" onClick={(event)=>submitSetup()}/>

		<h2>Join Draft</h2>
		<Form name="Username" value={username} onChange={changeUsername}/>
		<Form name="Token" value={token} onChange={changeToken}/>
	</div>
  )
}