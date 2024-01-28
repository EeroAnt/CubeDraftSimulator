import { NavBar, Button } from '../'

export const Setup = ({setMode, numberOfPlayers}) => {
  return (
	<div className="main">
	  <NavBar 
		onClickDraftNavbar={() => setMode("Home")} 
		onClickStatNavbar={() => setMode("Stats")}
	  />
	  <h1>Setup</h1>
	  <p>Number of players: {numberOfPlayers}</p>
	  <Button name="init draft" onClick={() => setMode("Draft")}/>
	</div>
  )
}