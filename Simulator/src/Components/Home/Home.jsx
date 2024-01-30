import { NavBar, Dropdown, Button, setupDraft } from "../../"

export const Home = ({setMode, setNumberOfPlayers, numberOfPlayers }) =>{
  const changePlayerNumber = (event) => {
	event.preventDefault()
	setNumberOfPlayers(event.target.value)
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
	</div>
  )
}