import { useState } from 'react'
import styles from './App.module.css'
import { Home, Stats, Setup, Draft } from '../'
import 'bootstrap/dist/css/bootstrap.min.css'

export const App = () => {
  const [mode, setMode] = useState("Home")
  const [numberOfPlayers, setNumberOfPlayers] = useState(4)

  return (
	<div className={styles.App}>
	  
	  {mode === "Home" && (
	    <Home 
		  setMode={setMode}
		  setNumberOfPlayers={setNumberOfPlayers}
		  numberOfPlayers={numberOfPlayers} />
	  )}
	  
	  {mode === "Setup" && (
	    <Setup 
		  setMode={setMode}
		  numberOfPlayers={numberOfPlayers} />
	  )}
	  
	  {mode === "Draft" && (
	    <Draft
		  setMode={setMode} />
	  )}
	  
	  {mode === "DeckBuilder" && (
	    <DeckBuilder
		  setMode={setMode} />
	  )}
	  
	  {mode === "Stats" && (
		<Stats 
		  setMode={setMode} />
	)}
	</div>
  )
}